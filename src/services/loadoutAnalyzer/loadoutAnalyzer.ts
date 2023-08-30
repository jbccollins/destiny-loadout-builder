import { Loadout } from '@destinyitemmanager/dim-api-types';
import { EAspectId } from '@dlb/generated/aspect/EAspectId';
import { EClassAbilityId } from '@dlb/generated/classAbility/EClassAbilityId';
import { EFragmentId } from '@dlb/generated/fragment/EFragmentId';
import { EGrenadeId } from '@dlb/generated/grenade/EGrenadeId';
import { EJumpId } from '@dlb/generated/jump/EJumpId';
import { EMeleeId } from '@dlb/generated/melee/EMeleeId';
import { EModId } from '@dlb/generated/mod/EModId';
import { ESuperAbilityId } from '@dlb/generated/superAbility/ESuperAbilityId';
import { getDefaultArmorSlotEnergyMapping } from '@dlb/redux/features/reservedArmorSlotEnergy/reservedArmorSlotEnergySlice';
import {
	doProcessArmor,
	DoProcessArmorParams,
	preProcessArmor,
} from '@dlb/services/processArmor';
import { roundDown10 } from '@dlb/services/processArmor/utils';
import {
	AllClassItemMetadata,
	Armor,
	ArmorItem,
	DestinyClassToAllClassItemMetadataMapping,
	getExtraMasterworkedStats,
	StrictArmorItems,
} from '@dlb/types/Armor';
import { ArmorSlotIdList } from '@dlb/types/ArmorSlot';
import {
	ArmorStatIdList,
	ArmorStatIndices,
	ArmorStatMapping,
	getArmorStatIdFromBungieHash,
	getArmorStatMappingFromFragments,
	getDefaultArmorStatMapping,
} from '@dlb/types/ArmorStat';
import { getAspectByHash } from '@dlb/types/Aspect';
import { getClassAbilityByHash } from '@dlb/types/ClassAbility';
import {
	ApiDestinyClassTypeToDestinyClassId,
	DestinyClassIdList,
	getDestinyClassIdByDestinySubclassId,
} from '@dlb/types/DestinyClass';
import { getDestinySubclassByHash } from '@dlb/types/DestinySubclass';
import { getFragmentByHash } from '@dlb/types/Fragment';
import { getGrenadeByHash } from '@dlb/types/Grenade';
import {
	EDestinyClassId,
	EDestinySubclassId,
	EDimLoadoutsFilterId,
	EGearTierId,
	EInGameLoadoutsFilterId,
	EMasterworkAssumption,
} from '@dlb/types/IdEnums';
import { getJumpByHash } from '@dlb/types/Jump';
import { getMeleeByHash } from '@dlb/types/Melee';
import {
	AllStatModHashes,
	getDefaultArmorSlotIdToModIdListMapping,
	getModByHash,
} from '@dlb/types/Mod';
import { getSuperAbilityByHash } from '@dlb/types/SuperAbility';

export enum ELoadoutType {
	DIM = 'DIM',
	InGame = 'InGame',
}

// We should be able to completely populate the redux store from this config
// such that using the tool "just works"
export type DLBConfig = {
	classAbilityId: EClassAbilityId;
	jumpId: EJumpId;
	superAbilityId: ESuperAbilityId;
	meleeId: EMeleeId;
	grenadeId: EGrenadeId;
	aspectIdList: EAspectId[];
	fragmentIdList: EFragmentId[];
	desiredStatTiers: ArmorStatMapping;
	destinyClassId: EDestinyClassId;
	destinySubclassId: EDestinySubclassId;
	exoticHash: number;
};

export type AnalyzableLoadout = {
	armor: ArmorItem[];
	modIdList: EModId[];
	id: string;
	loadoutType: ELoadoutType;
	icon: string;
	name?: string;
} & DLBConfig;

const flattenArmor = (
	armor: Armor,
	allClassItemMetadata: DestinyClassToAllClassItemMetadataMapping
): ArmorItem[] => {
	let armorItems: ArmorItem[] = [];
	DestinyClassIdList.forEach((destinyClassId) => {
		ArmorSlotIdList.forEach((armorSlotId) => {
			['exotic', 'nonExotic'].forEach((exoticOrNonExotic) => {
				armorItems = armorItems.concat(
					Object.values(armor[destinyClassId][armorSlotId][exoticOrNonExotic])
				);
			});
		});
		Object.values(allClassItemMetadata[destinyClassId]).forEach(
			(classItemMetadata) => {
				armorItems = armorItems.concat(classItemMetadata.items);
			}
		);
	});
	return armorItems;
};

