import { Loadout } from '@destinyitemmanager/dim-api-types';
import { EAspectId } from '@dlb/generated/aspect/EAspectId';
import { EClassAbilityId } from '@dlb/generated/classAbility/EClassAbilityId';
import { EFragmentId } from '@dlb/generated/fragment/EFragmentId';
import { EGrenadeId } from '@dlb/generated/grenade/EGrenadeId';
import { EJumpId } from '@dlb/generated/jump/EJumpId';
import { EMeleeId } from '@dlb/generated/melee/EMeleeId';
import { ESuperAbilityId } from '@dlb/generated/superAbility/ESuperAbilityId';
import { getDefaultArmorSlotEnergyMapping } from '@dlb/redux/features/reservedArmorSlotEnergy/reservedArmorSlotEnergySlice';

import {
	doProcessArmor,
	DoProcessArmorParams,
	preProcessArmor,
} from '@dlb/services/processArmor';
import { roundDown10, sumModCosts } from '@dlb/services/processArmor/utils';
import {
	AnalyzableLoadout,
	AnalyzableLoadoutBreakdown,
	ELoadoutType,
	getDefaultAnalyzableLoadout,
} from '@dlb/types/AnalyzableLoadout';
import {
	AllClassItemMetadata,
	Armor,
	ArmorItem,
	DestinyClassToAllClassItemMetadataMapping,
	getExtraMasterworkedStats,
	StrictArmorItems,
} from '@dlb/types/Armor';
import {
	ArmorSlotIdList,
	ArmorSlotWithClassItemIdList,
} from '@dlb/types/ArmorSlot';
import {
	ArmorStatIdList,
	ArmorStatIndices,
	ArmorStatMapping,
	getArmorStatIdFromBungieHash,
	getArmorStatMappingFromFragments,
	getArmorStatMappingFromMods,
	getDefaultArmorStatMapping,
} from '@dlb/types/ArmorStat';
import { getAspectByHash } from '@dlb/types/Aspect';
import { getClassAbilityByHash } from '@dlb/types/ClassAbility';
import {
	DestinyClassIdList,
	getDestinyClassIdByDestinySubclassId,
} from '@dlb/types/DestinyClass';
import {
	getDestinySubclassByHash,
	oldToNewSubclassHashes,
} from '@dlb/types/DestinySubclass';
import { DestinyClassHashToDestinyClass } from '@dlb/types/External';
import { getFragmentByHash } from '@dlb/types/Fragment';
import { EnumDictionary } from '@dlb/types/globals';
import { getGrenadeByHash } from '@dlb/types/Grenade';
import {
	EArmorSlotId,
	EDestinySubclassId,
	EDimLoadoutsFilterId,
	EGearTierId,
	EInGameLoadoutsFilterId,
	EMasterworkAssumption,
	EModCategoryId,
	EModSocketCategoryId,
} from '@dlb/types/IdEnums';
import { getJumpByHash } from '@dlb/types/Jump';
import { getMeleeByHash } from '@dlb/types/Melee';
import {
	getMod,
	getModByHash,
	getValidRaidModArmorSlotPlacements,
} from '@dlb/types/Mod';
import { getSuperAbilityByHash } from '@dlb/types/SuperAbility';

