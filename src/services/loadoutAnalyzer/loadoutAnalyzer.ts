import { Loadout } from '@destinyitemmanager/dim-api-types';
import { BucketHashes } from '@dlb/dim/data/d2/generated-enums';
import { UNSET_PLUG_HASH } from '@dlb/dim/utils/constants';
import { EAspectId } from '@dlb/generated/aspect/EAspectId';
import { EClassAbilityId } from '@dlb/generated/classAbility/EClassAbilityId';
import { EFragmentId } from '@dlb/generated/fragment/EFragmentId';
import { EGrenadeId } from '@dlb/generated/grenade/EGrenadeId';
import { EJumpId } from '@dlb/generated/jump/EJumpId';
import { EMeleeId } from '@dlb/generated/melee/EMeleeId';
import { EModId } from '@dlb/generated/mod/EModId';
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
import {
	getWastedStats,
	roundDown10,
	sumModCosts,
} from '@dlb/services/processArmor/utils';
import {
	AnalyzableLoadout,
	AnalyzableLoadoutBreakdown,
	ELoadoutOptimizationCategoryId,
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
	EArmorStatId,
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
	hasMutuallyExclusiveMods,
} from '@dlb/types/Mod';
import { getSuperAbilityByHash } from '@dlb/types/SuperAbility';
import { getBonusResilienceOrnamentHashByDestinyClassId } from '@dlb/utils/bonus-resilience-ornaments';
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