export const buildLoadouts = (
	dimLoadouts: Loadout[],
	armor: Armor,
	allClassItemMetadata: DestinyClassToAllClassItemMetadataMapping,
	masterworkAssumption: EMasterworkAssumption
): Record<string, AnalyzableLoadout> => {
	const loadouts: AnalyzableLoadout[] = [];
	const armorItems = flattenArmor(armor, allClassItemMetadata);
	dimLoadouts.forEach((dimLoadout) => {
		const loadout: AnalyzableLoadout = {
			exoticHash: 0,
			armor: [],
			desiredStatTiers: null,
			modIdList: [],
			id: dimLoadout.id,
			name: dimLoadout.name,
			loadoutType: ELoadoutType.DIM,
			icon: null,
			destinyClassId: ApiDestinyClassTypeToDestinyClassId[dimLoadout.classType],
			destinySubclassId: null,
			classAbilityId: null,
			jumpId: null,
			superAbilityId: null,
			meleeId: null,
			grenadeId: null,
			aspectIdList: [],
			fragmentIdList: [],
		};

		const desiredStatTiers: ArmorStatMapping = getDefaultArmorStatMapping();

		// TODO: Stat constraints may not respect fragment bonus changes
		// If a loadout was created, then later bungie adds a penalty to a fragment
		// that loadout may no longer be able to reach the stat constraints
		// If the user is unable to reach the stat constraints, then we should
		// mark the loadout as one that the user might want to check on
		const hasStatConstraints = false; // !!dimLoadout.parameters?.statConstraints;
		if (hasStatConstraints) {
			const statConstraints = dimLoadout.parameters.statConstraints;
			statConstraints.forEach((statConstraint) => {
				const minTier = (statConstraint.minTier || 0) * 10;
				const armorStatId = getArmorStatIdFromBungieHash(
					statConstraint.statHash
				);
				desiredStatTiers[armorStatId] += minTier;
			});
		}
		dimLoadout.equipped.forEach((equippedItem) => {
			// This is an edge case that I don't think will ever happen...
			// TODO: Check with the DIM devs on this one
			// If a loadout doesn't have stat constraints for whatever reason
			// then we fall back to pulling stat tiers from the existing armor
			// in the loadout. This is less ideal than using the stat constraints
			if (!hasStatConstraints) {
				const armorItem = armorItems.find(
					(armorItem) => armorItem.id === equippedItem.id
				);
				if (armorItem) {
					if (armorItem.gearTierId === EGearTierId.Exotic) {
						loadout.exoticHash = armorItem.hash;
					}
					loadout.armor.push(armorItem);

					const extraMasterworkedStats = getExtraMasterworkedStats(
						armorItem,
						masterworkAssumption
					);
					ArmorStatIdList.forEach((armorStatId) => {
						desiredStatTiers[armorStatId] +=
							armorItem.stats[ArmorStatIndices[armorStatId]] +
							extraMasterworkedStats;
					});
				}
			}
			// This is the subclass definition. Contains all the aspects and fragments
			// TODO: Is this safe? Will this always be a subclass?
			// can other things have socketOverrides?
			if (equippedItem.socketOverrides) {
				const subclassHash = equippedItem.hash;
				const classAbilityHash = equippedItem.socketOverrides[0] || null;
				const jumpHash = equippedItem.socketOverrides[1] || null;
				const superAbilityHash = equippedItem.socketOverrides[2] || null;
				const meleeHash = equippedItem.socketOverrides[3] || null;
				const grenadeHash = equippedItem.socketOverrides[4] || null;
				const aspectHashes = [
					equippedItem.socketOverrides[5],
					equippedItem.socketOverrides[6],
				].filter((x) => !!x);
				const fragmentHashes = [
					equippedItem.socketOverrides[7],
					equippedItem.socketOverrides[8],
					equippedItem.socketOverrides[9],
					equippedItem.socketOverrides[10],
					equippedItem.socketOverrides[11],
				].filter((x) => !!x);
				// TODO: Refactor all these get by hash functions.
				// They all iterate over the Object.values of the id mapping
				// Just make a second mapping for quick hash lookups
				// The mapping can just be hash -> id
				loadout.destinySubclassId = subclassHash
					? (getDestinySubclassByHash(subclassHash).id as EDestinySubclassId)
					: null;

				if (loadout.destinySubclassId) {
					const destinyClassId = getDestinyClassIdByDestinySubclassId(
						loadout.destinySubclassId
					);
					loadout.destinyClassId = destinyClassId || null;
				}
				loadout.classAbilityId = classAbilityHash
					? (getClassAbilityByHash(classAbilityHash).id as EClassAbilityId)
					: null;
				loadout.jumpId = jumpHash
					? (getJumpByHash(jumpHash).id as EJumpId)
					: null;
				loadout.superAbilityId = superAbilityHash
					? (getSuperAbilityByHash(superAbilityHash).id as ESuperAbilityId)
					: null;
				loadout.meleeId = meleeHash
					? (getMeleeByHash(meleeHash).id as EMeleeId)
					: null;
				loadout.grenadeId = grenadeHash
					? (getGrenadeByHash(grenadeHash).id as EGrenadeId)
					: null;
				aspectHashes.forEach((hash) => {
					loadout.aspectIdList.push(getAspectByHash(hash).id as EAspectId);
				});
				fragmentHashes.forEach((hash) => {
					const fragment = getFragmentByHash(hash);
					loadout.fragmentIdList.push(fragment.id as EFragmentId);
				});
			}
		});
		dimLoadout.parameters?.mods?.forEach((hash) => {
			// Add all the stat mods to the desired stat tiers
			if (!AllStatModHashes.includes(hash)) {
				return;
			}
			const mod = getModByHash(hash);
			mod.bonuses.forEach((bonus) => {
				desiredStatTiers[bonus.stat] += bonus.value;
			});
		});
		const fragmentArmorStatMapping = getArmorStatMappingFromFragments(
			loadout.fragmentIdList,
			loadout.destinyClassId
		);
		ArmorStatIdList.forEach((armorStatId) => {
			desiredStatTiers[armorStatId] += fragmentArmorStatMapping[armorStatId];
		});

		loadout.desiredStatTiers = desiredStatTiers;
		loadouts.push(loadout);
	});
	const result: Record<string, AnalyzableLoadout> = {};
	loadouts
		.filter(
			(x) =>
				// TODO: Is this "5" check safe? Does DIM just assume "any legendary class item" if none is provided?
				// TODO: Handle deleted exotic armor. Right now this check assumes that your loadout
				// has a non-deleted exotic armor piece. But we don't care about that. As long as you have ANY
				// exotic armor that matches the type of exotic armor that was deleted we can still process this
				// (assuming that we also have stat constraints I think)
				x.armor.length === 5 &&
				x.armor.some((x) => x.gearTierId === EGearTierId.Exotic)
		)
		.forEach((x) => (result[x.id] = x));
	return result;
};