// A loadout that has some armor, mods or subclass options selected is considered valid
// If a loadout just contains weapons, shaders, etc. then it is considered invalid
// TODO: Handle the case where the exotic armor piece was deleted
const isEditableLoadout = (loadout: AnalyzableLoadout): boolean => {
	const nonClassItemArmor = loadout.armor.filter(
		(x) => x.armorSlot !== EArmorSlotId.ClassItem
	);
	const hasOnlyLegendaryArmor =
		nonClassItemArmor.length === 4 &&
		nonClassItemArmor.every((x) => x.gearTierId === EGearTierId.Legendary);

	const hasExoticArmor = nonClassItemArmor.some(
		(x) => x.gearTierId === EGearTierId.Exotic
	);
	return (
		hasExoticArmor &&
		!hasOnlyLegendaryArmor &&
		(loadout.armor.length > 0 ||
			Object.values(loadout.armorSlotMods).some((x) =>
				x.some((y) => y !== null)
			) ||
			loadout.raidMods.some((x) => x !== null) ||
			loadout.destinySubclassId !== null)
	);
};

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
): AnalyzableLoadoutBreakdown => {
	const loadouts: AnalyzableLoadout[] = [];
	if (!dimLoadouts || !dimLoadouts.length) {
		return {
			validLoadouts: {},
			invalidLoadouts: {},
		};
	}
	const armorItems = flattenArmor(armor, allClassItemMetadata);
	dimLoadouts.forEach((dimLoadout) => {
		const debugging = false; // dimLoadout.name.includes('IDFK');
		if (debugging) {
			console.log('>>>> dimLoadout', JSON.stringify(dimLoadout, null, 2));
		}
		const loadout: AnalyzableLoadout = {
			...getDefaultAnalyzableLoadout(),
			id: dimLoadout.id,
			name: dimLoadout.name,
			loadoutType: ELoadoutType.DIM,
			destinyClassId: DestinyClassHashToDestinyClass[dimLoadout.classType],
		};
		const desiredStatTiers: ArmorStatMapping = getDefaultArmorStatMapping();
		const achievedStatTiers: ArmorStatMapping = getDefaultArmorStatMapping();

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
				achievedStatTiers[armorStatId] += minTier;
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
						achievedStatTiers[armorStatId] +=
							armorItem.stats[ArmorStatIndices[armorStatId]] +
							extraMasterworkedStats;
					});
				}
			}
			// This is the subclass definition. Contains all the aspects and fragments
			// TODO: Is this safe? Will this always be a subclass?
			// can other things have socketOverrides?
			if (equippedItem.socketOverrides) {
				let subclassHash = equippedItem.hash;
				const classAbilityHash = equippedItem.socketOverrides[0] || null;
				const jumpHash = equippedItem.socketOverrides[1] || null;
				if (debugging) {
					console.log('>>>> jumpHash', jumpHash);
				}
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

				// Ensure that loadouts that were created with old 2.0 subclasses
				// are still processed correctly with 3.0 versions
				const newSubclassHash = oldToNewSubclassHashes[subclassHash];
				if (newSubclassHash) {
					subclassHash = newSubclassHash;
				}

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
			const mod = getModByHash(hash);
			if (!mod) {
				console.warn({
					message: 'Could not find mod',
					loadoutId: loadout.id,
					modHash: hash,
				});
				return;
			}
			if (mod.modSocketCategoryId === EModSocketCategoryId.ArmorSlot) {
				// Repace first null value with this mod id
				const idx = loadout.armorSlotMods[mod.armorSlotId].findIndex(
					(x) => x === null
				);
				if (idx === -1) {
					console.warn({
						message: 'Could not find null value in armorSlotMods',
						loadoutId: loadout.id,
						modId: mod.id,
						armorSlotId: mod.armorSlotId,
					});
					return;
				}
				loadout.armorSlotMods[mod.armorSlotId][idx] = mod.id;
			} else if (mod.modSocketCategoryId === EModSocketCategoryId.Stat) {
				loadout.armorStatMods.push(mod.id);
			} else if (mod.modSocketCategoryId === EModSocketCategoryId.Raid) {
				const idx = loadout.raidMods.findIndex((x) => x === null);
				if (idx === -1) {
					console.warn({
						message: 'Could not find null value in raidMods',
						loadoutId: loadout.id,
						modId: mod.id,
					});
					return;
				}
				loadout.raidMods[idx] = mod.id;
			}
			// TODO: Currently no armor slot mods give bonuses so this is safe.
			// But there have been mods in the past that did give bonuses.
			// We should handle those in the future...
			// Specifically, handle the case where we are not considering mods
			// when processing armor so that mod cost doesn't limit the stat mod availability
			mod.bonuses.forEach((bonus) => {
				desiredStatTiers[bonus.stat] += bonus.value;
				achievedStatTiers[bonus.stat] += bonus.value;
			});
		});
		const fragmentArmorStatMapping = getArmorStatMappingFromFragments(
			loadout.fragmentIdList,
			loadout.destinyClassId
		);
		ArmorStatIdList.forEach((armorStatId) => {
			desiredStatTiers[armorStatId] += fragmentArmorStatMapping[armorStatId];
			achievedStatTiers[armorStatId] += fragmentArmorStatMapping[armorStatId];
		});
		ArmorStatIdList.forEach((armorStatId) => {
			desiredStatTiers[armorStatId] = roundDown10(
				desiredStatTiers[armorStatId]
			);
			// Clamp desired stat tiers to 100
			desiredStatTiers[armorStatId] = Math.min(
				desiredStatTiers[armorStatId],
				100
			);
			// achievedStatTiers are not clamped
			achievedStatTiers[armorStatId] = roundDown10(
				achievedStatTiers[armorStatId]
			);
		});
		loadout.desiredStatTiers = desiredStatTiers;
		loadout.achievedStatTiers = achievedStatTiers;
		loadouts.push(loadout);
	});
	const validLoadouts: Record<string, AnalyzableLoadout> = {};
	const invalidLoadouts: Record<string, AnalyzableLoadout> = {};

	loadouts.forEach((x) => {
		if (isEditableLoadout(x)) {
			validLoadouts[x.id] = x;
		} else {
			invalidLoadouts[x.id] = x;
		}
	});
	return {
		validLoadouts,
		invalidLoadouts,
	};
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

