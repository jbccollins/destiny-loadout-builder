import { Loadout } from '@destinyitemmanager/dim-api-types';
import { UNSET_PLUG_HASH } from '@dlb/dim/utils/constants';
import { EAspectId } from '@dlb/generated/aspect/EAspectId';
import { EClassAbilityId } from '@dlb/generated/classAbility/EClassAbilityId';
import { EFragmentId } from '@dlb/generated/fragment/EFragmentId';
import { EGrenadeId } from '@dlb/generated/grenade/EGrenadeId';
import { EJumpId } from '@dlb/generated/jump/EJumpId';
import { EMeleeId } from '@dlb/generated/melee/EMeleeId';
import { ESuperAbilityId } from '@dlb/generated/superAbility/ESuperAbilityId';
import {
	InGameLoadoutsDefinitions,
	InGameLoadoutsMapping,
} from '@dlb/redux/features/inGameLoadouts/inGameLoadoutsSlice';
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
	AvailableExoticArmor,
	AvailableExoticArmorItem,
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
import { getAspect, getAspectByHash } from '@dlb/types/Aspect';
import { Character, Characters } from '@dlb/types/Character';
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
import { EnumDictionary, ValidateEnumList } from '@dlb/types/globals';
import { getGrenadeByHash } from '@dlb/types/Grenade';
import {
	EArmorSlotId,
	EDestinyClassId,
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
	ArmorSlotIdToModIdListMapping,
	getDefaultArmorSlotIdToModIdListMapping,
	getMod,
	getModByHash,
	getValidRaidModArmorSlotPlacements,
} from '@dlb/types/Mod';
import { getSuperAbilityByHash } from '@dlb/types/SuperAbility';
import { reducedToNormalMod } from '@dlb/utils/reduced-cost-mod-mapping';

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

	// const hasExoticArmor = nonClassItemArmor.some(
	// 	(x) => x.gearTierId === EGearTierId.Exotic
	// );
	return (
		// hasExoticArmor &&
		!hasOnlyLegendaryArmor &&
		loadout.destinyClassId !== null &&
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

const findAvailableExoticArmorItem = (
	hash: number,
	destinyClassId: EDestinyClassId,
	availableExoticArmor: AvailableExoticArmor
): AvailableExoticArmorItem => {
	for (const armorSlotId of ArmorSlotIdList) {
		const potentialExoticArmor = availableExoticArmor[destinyClassId][
			armorSlotId
		].find((x: AvailableExoticArmorItem) => x.hash === hash);
		if (potentialExoticArmor) {
			return potentialExoticArmor;
		}
	}
	return null;
};

type ExtractDimLoadoutsParams = {
	armorItems: ArmorItem[];
	dimLoadouts: Loadout[];
	masterworkAssumption: EMasterworkAssumption;
	availableExoticArmor: AvailableExoticArmor;
};
const extractDimLoadouts = (
	params: ExtractDimLoadoutsParams
): AnalyzableLoadout[] => {
	const {
		dimLoadouts,
		armorItems,
		masterworkAssumption,
		availableExoticArmor,
	} = params;
	const loadouts: AnalyzableLoadout[] = [];
	if (!dimLoadouts || !dimLoadouts.length) {
		return [];
	}
	dimLoadouts.forEach((dimLoadout) => {
		const destinyClassId =
			DestinyClassHashToDestinyClass[dimLoadout.classType] || null; // Loadouts with just weapons don't need to have a class type

		const loadout: AnalyzableLoadout = {
			...getDefaultAnalyzableLoadout(),
			id: dimLoadout.id,
			name: dimLoadout.name,
			loadoutType: ELoadoutType.DIM,
			destinyClassId,
		};
		const desiredStatTiers: ArmorStatMapping = getDefaultArmorStatMapping();
		const achievedStatTiers: ArmorStatMapping = getDefaultArmorStatMapping();
		const dimStatTierConstraints: ArmorStatMapping =
			getDefaultArmorStatMapping();

		// TODO: Stat constraints are DIM Loadout specific and may not respect
		// fragment bonus changes. Stat constraints are saved when creating or editing
		// a DIM loadout.
		// If a loadout was created, then later bungie adds a penalty to a fragment
		// that loadout may no longer be able to reach the stat constraints
		// If the user is unable to reach the stat constraints, then we should
		// mark the loadout as one that the user might want to check on
		const hasStatConstraints = !!dimLoadout.parameters?.statConstraints;
		if (hasStatConstraints) {
			const statConstraints = dimLoadout.parameters.statConstraints;
			statConstraints.forEach((statConstraint) => {
				const tier = (statConstraint.minTier || 0) * 10;
				const armorStatId = getArmorStatIdFromBungieHash(
					statConstraint.statHash
				);
				dimStatTierConstraints[armorStatId] = tier;
			});
			loadout.dimStatTierConstraints = dimStatTierConstraints;
		}
		dimLoadout.equipped.forEach((equippedItem) => {
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
			} else if (destinyClassId !== null) {
				// If the user deleted the exotic armor piece that they
				// had in their loadout, then we try to find a replacement
				const potentialExoticArmorHash = equippedItem.hash;
				const exoticArmorItem = findAvailableExoticArmorItem(
					potentialExoticArmorHash,
					destinyClassId,
					availableExoticArmor
				);
				if (exoticArmorItem) {
					loadout.exoticHash = exoticArmorItem.hash;
				}
			}

			// This is the subclass definition. Contains all the aspects and fragments
			// TODO: Is this safe? Will this always be a subclass?
			// can other things have socketOverrides?
			if (equippedItem.socketOverrides) {
				let subclassHash = equippedItem.hash;
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
				// This means a deprecated mod like "Powerful Friends". Mark this as an optimization
				if (
					!loadout.optimizationTypeList.includes(
						ELoadoutOptimizationType.DeprecatedMods
					)
				) {
					loadout.optimizationTypeList.push(
						ELoadoutOptimizationType.DeprecatedMods
					);
				}
				// console.warn({
				// 	message: 'Could not find mod',
				// 	loadoutId: loadout.id,
				// 	modHash: hash,
				// });
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
	return loadouts;
};

// In-Game Loadout Item Indices
// THIS HASH IS NOTHING: 2166136261
/*
0: Kinetic
1: Energy
2: Heavy
3: Helmet
4: Arm
5: Chest
6: Leg
7: Class Item
8: Subclass
  0: Class Ability
	1: Jump
	2: Super
	3: Melee
	4: Grenade
	5: Aspect
	6: Aspect
	7: Fragment
	8: Fragment
	9: Fragment
	10: Fragment
	11: Fragment
*/
enum EInGameLoadoutItemType {
	WEAPON = 'WEAPON',
	ARMOR = 'ARMOR',
	SUBCLASS = 'SUBCLASS',
}
const getInGameLoadoutItemTypeFromIndex = (
	index: number
): EInGameLoadoutItemType => {
	switch (index) {
		case 0:
		case 1:
		case 2:
			return EInGameLoadoutItemType.WEAPON;
		case 3:
		case 4:
		case 5:
		case 6:
		case 7:
			return EInGameLoadoutItemType.ARMOR;
		case 8:
			return EInGameLoadoutItemType.SUBCLASS;
		default:
			return null;
	}
};

type ExtractInGameLoadoutsParams = {
	armorItems: ArmorItem[];
	inGameLoadouts: InGameLoadoutsMapping;
	masterworkAssumption: EMasterworkAssumption;
	characters: Characters;
	inGameLoadoutsDefinitions: InGameLoadoutsDefinitions;
};
const extractInGameLoadouts = (
	params: ExtractInGameLoadoutsParams
): AnalyzableLoadout[] => {
	const {
		inGameLoadouts,
		inGameLoadoutsDefinitions,
		armorItems,
		masterworkAssumption,
		characters,
	} = params;
	const loadouts: AnalyzableLoadout[] = [];
	if (!inGameLoadouts || Object.keys(inGameLoadouts).length === 0) {
		return [];
	}
	Object.keys(inGameLoadouts).forEach((characterId) => {
		const characterLoadouts = inGameLoadouts[characterId];
		const character = characters.find((x) => x.id === characterId) as Character;
		if (!character) {
			return;
		}
		const destinyClassId = character.destinyClassId;
		characterLoadouts.loadouts.forEach((inGameLoadout, index) => {
			const loadout: AnalyzableLoadout = {
				...getDefaultAnalyzableLoadout(),
				id: `${characterId}-${index}`,
				name: inGameLoadoutsDefinitions.LoadoutName[inGameLoadout.nameHash]
					.name,
				icon: inGameLoadoutsDefinitions.LoadoutIcon[inGameLoadout.iconHash]
					.iconImagePath,
				iconColorImage:
					inGameLoadoutsDefinitions.LoadoutColor[inGameLoadout.colorHash]
						.colorImagePath,
				loadoutType: ELoadoutType.InGame,
				destinyClassId,
				characterId,
				index: index + 1,
			};

			const desiredStatTiers: ArmorStatMapping = getDefaultArmorStatMapping();
			const achievedStatTiers: ArmorStatMapping = getDefaultArmorStatMapping();

			inGameLoadout.items.forEach((item, index) => {
				switch (getInGameLoadoutItemTypeFromIndex(index)) {
					case EInGameLoadoutItemType.ARMOR:
						const armorItem = armorItems.find(
							(armorItem) => armorItem.id === item.itemInstanceId
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

							// This contains a bunch of stuff like the shader, mods, etc.
							// TODO: This won't check for deprecated mods
							item.plugItemHashes.forEach((hash) => {
								const mod = getModByHash(hash);
								if (!mod) {
									return;
								}
								if (
									mod.modSocketCategoryId === EModSocketCategoryId.ArmorSlot
								) {
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
								} else if (
									mod.modSocketCategoryId === EModSocketCategoryId.Stat
								) {
									loadout.armorStatMods.push(mod.id);
								} else if (
									mod.modSocketCategoryId === EModSocketCategoryId.Raid
								) {
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
								mod.bonuses.forEach((bonus) => {
									desiredStatTiers[bonus.stat] += bonus.value;
									achievedStatTiers[bonus.stat] += bonus.value;
								});
							});
						}
						break;
					case EInGameLoadoutItemType.SUBCLASS:
						item.plugItemHashes.forEach((hash, index) => {
							if (hash === UNSET_PLUG_HASH) {
								return;
							}
							switch (index) {
								case 0:
									loadout.classAbilityId = getClassAbilityByHash(hash)
										.id as EClassAbilityId;
									break;
								case 1:
									loadout.jumpId = getJumpByHash(hash).id as EJumpId;
									break;
								case 2:
									const superAbility = getSuperAbilityByHash(hash);
									loadout.superAbilityId = superAbility.id as ESuperAbilityId;
									// This is a janky way to get the subclass id from the super ability id
									loadout.destinySubclassId = superAbility.destinySubclassId;
									break;
								case 3:
									loadout.meleeId = getMeleeByHash(hash).id as EMeleeId;
									break;
								case 4:
									loadout.grenadeId = getGrenadeByHash(hash).id as EGrenadeId;
									break;
								case 5:
								case 6:
									loadout.aspectIdList.push(
										getAspectByHash(hash).id as EAspectId
									);
									break;

								case 7:
								case 8:
								case 9:
								case 10:
								case 11:
								case 13:
								case 14:
								case 15:
								case 16:
								case 17:
								case 18:
									loadout.fragmentIdList.push(
										getFragmentByHash(hash).id as EFragmentId
									);
									break;
								default:
									break;
							}
						});
						break;
					default:
						break;
				}
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
	});
	return loadouts;
};

type BuildAnalyzableLoadoutsBreakdownParams = {
	characters: Characters;
	inGameLoadouts: InGameLoadoutsMapping;
	inGameLoadoutsDefinitions: InGameLoadoutsDefinitions;
	dimLoadouts: Loadout[];
	armor: Armor;
	allClassItemMetadata: DestinyClassToAllClassItemMetadataMapping;
	masterworkAssumption: EMasterworkAssumption;
	availableExoticArmor: AvailableExoticArmor;
};
export const buildAnalyzableLoadoutsBreakdown = (
	params: BuildAnalyzableLoadoutsBreakdownParams
): AnalyzableLoadoutBreakdown => {
	const {
		dimLoadouts,
		inGameLoadouts,
		armor,
		allClassItemMetadata,
		masterworkAssumption,
		availableExoticArmor,
		characters,
		inGameLoadoutsDefinitions,
	} = params;
	if (!dimLoadouts || !dimLoadouts.length) {
		return {
			validLoadouts: {},
			invalidLoadouts: {},
		};
	}
	const armorItems = flattenArmor(armor, allClassItemMetadata);
	const analyzableDimLoadouts = extractDimLoadouts({
		armorItems,
		dimLoadouts,
		masterworkAssumption,
		availableExoticArmor,
	});
	const analyzableInGameLoadouts = extractInGameLoadouts({
		armorItems,
		inGameLoadouts,
		masterworkAssumption,
		characters,
		inGameLoadoutsDefinitions,
	});
	const validLoadouts: Record<string, AnalyzableLoadout> = {};
	const invalidLoadouts: Record<string, AnalyzableLoadout> = {};

	[...analyzableInGameLoadouts, ...analyzableDimLoadouts].forEach((x) => {
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
	availableExoticArmor: AvailableExoticArmor;
};
type GeneratePreProcessedArmorOutput = {
	preProcessedArmor: StrictArmorItems;
	allClassItemMetadata: AllClassItemMetadata;
};
const generatePreProcessedArmor = (
	params: GeneratePreProcessedArmorParams
): GeneratePreProcessedArmorOutput => {
	const { armor, loadout, allClassItemMetadata, availableExoticArmor } = params;
	const selectedExoticArmor = findAvailableExoticArmorItem(
		loadout.exoticHash,
		loadout.destinyClassId,
		availableExoticArmor
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
		allClassItemMetadata[destinyClassId],
		false
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
	DeprecatedMods = 'DeprecatedMods',
	StatsOver100 = 'StatsOver100',
	UnusedFragmentSlots = 'UnusedFragmentSlots',
	UnmetDIMStatConstraints = 'UnmetDIMStatConstraints',
	UnusableMods = 'UnusableMods',
	None = 'None',
}

export interface ILoadoutOptimization {
	id: ELoadoutOptimizationType;
	name: string;
	iconColor: string;
	description: string;
}

// There maybe multiple optimizations types that, while techincally correct, are confusing
// to a user. For example, if you are missing an armor piece, then the lower cost and higher stat tier checks aren't
// really relevant since a massive chunk of stats are missing. So we filter out some of the optimization types
export const humanizeOptimizationTypes = (
	optimizationTypeList: ELoadoutOptimizationType[]
): ELoadoutOptimizationType[] => {
	let filteredOptimizationTypeList: ELoadoutOptimizationType[] = [
		...optimizationTypeList,
	];
	// Missing armor takes precedence over higher stat tier, lower cost and unmet stat constraints
	if (
		filteredOptimizationTypeList.includes(ELoadoutOptimizationType.MissingArmor)
	) {
		filteredOptimizationTypeList = filteredOptimizationTypeList.filter(
			(x) =>
				![
					ELoadoutOptimizationType.HigherStatTier,
					ELoadoutOptimizationType.LowerCost,
					ELoadoutOptimizationType.UnmetDIMStatConstraints,
				].includes(x)
		);
	}
	// Uncorrectable takes precedence over unavailable
	if (
		filteredOptimizationTypeList.includes(ELoadoutOptimizationType.UnusableMods)
	) {
		filteredOptimizationTypeList = filteredOptimizationTypeList.filter(
			(x) => !(x === ELoadoutOptimizationType.UnavailableMods)
		);
	}
	// Dedupe the list
	filteredOptimizationTypeList = Array.from(
		new Set(filteredOptimizationTypeList)
	);
	return filteredOptimizationTypeList;
};

const LoadoutOptimizationTypeToLoadoutOptimizationMapping: EnumDictionary<
	ELoadoutOptimizationType,
	ILoadoutOptimization
> = {
	[ELoadoutOptimizationType.HigherStatTier]: {
		id: ELoadoutOptimizationType.HigherStatTier,
		name: 'Higher Stat Tier',
		iconColor: 'lightgreen',
		description:
			'Recreating this loadout with a different combination of armor and/or stat boosting mods can reach higher stat tiers.',
	},
	[ELoadoutOptimizationType.LowerCost]: {
		id: ELoadoutOptimizationType.LowerCost,
		name: 'Lower Cost',
		iconColor: 'lightgreen',
		description:
			'Recreating this loadout with a different combination of armor and/or stat boosting mods can reach the same stat tiers for a lower total stat mod cost.',
	},
	[ELoadoutOptimizationType.MissingArmor]: {
		id: ELoadoutOptimizationType.MissingArmor,
		name: 'Missing Armor',
		iconColor: 'darkorange',
		description:
			'This loadout is missing one or more armor pieces. You may have deleted armor pieces that were in this loadout.',
	},
	[ELoadoutOptimizationType.NoExoticArmor]: {
		id: ELoadoutOptimizationType.NoExoticArmor,
		name: 'No Exotic Armor',
		iconColor: 'yellow',
		description:
			'This loadout does not have an exotic armor piece. You may have deleted the exotic armor piece that was in this loadout.',
	},
	[ELoadoutOptimizationType.UnavailableMods]: {
		id: ELoadoutOptimizationType.UnavailableMods,
		name: 'Unavailable Mods',
		iconColor: 'yellow',
		description:
			'[DIM Loadout Specific] This loadout uses mods that are no longer available. This usually happens when you were using a discounted mod that was available in a previous season via artifact unlocks. DIM is able to correct this by swapping discounted mods with their full-cost versions but you may want to consider changing these anyway.',
	},
	[ELoadoutOptimizationType.DeprecatedMods]: {
		id: ELoadoutOptimizationType.DeprecatedMods,
		name: 'Deprecated Mods',
		iconColor: 'yellow',
		description:
			'This loadout uses mods that are no longer in the game. This usually means you had an old "Charged With Light", "Warmind Cell", or "Elemental Well" mod equipped.',
	},
	[ELoadoutOptimizationType.StatsOver100]: {
		id: ELoadoutOptimizationType.StatsOver100,
		name: 'Stats Over 100',
		iconColor: 'yellow',
		description:
			"This loadout has one or more stats of 110 or higher. It is likely that you can find a way to shuffle mods around to avoid wasting an entire stat tier's worth of stat points.",
	},
	[ELoadoutOptimizationType.UnusedFragmentSlots]: {
		id: ELoadoutOptimizationType.UnusedFragmentSlots,
		name: 'Missing Fragments',
		iconColor: 'yellow',
		description:
			"This loadout has one or more unused fragment slots. Occasionally Bungie adds more fragment slots to an aspect. You may want to add another fragment, it's free real estate!",
	},
	[ELoadoutOptimizationType.UnmetDIMStatConstraints]: {
		id: ELoadoutOptimizationType.UnmetDIMStatConstraints,
		name: 'Unmet DIM Stat Constraints',
		iconColor: 'yellow',
		description:
			'[DIM Loadout Specific] This loadout was created using DIM\'s "Loadout Optimizer" tool, or another similar tool. At the time that this loadout was created, you were able to hit higher stat tiers that you can currently hit. This can happen when Bungie adds stat penalties to an existing fragment that is part of your loadout.',
	},
	[ELoadoutOptimizationType.UnusableMods]: {
		id: ELoadoutOptimizationType.UnusableMods,
		name: 'Unusable Mods',
		iconColor: 'darkorange',
		description:
			'This loadout uses mods that are no longer available. This usually happens when you were using a discounted mod that was available in a previous season via artifact unlocks. In the case of DIM loadouts, DIM will attempt to correct this by swapping discounted mods with their full-cost versions. In this case, given the cost of the full-cost mods, it is not possible for DIM to correct this loadout.',
	},
	[ELoadoutOptimizationType.None]: {
		id: ELoadoutOptimizationType.None,
		name: 'No Optimizations Found',
		iconColor: 'white',
		description:
			'No optimizations found. This loadout is as good as it gets :)',
	},
};

export const OrderedLoadoutOptimizationTypeList: ELoadoutOptimizationType[] =
	ValidateEnumList(Object.values(ELoadoutOptimizationType), [
		ELoadoutOptimizationType.HigherStatTier,
		ELoadoutOptimizationType.LowerCost,
		ELoadoutOptimizationType.MissingArmor,
		ELoadoutOptimizationType.UnusableMods,
		ELoadoutOptimizationType.NoExoticArmor,
		ELoadoutOptimizationType.DeprecatedMods,
		ELoadoutOptimizationType.StatsOver100,
		ELoadoutOptimizationType.UnusedFragmentSlots,
		ELoadoutOptimizationType.UnavailableMods,
		ELoadoutOptimizationType.UnmetDIMStatConstraints,
		ELoadoutOptimizationType.None,
	]);

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
	loadoutId: string;
	optimizationTypeList: ELoadoutOptimizationType[];
};

export type GetLoadoutsThatCanBeOptimizedParams = {
	loadouts: Record<string, AnalyzableLoadout>;
	armor: Armor;
	masterworkAssumption: EMasterworkAssumption;
	allClassItemMetadata: DestinyClassToAllClassItemMetadataMapping;
	progressCallback: (
		progress: GetLoadoutsThatCanBeOptimizedProgress
	) => unknown;
	availableExoticArmor: AvailableExoticArmor;
};
export type GetLoadoutsThatCanBeOptimizedOutputItem = {
	optimizationTypeList: ELoadoutOptimizationType[];
	loadoutId: string;
};

const getFragmentSlots = (aspectIdList: EAspectId[]): number => {
	let fragmentSlots = 0;
	aspectIdList.forEach((aspectId) => {
		if (!aspectId) {
			return;
		}
		const aspect = getAspect(aspectId);
		if (!aspect) {
			return;
		}
		fragmentSlots += aspect.fragmentSlots;
	});
	return fragmentSlots;
};

export const hasAlternateSeasonArtifactMods = (
	armorSlotMods: ArmorSlotIdToModIdListMapping
): boolean => {
	return Object.values(armorSlotMods).some((modIdList) => {
		return modIdList.some((modId) => {
			const mod = getMod(modId);
			if (!mod) {
				return false;
			}
			return mod.modCategoryId === EModCategoryId.AlternateSeasonalArtifact;
		});
	});
};

const replaceAlternateSeasonArtifactMods = (
	armorSlotMods: ArmorSlotIdToModIdListMapping
): ArmorSlotIdToModIdListMapping => {
	const newArmorSlotMods = getDefaultArmorSlotIdToModIdListMapping();
	Object.entries(armorSlotMods).forEach(([armorSlotId, modIdList]) => {
		modIdList.forEach((modId) => {
			const mod = getMod(modId);
			if (!mod) {
				return;
			}
			// Repace first null value with this mod id
			const idx = newArmorSlotMods[mod.armorSlotId].findIndex(
				(x) => x === null
			);
			if (idx === -1) {
				console.warn({
					message: 'Could not find null value in armorSlotMods',
					modId: mod.id,
					armorSlotId: mod.armorSlotId,
				});
				return;
			}
			if (mod.modCategoryId === EModCategoryId.AlternateSeasonalArtifact) {
				const newModHash = reducedToNormalMod[mod.hash];
				if (!newModHash) {
					// This means we need to update the generated files and the reducedToNormalMod mapping
					return;
				}
				const newMod = getModByHash(newModHash);
				if (newMod) {
					newArmorSlotMods[armorSlotId][idx] = newMod.id;
				}
			} else {
				newArmorSlotMods[armorSlotId][idx] = modId;
			}
		});
	});
	return newArmorSlotMods;
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
		availableExoticArmor,
	} = params;
	Object.values(loadouts).forEach((loadout) => {
		try {
			const optimizationTypeList: ELoadoutOptimizationType[] = [
				...loadout.optimizationTypeList,
			];
			let hasCorrectableMods = false;
			// DIM Loadouts will try to auto-correct any discounted mods from previous seasons
			// by replacing them with the full cost variants. Sometimes there is not enough
			// armor energy capacity to slot the full cost variants. We will check for both
			// the discounted and full cost variants to see if DIM can handle this or not.
			const armorSlotModsVariants = [loadout.armorSlotMods];
			if (
				loadout.loadoutType === ELoadoutType.DIM &&
				hasAlternateSeasonArtifactMods(loadout.armorSlotMods)
			) {
				armorSlotModsVariants.push(
					replaceAlternateSeasonArtifactMods(loadout.armorSlotMods)
				);
			}
			let earlyProgressCallback = false;
			armorSlotModsVariants.forEach(
				(armorSlotMods, armorSlotModsVariantsIndex) => {
					// Don't even try to process without an exotic
					if (!loadout.exoticHash) {
						optimizationTypeList.push(ELoadoutOptimizationType.NoExoticArmor);
						result.push({
							optimizationTypeList: optimizationTypeList,
							loadoutId: loadout.id,
						});
						earlyProgressCallback = true;
						progressCallback({
							type: EGetLoadoutsThatCanBeOptimizedProgresstype.Progress,
							canBeOptimized: true,
							loadoutId: loadout.id,
							optimizationTypeList: optimizationTypeList,
						});
						return;
					}

					const {
						preProcessedArmor,
						allClassItemMetadata: _allClassItemMetadata,
					} = generatePreProcessedArmor({
						armor,
						loadout,
						allClassItemMetadata,
						availableExoticArmor,
					});

					const fragmentArmorStatMapping = getArmorStatMappingFromFragments(
						loadout.fragmentIdList,
						loadout.destinyClassId
					);
					const validRaidModArmorSlotPlacements =
						getValidRaidModArmorSlotPlacements(armorSlotMods, loadout.raidMods);

					let mods = [...loadout.raidMods];
					ArmorSlotWithClassItemIdList.forEach((armorSlotId) => {
						mods = [...mods, ...armorSlotMods[armorSlotId]];
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
						potentialRaidModArmorSlotPlacements:
							validRaidModArmorSlotPlacements,
						armorSlotMods,
						raidMods: loadout.raidMods.filter((x) => x !== null),
						intrinsicArmorPerkOrAttributeIds: [],
						destinyClassId: loadout.destinyClassId,
						reservedArmorSlotEnergy: getDefaultArmorSlotEnergyMapping(),
						useZeroWastedStats: false,
						alwaysConsiderCollectionsRolls: false,
						allClassItemMetadata: _allClassItemMetadata,
					};
					const sumOfCurrentStatModsCost = sumModCosts(loadout.armorStatMods);
					const processedArmor = doProcessArmor(doProcessArmorParams);
					if (armorSlotModsVariantsIndex === 0) {
						hasCorrectableMods = processedArmor.items.length > 0;
					}
					let maxDiff = -1;
					let hasHigherStatTiers = false;
					ArmorStatIdList.forEach((armorStatId) => {
						const processedArmorVal =
							processedArmor.maxPossibleDesiredStatTiers[armorStatId];
						const existingVal = roundDown10(
							loadout.desiredStatTiers[armorStatId]
						);
						maxDiff = Math.max(
							maxDiff,
							processedArmorVal / 10 - existingVal / 10
						);
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

					const hasUnmetDIMStatTierConstraints =
						loadout.loadoutType === ELoadoutType.DIM &&
						ArmorStatIdList.some(
							(armorStatId) =>
								loadout.achievedStatTiers[armorStatId] <
								loadout.dimStatTierConstraints[armorStatId]
						);

					let hasUnavailableMods = false;
					Object.values(armorSlotMods).forEach((modIdList) => {
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
					const hasStatOver100 = Object.values(loadout.achievedStatTiers).some(
						(x) => x > 100
					);

					// If the first pass returned results
					const hasUnusableMods =
						hasCorrectableMods && // The first pass returned results
						armorSlotModsVariantsIndex === 1 && // We're on the second pass
						processedArmor.items.length === 0; // We have no results on the second pass
					const hasUnusedFragmentSlots =
						getFragmentSlots(loadout.aspectIdList) >
						loadout.fragmentIdList.length;

					if (hasHigherStatTiers) {
						optimizationTypeList.push(ELoadoutOptimizationType.HigherStatTier);
					}
					if (hasLowerCost) {
						optimizationTypeList.push(ELoadoutOptimizationType.LowerCost);
					}
					if (missingArmor) {
						optimizationTypeList.push(ELoadoutOptimizationType.MissingArmor);
					}
					if (hasUnavailableMods) {
						// DIM can correct for unavailable mods, but only if there is enough armor energy
						// InGame Loadouts cannot correct for unavailable mods
						if (loadout.loadoutType === ELoadoutType.InGame) {
							optimizationTypeList.push(ELoadoutOptimizationType.UnusableMods);
						} else {
							optimizationTypeList.push(
								ELoadoutOptimizationType.UnavailableMods
							);
						}
					}
					if (hasStatOver100) {
						optimizationTypeList.push(ELoadoutOptimizationType.StatsOver100);
					}
					if (hasUnusedFragmentSlots) {
						optimizationTypeList.push(
							ELoadoutOptimizationType.UnusedFragmentSlots
						);
					}
					if (hasUnusableMods) {
						optimizationTypeList.push(ELoadoutOptimizationType.UnusableMods);
					}
					if (hasUnmetDIMStatTierConstraints) {
						optimizationTypeList.push(
							ELoadoutOptimizationType.UnmetDIMStatConstraints
						);
					}
				}
			);
			if (earlyProgressCallback) {
				return;
			}

			const humanizedOptimizationTypes =
				humanizeOptimizationTypes(optimizationTypeList);
			if (humanizedOptimizationTypes.length > 0) {
				result.push({
					optimizationTypeList: humanizedOptimizationTypes,
					loadoutId: loadout.id,
				});
				progressCallback({
					type: EGetLoadoutsThatCanBeOptimizedProgresstype.Progress,
					canBeOptimized: true,
					loadoutId: loadout.id,
					optimizationTypeList: humanizedOptimizationTypes,
				});
				return;
			} else {
				progressCallback({
					type: EGetLoadoutsThatCanBeOptimizedProgresstype.Progress,
					canBeOptimized: false,
					loadoutId: loadout.id,
					optimizationTypeList: [],
				});
				return;
			}
		} catch (e) {
			progressCallback({
				type: EGetLoadoutsThatCanBeOptimizedProgresstype.Error,
				loadoutId: loadout.id,
				optimizationTypeList: [],
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