type GeneratePreProcessedArmorParams = {
	armor: Armor;
	loadout: AnalyzableLoadout;
	allClassItemMetadata: DestinyClassToAllClassItemMetadataMapping;
};
type GeneratePreProcessedArmorOutput = {
	preProcessedArmor: StrictArmorItems;
	allClassItemMetadata: AllClassItemMetadata;
};
const generatePreProcessedArmor = (
	params: GeneratePreProcessedArmorParams
): GeneratePreProcessedArmorOutput => {
	const { armor, loadout, allClassItemMetadata } = params;
	const selectedExoticArmor = loadout.armor.find(
		(x) => x.gearTierId === EGearTierId.Exotic
	);
	const destinyClassId = loadout.destinyClassId;
	const [preProcessedArmor, _allClassItemMetadata] = preProcessArmor(
		armor[destinyClassId],
		selectedExoticArmor,
		[],
		EDimLoadoutsFilterId.All,
		[],
		EInGameLoadoutsFilterId.All,
		EGearTierId.Legendary,
		allClassItemMetadata[destinyClassId]
	);
	return {
		preProcessedArmor,
		allClassItemMetadata: _allClassItemMetadata,
	};
};

enum ELoadoutOptimizationType {
	HigherStatTier = 'HigherStatTier',
	LowerCost = 'LowerCost',
}
// Return all AnalyzableLoadouts that can reach higher stat tiers or that
// can reach the same stat tiers, but for cheaper.
// TODO: Possibly in the future make this also return loadouts with fewer
// wasted stats

export enum EGetLoadoutsThatCanBeOptimizedProgresstype {
	Progress = 'progress',
	Error = 'error',
}