export enum ELoadoutOptimizationType {
	HigherStatTier = 'HigherStatTier',
	LowerCost = 'LowerCost',
	MissingArmor = 'MissingArmor',
	NoExoticArmor = 'NoExoticArmor',
	UnavailableMods = 'UnavailableMods',
	StatsOver100 = 'StatsOver100',
	UnusedFragmentSlots = 'UnusedFragmentSlots',
	LowerTargetDIMStatTiers = 'LowerTargetDIMStatTiers',
}

export interface ILoadoutOptimization {
	id: ELoadoutOptimizationType;
	name: string;
	iconColor: string;
}

const LoadoutOptimizationTypeToLoadoutOptimizationMapping: EnumDictionary<
	ELoadoutOptimizationType,
	ILoadoutOptimization
> = {
	[ELoadoutOptimizationType.HigherStatTier]: {
		id: ELoadoutOptimizationType.HigherStatTier,
		name: 'Higher Stat Tier',
		iconColor: 'lightgreen',
	},
	[ELoadoutOptimizationType.LowerCost]: {
		id: ELoadoutOptimizationType.LowerCost,
		name: 'Lower Cost',
		iconColor: 'lightgreen',
	},
	[ELoadoutOptimizationType.MissingArmor]: {
		id: ELoadoutOptimizationType.MissingArmor,
		name: 'Missing Armor',
		iconColor: 'yellow',
	},
	[ELoadoutOptimizationType.NoExoticArmor]: {
		id: ELoadoutOptimizationType.NoExoticArmor,
		name: 'No Exotic Armor',
		iconColor: 'yellow',
	},
	[ELoadoutOptimizationType.UnavailableMods]: {
		id: ELoadoutOptimizationType.UnavailableMods,
		name: 'Unavailable Mods',
		iconColor: 'yellow',
	},
	[ELoadoutOptimizationType.StatsOver100]: {
		id: ELoadoutOptimizationType.StatsOver100,
		name: 'Stats Over 100',
		iconColor: 'yellow',
	},
	[ELoadoutOptimizationType.UnusedFragmentSlots]: {
		id: ELoadoutOptimizationType.UnusedFragmentSlots,
		name: 'Missing Fragments',
		iconColor: 'yellow',
	},
	[ELoadoutOptimizationType.LowerTargetDIMStatTiers]: {
		id: ELoadoutOptimizationType.LowerTargetDIMStatTiers,
		name: 'Lower Target DIM Stat Tiers',
		iconColor: 'yellow',
	},
};