const flattenMods = (loadout: AnalyzableLoadout): EModId[] => {
	const mods: EModId[] = [];
	Object.values(loadout.armorSlotMods).forEach((modIdList) => {
		modIdList.forEach((modId) => {
			if (modId !== null) {
				mods.push(modId);
			}
		});
	});
	loadout.raidMods.forEach((modId) => {
		if (modId !== null) {
			mods.push(modId);
		}
	});
	loadout.armorStatMods.forEach((modId) => {
		if (modId !== null) {
			mods.push(modId);
		}
	});
	return mods;
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
		const achievedStats: ArmorStatMapping = getDefaultArmorStatMapping();
		const dimStatTierConstraints: ArmorStatMapping =
			getDefaultArmorStatMapping();

		const chestArmorModsByBucket =
			dimLoadout.parameters?.modsByBucket?.[BucketHashes.ChestArmor] || [];
		const bonusResilienceOrnamentHash =
			getBonusResilienceOrnamentHashByDestinyClassId(destinyClassId);
		const hasBonusResilienceOrnament =
			chestArmorModsByBucket.some(
				(hash) => hash === bonusResilienceOrnamentHash
			) || false;

		loadout.hasBonusResilienceOrnament = hasBonusResilienceOrnament;
		if (hasBonusResilienceOrnament) {
			achievedStatTiers[EArmorStatId.Resilience] += 1;
			achievedStats[EArmorStatId.Resilience] += 1;
			desiredStatTiers[EArmorStatId.Resilience] += 1;
		}

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
					achievedStats[armorStatId] +=
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
						ELoadoutOptimizationTypeId.DeprecatedMods
					)
				) {
					loadout.optimizationTypeList.push(
						ELoadoutOptimizationTypeId.DeprecatedMods
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
				achievedStats[bonus.stat] += bonus.value;
			});
		});
		const fragmentArmorStatMapping = getArmorStatMappingFromFragments(
			loadout.fragmentIdList,
			loadout.destinyClassId
		);
		ArmorStatIdList.forEach((armorStatId) => {
			desiredStatTiers[armorStatId] += fragmentArmorStatMapping[armorStatId];
			achievedStatTiers[armorStatId] += fragmentArmorStatMapping[armorStatId];
			achievedStats[armorStatId] += fragmentArmorStatMapping[armorStatId];
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
			// achievedStats are not rounded
		});
		loadout.desiredStatTiers = desiredStatTiers;
		loadout.achievedStatTiers = achievedStatTiers;
		loadout.achievedStats = achievedStats;
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
			// This nameHash check catches empty loadouts. It is not possible
			// to create a loadout without a name in-game.
			if (!inGameLoadout || inGameLoadout.nameHash === UNSET_PLUG_HASH) {
				return;
			}
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

			const bonusResilienceOrnamentHash =
				getBonusResilienceOrnamentHashByDestinyClassId(destinyClassId);

			const desiredStatTiers: ArmorStatMapping = getDefaultArmorStatMapping();
			const achievedStatTiers: ArmorStatMapping = getDefaultArmorStatMapping();
			const achievedStats: ArmorStatMapping = getDefaultArmorStatMapping();

			inGameLoadout.items.forEach((item, index) => {
				switch (getInGameLoadoutItemTypeFromIndex(index)) {
					case EInGameLoadoutItemType.ARMOR:
						const armorItem = armorItems.find(
							(armorItem) => armorItem.id === item.itemInstanceId
						);
						if (armorItem) {
							loadout.armor.push(armorItem);
							if (armorItem.gearTierId === EGearTierId.Exotic) {
								loadout.exoticHash = armorItem.hash;
							} else if (
								armorItem.gearTierId === EGearTierId.Legendary ||
								armorItem.armorSlot === EArmorSlotId.Chest
							) {
								// Check if the bonus resilience ornament is part of this loadout
								const hasBonusResilienceOrnament = item.plugItemHashes.some(
									(hash) => hash === bonusResilienceOrnamentHash
								);
								loadout.hasBonusResilienceOrnament = hasBonusResilienceOrnament;
								if (hasBonusResilienceOrnament) {
									achievedStatTiers[EArmorStatId.Resilience] += 1;
									achievedStats[EArmorStatId.Resilience] += 1;
									desiredStatTiers[EArmorStatId.Resilience] += 1;
								}
							}

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
								achievedStats[armorStatId] +=
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
									achievedStats[bonus.stat] += bonus.value;
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
				achievedStats[armorStatId] += fragmentArmorStatMapping[armorStatId];
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
			// achievedStats are not rounded
			loadout.achievedStats = achievedStats;
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
		false,
		false
	);
	return {
		preProcessedArmor,
		allClassItemMetadata: _allClassItemMetadata,
	};
};

export enum ELoadoutOptimizationTypeId {
	HigherStatTier = 'HigherStatTier',
	LowerCost = 'LowerCost',
	MissingArmor = 'MissingArmor',
	NoExoticArmor = 'NoExoticArmor',
	UnavailableMods = 'UnavailableMods',
	DeprecatedMods = 'DeprecatedMods',
	StatsOver100 = 'StatsOver100',
	UnusedFragmentSlots = 'UnusedFragmentSlots',
	UnspecifiedAspect = 'UnspecifiedAspect',
	UnmetDIMStatConstraints = 'UnmetDIMStatConstraints',
	UnusableMods = 'UnusableMods',
	UnmasterworkedArmor = 'UnmasterworkedArmor',
	FewerWastedStats = 'FewerWastedStats',
	InvalidLoadoutConfiguration = 'InvalidLoadoutConfiguration',
	MutuallyExclusiveMods = 'MutuallyExclusiveMods',
	None = 'None',
	Error = 'Error',
}

export interface ILoadoutOptimization {
	id: ELoadoutOptimizationTypeId;
	name: string;
	description: string;
	category: ELoadoutOptimizationCategoryId;
}

// There maybe multiple optimizations types that, while techincally correct, are confusing
// to a user. For example, if you are missing an armor piece, then the lower cost and higher stat tier checks aren't
// really relevant since a massive chunk of stats are missing. So we filter out some of the optimization types
export const humanizeOptimizationTypes = (
	optimizationTypeList: ELoadoutOptimizationTypeId[]
): ELoadoutOptimizationTypeId[] => {
	let filteredOptimizationTypeList: ELoadoutOptimizationTypeId[] = [
		...optimizationTypeList,
	];
	// Missing armor takes precedence over higher stat tier, lower cost, unmet stat constraints and fewer wasted stats
	if (
		filteredOptimizationTypeList.includes(
			ELoadoutOptimizationTypeId.MissingArmor
		)
	) {
		filteredOptimizationTypeList = filteredOptimizationTypeList.filter(
			(x) =>
				![
					ELoadoutOptimizationTypeId.HigherStatTier,
					ELoadoutOptimizationTypeId.LowerCost,
					ELoadoutOptimizationTypeId.UnmetDIMStatConstraints,
					ELoadoutOptimizationTypeId.FewerWastedStats,
				].includes(x)
		);
	}
	// Uncorrectable takes precedence over unavailable
	if (
		filteredOptimizationTypeList.includes(
			ELoadoutOptimizationTypeId.UnusableMods
		)
	) {
		filteredOptimizationTypeList = filteredOptimizationTypeList.filter(
			(x) => !(x === ELoadoutOptimizationTypeId.UnavailableMods)
		);
	}
	// Higher stat tier takes precendence over fewer wasted stats
	if (
		filteredOptimizationTypeList.includes(
			ELoadoutOptimizationTypeId.HigherStatTier
		)
	) {
		filteredOptimizationTypeList = filteredOptimizationTypeList.filter(
			(x) => !(x === ELoadoutOptimizationTypeId.FewerWastedStats)
		);
	}
	// Dedupe the list
	filteredOptimizationTypeList = Array.from(
		new Set(filteredOptimizationTypeList)
	);
	return filteredOptimizationTypeList;
};

const LoadoutOptimizationTypeToLoadoutOptimizationMapping: EnumDictionary<
	ELoadoutOptimizationTypeId,
	ILoadoutOptimization
> = {
	[ELoadoutOptimizationTypeId.HigherStatTier]: {
		id: ELoadoutOptimizationTypeId.HigherStatTier,
		name: 'Higher Stat Tier',
		description:
			'Recreating this loadout with a different combination of armor and/or stat boosting mods can achieve higher stat tiers.',
		category: ELoadoutOptimizationCategoryId.IMPROVEMENT,
	},
	[ELoadoutOptimizationTypeId.LowerCost]: {
		id: ELoadoutOptimizationTypeId.LowerCost,
		name: 'Lower Cost',
		description:
			'Recreating this loadout with a different combination of armor and/or stat boosting mods can achieve the same stat tiers for a lower total stat mod cost.',
		category: ELoadoutOptimizationCategoryId.IMPROVEMENT,
	},
	[ELoadoutOptimizationTypeId.FewerWastedStats]: {
		id: ELoadoutOptimizationTypeId.FewerWastedStats,
		name: 'Fewer Wasted Stats',
		description:
			'Recreating this loadout with a different combination of armor and/or stat boosting mods can achieve the same stat tiers but with fewer wasted stats. Any stat that does not end in a 0 is considered a wasted stat. For example, 89 Recovery provides the same benefit as 80 Recovery so there are 9 wasted stats. Reducing wasted stats may not increase the stat tiers that you are able to achieve, but it does look aesthetically nice to have all your stats end in a 0 :)',
		category: ELoadoutOptimizationCategoryId.COSMETIC,
	},
	[ELoadoutOptimizationTypeId.MissingArmor]: {
		id: ELoadoutOptimizationTypeId.MissingArmor,
		name: 'Missing Armor',
		description:
			'This loadout is missing one or more armor pieces. You may have deleted armor pieces that were in this loadout.',
		category: ELoadoutOptimizationCategoryId.PROBLEM,
	},
	[ELoadoutOptimizationTypeId.NoExoticArmor]: {
		id: ELoadoutOptimizationTypeId.NoExoticArmor,
		name: 'No Exotic Armor',
		description:
			'This loadout does not have an exotic armor piece. You may have deleted the exotic armor piece that was in this loadout.',
		category: ELoadoutOptimizationCategoryId.PROBLEM,
	},
	[ELoadoutOptimizationTypeId.DeprecatedMods]: {
		id: ELoadoutOptimizationTypeId.DeprecatedMods,
		name: 'Deprecated Mods',
		description:
			'This loadout uses mods that are no longer in the game. This usually means you had an old "Charged With Light", "Warmind Cell", or "Elemental Well" mod equipped.',
		category: ELoadoutOptimizationCategoryId.PROBLEM,
	},
	[ELoadoutOptimizationTypeId.UnspecifiedAspect]: {
		id: ELoadoutOptimizationTypeId.UnspecifiedAspect,
		name: 'Unused Aspect Slot',
		description:
			'This loadout only specifies one aspect. Consider adding another aspect to this loadout.',
		category: ELoadoutOptimizationCategoryId.WARNING,
	},
	[ELoadoutOptimizationTypeId.StatsOver100]: {
		id: ELoadoutOptimizationTypeId.StatsOver100,
		name: 'Stats Over 100',
		description:
			"This loadout has one or more stats of 110 or higher. There is likely a way to shuffle mods around to avoid wasting an entire stat tier's worth of stat points.",
		category: ELoadoutOptimizationCategoryId.COSMETIC,
	},
	[ELoadoutOptimizationTypeId.UnusedFragmentSlots]: {
		id: ELoadoutOptimizationTypeId.UnusedFragmentSlots,
		name: 'Unused Fragment Slots',
		description:
			"This loadout has one or more unused fragment slots. Occasionally Bungie adds more fragment slots to an aspect. You may want to add another fragment, it's free real estate!",
		category: ELoadoutOptimizationCategoryId.WARNING,
	},
	[ELoadoutOptimizationTypeId.UnavailableMods]: {
		id: ELoadoutOptimizationTypeId.UnavailableMods,
		name: 'Unavailable Mods',
		description:
			'[DIM Loadout Specific] This loadout uses mods that are no longer available. This usually happens when you were using a discounted mod that was available in a previous season via artifact unlocks. DIM is able to correct this by swapping discounted mods with their full-cost versions but you may want to consider changing these anyway.',
		category: ELoadoutOptimizationCategoryId.COSMETIC,
	},
	[ELoadoutOptimizationTypeId.UnmetDIMStatConstraints]: {
		id: ELoadoutOptimizationTypeId.UnmetDIMStatConstraints,
		name: 'Unmet DIM Stat Constraints',
		description:
			'[DIM Loadout Specific] This loadout was created using DIM\'s "Loadout Optimizer" tool, or another similar tool. At the time that this loadout was created, you were able to hit higher stat tiers that you can currently hit. This can happen when Bungie adds stat penalties to an existing fragment that is part of your loadout.',
		category: ELoadoutOptimizationCategoryId.WARNING,
	},
	[ELoadoutOptimizationTypeId.UnusableMods]: {
		id: ELoadoutOptimizationTypeId.UnusableMods,
		name: 'Unusable Mods',
		description:
			'This loadout uses mods that are no longer available. This usually happens when you were using a discounted mod that was available in a previous season via artifact unlocks.',
		category: ELoadoutOptimizationCategoryId.PROBLEM,
	},
	[ELoadoutOptimizationTypeId.UnmasterworkedArmor]: {
		id: ELoadoutOptimizationTypeId.UnmasterworkedArmor,
		name: 'Unmasterworked Armor',
		description:
			'This loadout contains unmasterworked armor. Masterworking armor provides a +2 bonus to all stats and adds additional energy capacity to the armor. Masterworking armor in this loadout may allow you to socket more expensive mods which may be beneficial to your build.',
		category: ELoadoutOptimizationCategoryId.WARNING,
	},
	[ELoadoutOptimizationTypeId.InvalidLoadoutConfiguration]: {
		id: ELoadoutOptimizationTypeId.InvalidLoadoutConfiguration,
		name: 'Invalid Loadout Configuration',
		description:
			'Something about this loadout is not configured correctly and no combination of armor pieces can make it valid. This most often happens when you have a loadout that had raid mods equipped and you have since deleted the raid armor that could socket those mods. In rare cases this can happen if you somehow managed to create a loadout where the total mod cost for a single armor slot exceeded 10. This would likely only happen if there was a bug in DIM or another third party loadout creation tool.',
		category: ELoadoutOptimizationCategoryId.PROBLEM,
	},
	[ELoadoutOptimizationTypeId.MutuallyExclusiveMods]: {
		id: ELoadoutOptimizationTypeId.MutuallyExclusiveMods,
		name: 'Mutually Exclusive Mods',
		description:
			'This loadout uses mods that are mutually exclusive. This is rare, but can happen if Bungie decides to make two mods mutually exclusive after you have already equipped both of them together. It can also happen if there is a bug in DIM or another third party loadout creation tool that let you create a loadout with such mods.',
		category: ELoadoutOptimizationCategoryId.PROBLEM,
	},
	[ELoadoutOptimizationTypeId.None]: {
		id: ELoadoutOptimizationTypeId.None,
		name: 'No Optimizations Found',
		description:
			'No optimizations found. This loadout is as good as it gets :)',
		category: ELoadoutOptimizationCategoryId.NONE,
	},
	[ELoadoutOptimizationTypeId.Error]: {
		id: ELoadoutOptimizationTypeId.Error,
		name: 'Processing Error',
		description: 'An error occurred while processing this loadout.',
		category: ELoadoutOptimizationCategoryId.ERROR,
	},
};

export const OrderedLoadoutOptimizationTypeList: ELoadoutOptimizationTypeId[] =
	ValidateEnumList(Object.values(ELoadoutOptimizationTypeId), [
		ELoadoutOptimizationTypeId.HigherStatTier,
		ELoadoutOptimizationTypeId.LowerCost,
		ELoadoutOptimizationTypeId.MissingArmor,
		ELoadoutOptimizationTypeId.UnusableMods,
		ELoadoutOptimizationTypeId.InvalidLoadoutConfiguration,
		ELoadoutOptimizationTypeId.MutuallyExclusiveMods,
		ELoadoutOptimizationTypeId.NoExoticArmor,
		ELoadoutOptimizationTypeId.DeprecatedMods,
		ELoadoutOptimizationTypeId.UnusedFragmentSlots,
		ELoadoutOptimizationTypeId.UnspecifiedAspect,
		ELoadoutOptimizationTypeId.UnmasterworkedArmor,
		ELoadoutOptimizationTypeId.UnmetDIMStatConstraints,
		ELoadoutOptimizationTypeId.UnavailableMods,
		ELoadoutOptimizationTypeId.StatsOver100,
		ELoadoutOptimizationTypeId.FewerWastedStats,
		ELoadoutOptimizationTypeId.Error,
		ELoadoutOptimizationTypeId.None,
	]);

export const OrderedLoadoutOptimizationTypeListWithoutNone =
	OrderedLoadoutOptimizationTypeList.filter(
		(x) => x !== ELoadoutOptimizationTypeId.None
	);

export const getLoadoutOptimization = (
	id: ELoadoutOptimizationTypeId
): ILoadoutOptimization => {
	return LoadoutOptimizationTypeToLoadoutOptimizationMapping[id];
};

export const NoneOptimization = getLoadoutOptimization(
	ELoadoutOptimizationTypeId.None
);

// Return all AnalyzableLoadouts that can reach higher stat tiers or that
// can reach the same stat tiers, but for cheaper.
// TODO: Possibly in the future make this also return loadouts with fewer
// wasted stats

export enum EGetLoadoutsThatCanBeOptimizedProgressType {
	Progress = 'progress',
	Error = 'error',
}
export type GetLoadoutsThatCanBeOptimizedProgressMetadata = {
	maxPossibleDesiredStatTiers: ArmorStatMapping;
	lowestCost: number;
	currentCost: number;
	lowestWastedStats: number;
	currentWastedStats: number;
	mutuallyExclusiveModGroups: string[]; // TODO: Rework this to contain the actual mod ids
};
export type GetLoadoutsThatCanBeOptimizedProgress = {
	type: EGetLoadoutsThatCanBeOptimizedProgressType;
	canBeOptimized?: boolean;
	loadoutId: string;
	optimizationTypeList: ELoadoutOptimizationTypeId[];
	metadata?: GetLoadoutsThatCanBeOptimizedProgressMetadata;
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
	optimizationTypeList: ELoadoutOptimizationTypeId[];
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
			// throw new Error('test');
			const optimizationTypeList: ELoadoutOptimizationTypeId[] = [
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
			let maxPossibleDesiredStatTiers = getDefaultArmorStatMapping();
			let lowestCost = Infinity;
			let currentCost = Infinity;
			let lowestWastedStats = Infinity;
			let currentWastedStats = Infinity;
			let mutuallyExclusiveModGroups: string[] = [];
			armorSlotModsVariants.forEach(
				(armorSlotMods, armorSlotModsVariantsIndex) => {
					// Don't even try to process without an exotic
					if (!loadout.exoticHash) {
						optimizationTypeList.push(ELoadoutOptimizationTypeId.NoExoticArmor);
						result.push({
							optimizationTypeList: optimizationTypeList,
							loadoutId: loadout.id,
						});
						earlyProgressCallback = true;
						progressCallback({
							type: EGetLoadoutsThatCanBeOptimizedProgressType.Progress,
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
						useBonusResilience: loadout.hasBonusResilienceOrnament,
						selectedExoticArmorItem: findAvailableExoticArmorItem(
							loadout.exoticHash,
							loadout.destinyClassId,
							availableExoticArmor
						),
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
					if (armorSlotModsVariantsIndex === 0) {
						maxPossibleDesiredStatTiers = {
							...processedArmor.maxPossibleDesiredStatTiers,
						};
					}
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

					let hasFewerWastedStats = false;
					let hasLowerCost = false;
					if (armorSlotModsVariantsIndex === 0) {
						// In one loop find the lowest cost and lowest wasted stats
						processedArmor.items.forEach((x) => {
							if (x.metadata.totalModCost < lowestCost) {
								lowestCost = x.metadata.totalModCost;
							}
							if (x.metadata.wastedStats < lowestWastedStats) {
								lowestWastedStats = x.metadata.wastedStats;
							}
						});

						// TODO: Should this only be done on the first loop?
						currentCost = sumOfCurrentStatModsCost;
						hasLowerCost =
							maxDiff >= 0 && lowestCost < sumOfCurrentStatModsCost;

						const wastedStats = getWastedStats(loadout.achievedStats);
						currentWastedStats = wastedStats;
						hasFewerWastedStats = lowestWastedStats < wastedStats;
					}

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

					const hasUnmasterworkedArmor = loadout.armor.some(
						(x) => !x.isMasterworked
					);

					const hasUnspecifiedAspect = loadout.aspectIdList.length === 1;

					const hasInvalidLoadoutConfiguration =
						armorSlotModsVariantsIndex === 0 && // We're on the first pass
						processedArmor.items.length === 0;

					const flattenedMods = flattenMods(loadout).map((x) => getMod(x));
					const [_hasMutuallyExclusiveMods, _mutuallyExclusiveModGroups] =
						hasMutuallyExclusiveMods(flattenedMods);
					mutuallyExclusiveModGroups = _mutuallyExclusiveModGroups;

					if (hasHigherStatTiers) {
						optimizationTypeList.push(
							ELoadoutOptimizationTypeId.HigherStatTier
						);
					}
					if (hasLowerCost) {
						optimizationTypeList.push(ELoadoutOptimizationTypeId.LowerCost);
					}
					if (missingArmor) {
						optimizationTypeList.push(ELoadoutOptimizationTypeId.MissingArmor);
					}
					if (hasUnavailableMods) {
						// DIM can correct for unavailable mods, but only if there is enough armor energy
						// InGame Loadouts cannot correct for unavailable mods
						if (loadout.loadoutType === ELoadoutType.InGame) {
							optimizationTypeList.push(
								ELoadoutOptimizationTypeId.UnusableMods
							);
						} else {
							optimizationTypeList.push(
								ELoadoutOptimizationTypeId.UnavailableMods
							);
						}
					}
					if (hasStatOver100) {
						optimizationTypeList.push(ELoadoutOptimizationTypeId.StatsOver100);
					}
					if (hasUnusedFragmentSlots) {
						optimizationTypeList.push(
							ELoadoutOptimizationTypeId.UnusedFragmentSlots
						);
					}
					if (hasUnusableMods) {
						optimizationTypeList.push(ELoadoutOptimizationTypeId.UnusableMods);
					}
					if (hasUnmetDIMStatTierConstraints) {
						optimizationTypeList.push(
							ELoadoutOptimizationTypeId.UnmetDIMStatConstraints
						);
					}
					if (hasUnmasterworkedArmor) {
						optimizationTypeList.push(
							ELoadoutOptimizationTypeId.UnmasterworkedArmor
						);
					}
					if (hasFewerWastedStats) {
						optimizationTypeList.push(
							ELoadoutOptimizationTypeId.FewerWastedStats
						);
					}
					if (hasUnspecifiedAspect) {
						optimizationTypeList.push(
							ELoadoutOptimizationTypeId.UnspecifiedAspect
						);
					}
					if (hasInvalidLoadoutConfiguration) {
						optimizationTypeList.push(
							ELoadoutOptimizationTypeId.InvalidLoadoutConfiguration
						);
					}
					if (_hasMutuallyExclusiveMods) {
						optimizationTypeList.push(
							ELoadoutOptimizationTypeId.MutuallyExclusiveMods
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
					type: EGetLoadoutsThatCanBeOptimizedProgressType.Progress,
					canBeOptimized: true,
					loadoutId: loadout.id,
					optimizationTypeList: humanizedOptimizationTypes,
					metadata: {
						maxPossibleDesiredStatTiers,
						lowestCost,
						currentCost,
						lowestWastedStats,
						currentWastedStats,
						mutuallyExclusiveModGroups,
					},
				});
				return;
			} else {
				progressCallback({
					type: EGetLoadoutsThatCanBeOptimizedProgressType.Progress,
					canBeOptimized: false,
					loadoutId: loadout.id,
					optimizationTypeList: [],
				});
				return;
			}
		} catch (e) {
			progressCallback({
				type: EGetLoadoutsThatCanBeOptimizedProgressType.Error,
				loadoutId: loadout.id,
				optimizationTypeList: [ELoadoutOptimizationTypeId.Error],
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