export type GetLoadoutsThatCanBeOptimizedProgress = {
	type: EGetLoadoutsThatCanBeOptimizedProgresstype;
	canBeOptimized?: boolean;
};

export type GetLoadoutsThatCanBeOptimizedParams = {
	loadouts: Record<string, AnalyzableLoadout>;
	armor: Armor;
	masterworkAssumption: EMasterworkAssumption;
	allClassItemMetadata: DestinyClassToAllClassItemMetadataMapping;
	progressCallback: (
		progress: GetLoadoutsThatCanBeOptimizedProgress
	) => unknown;
};
export type GetLoadoutsThatCanBeOptimizedOutputItem = {
	optimizationTypes: ELoadoutOptimizationType[];
	loadoutId: string;
	tierDiff: number;
};

export const getLoadoutsThatCanBeOptimized = (
	params: GetLoadoutsThatCanBeOptimizedParams
): GetLoadoutsThatCanBeOptimizedOutputItem[] => {
	const result: GetLoadoutsThatCanBeOptimizedOutputItem[] = [];
	const {
		loadouts,
		armor,
		masterworkAssumption,
		allClassItemMetadata,
		progressCallback,
	} = params;
	Object.values(loadouts).forEach((loadout) => {
		try {
			const { preProcessedArmor, allClassItemMetadata: _allClassItemMetadata } =
				generatePreProcessedArmor({
					armor,
					loadout,
					allClassItemMetadata,
				});

			const fragmentArmorStatMapping = getArmorStatMappingFromFragments(
				loadout.fragmentIdList,
				loadout.destinyClassId
			);

			// TODO: Flesh out the non-default stuff like
			// raid mods, placements, armor slot mods,
			const doProcessArmorParams: DoProcessArmorParams = {
				masterworkAssumption,
				desiredArmorStats: loadout.desiredStatTiers,
				armorItems: preProcessedArmor,
				fragmentArmorStatMapping,
				modArmorStatMapping: getDefaultArmorStatMapping(),
				potentialRaidModArmorSlotPlacements: null,
				armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
				raidMods: [],
				intrinsicArmorPerkOrAttributeIds: [],
				destinyClassId: loadout.destinyClassId,
				reservedArmorSlotEnergy: getDefaultArmorSlotEnergyMapping(),
				useZeroWastedStats: false,
				allClassItemMetadata: _allClassItemMetadata,
			};
			const processedArmor = doProcessArmor(doProcessArmorParams);
			let maxDiff = 0;
			let hasHigherStatTiers = false;
			ArmorStatIdList.forEach((armorStatId) => {
				const processedArmorVal =
					processedArmor.maxPossibleDesiredStatTiers[armorStatId];
				const existingVal = roundDown10(loadout.desiredStatTiers[armorStatId]);
				maxDiff = Math.max(maxDiff, processedArmorVal / 10 - existingVal / 10);
				if (maxDiff > 0) {
					hasHigherStatTiers = true;
				}
			});
			if (hasHigherStatTiers) {
				result.push({
					tierDiff: maxDiff,
					optimizationTypes: [ELoadoutOptimizationType.HigherStatTier],
					loadoutId: loadout.id,
				});
				progressCallback({
					type: EGetLoadoutsThatCanBeOptimizedProgresstype.Progress,
					canBeOptimized: true,
				});
			} else {
				progressCallback({
					type: EGetLoadoutsThatCanBeOptimizedProgresstype.Progress,
					canBeOptimized: false,
				});
			}
		} catch (e) {
			progressCallback({
				type: EGetLoadoutsThatCanBeOptimizedProgresstype.Error,
			});
		}
	});

	return result;
};

// Worker types
export enum EMessageType {
	Progress = 'progress',
	Results = 'results',
	Error = 'error',
}

export type Message = {
	type: EMessageType;
	payload:
		| GetLoadoutsThatCanBeOptimizedProgress
		| GetLoadoutsThatCanBeOptimizedOutputItem[]
		| Error;
};

export type Progress = {
	loadoutType: ELoadoutType;
};

export type PostMessageParams = Omit<
	GetLoadoutsThatCanBeOptimizedParams,
	'progressCallback'
>;

export interface GetLoadoutsThatCanBeOptimizedWorker
	extends Omit<Worker, 'postMessage'> {
	postMessage(data: PostMessageParams): void;
}