export const getLoadoutOptimization = (
	id: ELoadoutOptimizationType
): ILoadoutOptimization => {
	return LoadoutOptimizationTypeToLoadoutOptimizationMapping[id];
};

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
			const validRaidModArmorSlotPlacements =
				getValidRaidModArmorSlotPlacements(
					loadout.armorSlotMods,
					loadout.raidMods
				);

			let mods = [...loadout.raidMods];
			ArmorSlotWithClassItemIdList.forEach((armorSlotId) => {
				mods = [...mods, ...loadout.armorSlotMods[armorSlotId]];
			});
			const modsArmorStatMapping = getArmorStatMappingFromMods(
				mods,
				loadout.destinyClassId
			);

			// TODO: Flesh out the non-default stuff like
			// raid mods, placements, armor slot mods,
			const doProcessArmorParams: DoProcessArmorParams = {
				masterworkAssumption,
				desiredArmorStats: loadout.desiredStatTiers,
				armorItems: preProcessedArmor,
				fragmentArmorStatMapping,
				modArmorStatMapping: modsArmorStatMapping,
				potentialRaidModArmorSlotPlacements: validRaidModArmorSlotPlacements,
				armorSlotMods: loadout.armorSlotMods,
				raidMods: loadout.raidMods.filter((x) => x !== null),
				intrinsicArmorPerkOrAttributeIds: [],
				destinyClassId: loadout.destinyClassId,
				reservedArmorSlotEnergy: getDefaultArmorSlotEnergyMapping(),
				useZeroWastedStats: false,
				allClassItemMetadata: _allClassItemMetadata,
			};
			const sumOfCurrentStatModsCost = sumModCosts(loadout.armorStatMods);
			const processedArmor = doProcessArmor(doProcessArmorParams);
			let maxDiff = -1;
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
			// If the tiers are the same then we might still be able to optimize
			// by achieving the same tiers, but for a lower cost.
			const hasLowerCost =
				maxDiff >= 0 &&
				processedArmor.items.some(
					(x) => x.metadata.totalModCost < sumOfCurrentStatModsCost
				);

			let hasUnavailableMods = false;
			Object.values(loadout.armorSlotMods).forEach((modIdList) => {
				modIdList
					.filter((x) => x !== null)
					.forEach((modId) => {
						const mod = getMod(modId);
						if (
							!mod ||
							mod.modCategoryId === EModCategoryId.AlternateSeasonalArtifact
						) {
							hasUnavailableMods = true;
						}
					});
			});
			const missingArmor = loadout.armor.length < 5;
			const noExoticArmor =
				loadout.armor.findIndex((x) => x.gearTierId === EGearTierId.Exotic) ===
				-1;
			if (loadout.name.includes('Missing Exotic')) {
				console.log('>>>>>>> missingExotic', {
					loadout,
					noExoticArmor,
				});
			}

			const hasStatOver100 = Object.values(loadout.achievedStatTiers).some(
				(x) => x > 100
			);
			let canBeOptimized = false;
			const optimizationTypes: ELoadoutOptimizationType[] = [];
			if (hasHigherStatTiers) {
				canBeOptimized = true;
				optimizationTypes.push(ELoadoutOptimizationType.HigherStatTier);
			}
			if (hasLowerCost) {
				canBeOptimized = true;
				optimizationTypes.push(ELoadoutOptimizationType.LowerCost);
			}
			if (missingArmor) {
				canBeOptimized = true;
				optimizationTypes.push(ELoadoutOptimizationType.MissingArmor);
			}
			if (noExoticArmor) {
				canBeOptimized = true;
				optimizationTypes.push(ELoadoutOptimizationType.NoExoticArmor);
			}
			if (hasUnavailableMods) {
				canBeOptimized = true;
				optimizationTypes.push(ELoadoutOptimizationType.UnavailableMods);
			}
			if (hasStatOver100) {
				canBeOptimized = true;
				optimizationTypes.push(ELoadoutOptimizationType.StatsOver100);
			}

			if (canBeOptimized) {
				result.push({
					tierDiff: maxDiff,
					optimizationTypes,
					loadoutId: loadout.id,
				});
				progressCallback({
					type: EGetLoadoutsThatCanBeOptimizedProgresstype.Progress,
					canBeOptimized: true,
				});
				return;
			} else {
				progressCallback({
					type: EGetLoadoutsThatCanBeOptimizedProgresstype.Progress,
					canBeOptimized: false,
				});
				return;
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

/* Just some notes here: 
- DIM Loadouts have a set class item. If we can still use that to achieve the same or higher stat tiers then we should.
  If that's not possible then c'est la vie. This can happen if the user gets an artifice class item or something.

*/
