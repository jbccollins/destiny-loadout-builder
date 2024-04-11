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
import { DimLoadoutWithId } from '@dlb/redux/features/dimLoadouts/dimLoadoutsSlice';
import {
	InGameLoadoutsDefinitions,
	InGameLoadoutsWithIdMapping,
} from '@dlb/redux/features/inGameLoadouts/inGameLoadoutsSlice';
import {
	ArmorSlotEnergyMapping,
	getDefaultArmorSlotEnergyMapping,
} from '@dlb/redux/features/reservedArmorSlotEnergy/reservedArmorSlotEnergySlice';

import {
	doProcessArmor,
	DoProcessArmorParams,
	preProcessArmor,
} from '@dlb/services/processArmor';
import {
	ArmorStatAndRaidModComboPlacement,
	getDefaultModPlacements,
} from '@dlb/services/processArmor/getModCombos';
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
	getLoadoutOptimizationCategory,
	SeverityOrderedLoadoutOptimizationCategoryIdList,
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
	EIntrinsicArmorPerkOrAttributeId,
	EMasterworkAssumption,
	EModSocketCategoryId,
} from '@dlb/types/IdEnums';
import { getJumpByHash } from '@dlb/types/Jump';
import { getMeleeByHash } from '@dlb/types/Melee';
import {
	ArmorChargeAcquisitionModIdList,
	ArmorChargeSpendModIdList,
	ArmorSlotIdToModIdListMapping,
	FontModIdList,
	getMod,
	getModByHash,
	getValidRaidModArmorSlotPlacements,
	hasActiveSeasonReducedCostVariantMods,
	hasAlternateSeasonReducedCostVariantMods,
	hasMutuallyExclusiveMods,
	hasUnstackableMods,
	NonArtifactArmorSlotModIdList,
	replaceAllModsThatDimWillReplace,
	replaceAllReducedCostVariantMods,
} from '@dlb/types/Mod';
import { getSuperAbilityByHash } from '@dlb/types/SuperAbility';
import { getBonusResilienceOrnamentHashByDestinyClassId } from '@dlb/utils/bonus-resilience-ornaments';
import { isEmpty } from 'lodash';

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

export const flattenArmor = (
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

type ExtractDimLoadoutParams = {
	dimLoadout: DimLoadoutWithId;
	armorItems: ArmorItem[];
	masterworkAssumption: EMasterworkAssumption;
	availableExoticArmor: AvailableExoticArmor;
};

export function extractDimLoadout(params: ExtractDimLoadoutParams) {
	const { dimLoadout, armorItems, masterworkAssumption, availableExoticArmor } =
		params;
	console.log('>>>>>> dimLoadout', dimLoadout);
	const destinyClassId =
		DestinyClassHashToDestinyClass[dimLoadout.classType] || null; // Loadouts with just weapons don't need to have a class type

	const loadout: AnalyzableLoadout = {
		...getDefaultAnalyzableLoadout(),
		name: dimLoadout.name,
		loadoutType: ELoadoutType.DIM,
		destinyClassId,
		dlbGeneratedId: dimLoadout.dlbGeneratedId,
	};

	const desiredStatTiers: ArmorStatMapping = getDefaultArmorStatMapping();
	const achievedStatTiers: ArmorStatMapping = getDefaultArmorStatMapping();
	const achievedStats: ArmorStatMapping = getDefaultArmorStatMapping();
	const dimStatTierConstraints: ArmorStatMapping = getDefaultArmorStatMapping();

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
			const armorStatId = getArmorStatIdFromBungieHash(statConstraint.statHash);
			dimStatTierConstraints[armorStatId] = tier;
		});
		loadout.dimStatTierConstraints = dimStatTierConstraints;
	}
	let hasHalloweenMask = false;
	dimLoadout.equipped.forEach((equippedItem) => {
		const armorItem = armorItems.find(
			(armorItem) => armorItem.id === equippedItem.id
		);
		if (armorItem) {
			if (armorItem.gearTierId === EGearTierId.Exotic) {
				loadout.exoticHash = armorItem.hash;
			}
			if (
				armorItem.intrinsicArmorPerkOrAttributeId ===
				EIntrinsicArmorPerkOrAttributeId.HalloweenMask
			) {
				hasHalloweenMask = true;
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

			const destinySubclass = getDestinySubclassByHash(subclassHash);
			loadout.destinySubclassId = destinySubclass
				? (destinySubclass.id as EDestinySubclassId)
				: null;

			if (loadout.destinySubclassId) {
				const destinyClassId = getDestinyClassIdByDestinySubclassId(
					loadout.destinySubclassId
				);
				loadout.destinyClassId = destinyClassId || null;
			}

			const classAbility = getClassAbilityByHash(classAbilityHash);
			loadout.classAbilityId = classAbility
				? (classAbility.id as EClassAbilityId)
				: null;

			const jump = getJumpByHash(jumpHash);
			loadout.jumpId = jump ? (jump.id as EJumpId) : null;

			const superAbility = getSuperAbilityByHash(superAbilityHash);
			loadout.superAbilityId = superAbility
				? (superAbility.id as ESuperAbilityId)
				: null;

			const melee = getMeleeByHash(meleeHash);
			loadout.meleeId = melee ? (melee.id as EMeleeId) : null;

			const grenade = getGrenadeByHash(grenadeHash);
			loadout.grenadeId = grenade ? (grenade.id as EGrenadeId) : null;

			aspectHashes.forEach((hash) => {
				const aspect = getAspectByHash(hash);
				if (!!aspect) {
					loadout.aspectIdList.push(aspect.id as EAspectId);
				}
			});

			fragmentHashes.forEach((hash) => {
				const fragment = getFragmentByHash(hash);
				if (!!fragment) {
					loadout.fragmentIdList.push(fragment.id as EFragmentId);
				}
			});
		}
	});
	loadout.hasHalloweenMask = hasHalloweenMask;
	dimLoadout.parameters?.mods?.forEach((hash) => {
		const mod = getModByHash(hash);
		if (!mod) {
			// This means a deprecated mod like "Protective Light". Mark this as an optimization
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
			// 	loadoutId: loadout.dlbGeneratedId,
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
					loadoutId: loadout.dlbGeneratedId,
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
					loadoutId: loadout.dlbGeneratedId,
					modId: mod.id,
				});
				return;
			}
			loadout.raidMods[idx] = mod.id;
		} else if (mod.modSocketCategoryId === EModSocketCategoryId.ArtificeStat) {
			loadout.artificeModIdList.push(mod.id);
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
	// Coerce the mod list that is in the DIM json to contain the mods that the user
	// actually sees in DIM itself. DIM swaps out out-of-season discounted mods with their
	// full cost variants, and swaps in-season full cost mods with their discounted variants.
	loadout.armorSlotMods = replaceAllModsThatDimWillReplace(
		loadout.armorSlotMods
	);
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
		desiredStatTiers[armorStatId] = roundDown10(desiredStatTiers[armorStatId]);
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
	return loadout;
}
type ExtractDimLoadoutsParams = {
	armorItems: ArmorItem[];
	dimLoadouts: DimLoadoutWithId[];
	masterworkAssumption: EMasterworkAssumption;
	availableExoticArmor: AvailableExoticArmor;
};
const extractDimLoadouts = (
	params: ExtractDimLoadoutsParams
): AnalyzableLoadout[] => {
	console.log('>>>>>> begin extractDimLoadouts');
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
		loadouts.push(
			extractDimLoadout({
				dimLoadout,
				armorItems,
				masterworkAssumption,
				availableExoticArmor,
			})
		);
	});
	console.log('>>>>>> end extractDimLoadouts');
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
	inGameLoadoutsWithId: InGameLoadoutsWithIdMapping;
	masterworkAssumption: EMasterworkAssumption;
	characters: Characters;
	inGameLoadoutsDefinitions: InGameLoadoutsDefinitions;
};
const extractInGameLoadouts = (
	params: ExtractInGameLoadoutsParams
): AnalyzableLoadout[] => {
	console.log('>>>>>> begin extractInGameLoadouts');
	const {
		inGameLoadoutsWithId,
		inGameLoadoutsDefinitions,
		armorItems,
		masterworkAssumption,
		characters,
	} = params;
	const loadouts: AnalyzableLoadout[] = [];
	if (!inGameLoadoutsWithId || Object.keys(inGameLoadoutsWithId).length === 0) {
		return [];
	}
	Object.keys(inGameLoadoutsWithId).forEach((characterId) => {
		const characterLoadouts = inGameLoadoutsWithId[characterId];
		const character = characters.find((x) => x.id === characterId) as Character;
		if (!character) {
			return;
		}
		const destinyClassId = character.destinyClassId;
		characterLoadouts.loadouts.forEach((inGameLoadout, index) => {
			console.log('>>>>>> inGameLoadout', inGameLoadout);
			// This nameHash check catches empty loadouts. It is not possible
			// to create a loadout without a name in-game.
			if (!inGameLoadout || inGameLoadout.nameHash === UNSET_PLUG_HASH) {
				return;
			}
			const loadout: AnalyzableLoadout = {
				...getDefaultAnalyzableLoadout(),
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
				dlbGeneratedId: inGameLoadout.dlbGeneratedId,
			};

			const bonusResilienceOrnamentHash =
				getBonusResilienceOrnamentHashByDestinyClassId(destinyClassId);

			const desiredStatTiers: ArmorStatMapping = getDefaultArmorStatMapping();
			const achievedStatTiers: ArmorStatMapping = getDefaultArmorStatMapping();
			const achievedStats: ArmorStatMapping = getDefaultArmorStatMapping();

			let hasHalloweenMask = false;
			inGameLoadout.items.forEach((item, index) => {
				switch (getInGameLoadoutItemTypeFromIndex(index)) {
					case EInGameLoadoutItemType.ARMOR:
						const armorItem = armorItems.find(
							(armorItem) => armorItem.id === item.itemInstanceId
						);
						if (armorItem) {
							if (
								armorItem.intrinsicArmorPerkOrAttributeId ===
								EIntrinsicArmorPerkOrAttributeId.HalloweenMask
							) {
								hasHalloweenMask = true;
							}
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
											loadoutId: loadout.dlbGeneratedId,
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
											loadoutId: loadout.dlbGeneratedId,
											modId: mod.id,
										});
										return;
									}
									loadout.raidMods[idx] = mod.id;
								} else if (
									mod.modSocketCategoryId === EModSocketCategoryId.ArtificeStat
								) {
									loadout.artificeModIdList.push(mod.id);
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
									const classAbility = getClassAbilityByHash(hash);
									if (!!classAbility) {
										loadout.classAbilityId = classAbility.id as EClassAbilityId;
									}
									break;
								case 1:
									const jump = getJumpByHash(hash);
									if (!!jump) {
										loadout.jumpId = jump.id as EJumpId;
									}
									break;
								case 2:
									const superAbility = getSuperAbilityByHash(hash);
									loadout.superAbilityId = superAbility.id as ESuperAbilityId;
									// This is a janky way to get the subclass id from the super ability id
									loadout.destinySubclassId = superAbility.destinySubclassId;
									break;
								case 3:
									const melee = getMeleeByHash(hash);
									if (!!melee) {
										loadout.meleeId = melee.id as EMeleeId;
									}
									break;
								case 4:
									const grenade = getGrenadeByHash(hash);
									if (!!grenade) {
										loadout.grenadeId = grenade.id as EGrenadeId;
									}
									break;
								case 5:
								case 6:
									const aspect = getAspectByHash(hash);
									if (!!aspect) {
										loadout.aspectIdList.push(aspect.id as EAspectId);
									}
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
									const fragment = getFragmentByHash(hash);
									if (!!fragment) {
										loadout.fragmentIdList.push(fragment.id as EFragmentId);
									}
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
			loadout.hasHalloweenMask = hasHalloweenMask;
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
	console.log('>>>>>> end extractInGameLoadouts');
	return loadouts;
};

type BuildAnalyzableLoadoutsBreakdownParams = {
	characters: Characters;
	inGameLoadoutsWithId: InGameLoadoutsWithIdMapping;
	inGameLoadoutsDefinitions: InGameLoadoutsDefinitions;
	dimLoadouts: DimLoadoutWithId[];
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
		inGameLoadoutsWithId,
		armor,
		allClassItemMetadata,
		masterworkAssumption,
		availableExoticArmor,
		characters,
		inGameLoadoutsDefinitions,
	} = params;
	const hasDimLoadouts = dimLoadouts && dimLoadouts.length > 0;
	const armorItems = flattenArmor(armor, allClassItemMetadata);
	const analyzableDimLoadouts = hasDimLoadouts
		? extractDimLoadouts({
				armorItems,
				dimLoadouts,
				masterworkAssumption,
				availableExoticArmor,
		  })
		: [];
	const analyzableInGameLoadouts = extractInGameLoadouts({
		armorItems,
		inGameLoadoutsWithId,
		masterworkAssumption,
		characters,
		inGameLoadoutsDefinitions,
	});
	const validLoadouts: Record<string, AnalyzableLoadout> = {};
	const invalidLoadouts: Record<string, AnalyzableLoadout> = {};

	[...analyzableInGameLoadouts, ...analyzableDimLoadouts].forEach((x) => {
		if (isEditableLoadout(x)) {
			validLoadouts[x.dlbGeneratedId] = x;
		} else {
			invalidLoadouts[x.dlbGeneratedId] = x;
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
	const [preProcessedArmor, _allClassItemMetadata] = preProcessArmor({
		armorGroup: armor[destinyClassId],
		selectedExoticArmor: selectedExoticArmor,
		dimLoadouts: [],
		dimLoadoutsFilterId: EDimLoadoutsFilterId.All,
		inGameLoadoutsFlatItemIdList: [],
		inGameLoadoutsFilterId: EInGameLoadoutsFilterId.All,
		minimumGearTier: EGearTierId.Legendary,
		allClassItemMetadata: allClassItemMetadata[destinyClassId],
		alwaysConsiderCollectionsRolls: false,
		useOnlyMasterworkedArmor: false,
		excludeLockedItems: false,
	});
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
	UnusedModSlots = 'UnusedModSlots',
	Doomed = 'Doomed',
	ManuallyCorrectableDoomed = 'ManuallyCorrectableDoomed',
	UnstackableMods = 'UnstackableMods',
	None = 'None',
	Error = 'Error',
}

export interface ILoadoutOptimization {
	id: ELoadoutOptimizationTypeId;
	name: string;
	description: string;
	category: ELoadoutOptimizationCategoryId;
}
type GetUnusedModSlotsParams = {
	allModsIdList: EModId[];
	maxPossibleReservedArmorSlotEnergy: ArmorSlotEnergyMapping;
};
const getUnusedModSlots = ({
	allModsIdList,
	maxPossibleReservedArmorSlotEnergy,
}: GetUnusedModSlotsParams): Partial<Record<EArmorSlotId, number>> => {
	const unusedModSlots: Partial<Record<EArmorSlotId, number>> = {};
	const allArmorSlotMods = allModsIdList
		.map((x) => getMod(x))
		.filter((x) => x?.modSocketCategoryId === EModSocketCategoryId.ArmorSlot);
	const nonArtifactArmorSlotMods = NonArtifactArmorSlotModIdList.map((x) =>
		getMod(x)
	);
	const hasFontMod = allArmorSlotMods.some((mod) =>
		FontModIdList.includes(mod.id)
	);
	const hasArmorChargeAcquisitionMod = allArmorSlotMods.some((mod) =>
		ArmorChargeAcquisitionModIdList.includes(mod.id)
	);
	const hasArmorChargeSpendMod = allArmorSlotMods.some((mod) =>
		ArmorChargeSpendModIdList.includes(mod.id)
	);

	ArmorSlotWithClassItemIdList.forEach((armorSlotId) => {
		const currentModCount = allArmorSlotMods.filter(
			(x) => x.armorSlotId === armorSlotId
		).length;
		const maxReservedArmorSlotEnergy =
			maxPossibleReservedArmorSlotEnergy[armorSlotId];

		if (currentModCount < 3 && maxReservedArmorSlotEnergy > 0) {
			const currentArmorSlotMods = allArmorSlotMods.filter(
				(x) => x.armorSlotId === armorSlotId
			);

			const potentialReccomendedMods =
				// Only recommend mods that are NOT discounted via the seasonal artifact
				nonArtifactArmorSlotMods
					// Cheap sanity pre-filter
					.filter(
						(mod) =>
							mod.armorSlotId === armorSlotId &&
							mod.cost <= maxReservedArmorSlotEnergy
					)
					// Costly logic filter
					.filter((mod) => {
						const [_hasMutuallyExclusiveMods] = hasMutuallyExclusiveMods([
							...currentArmorSlotMods,
							mod,
						]);
						// Do we have a way to actually spend armor charges?
						const meetsArmorChargeAcquisitionModConstraints =
							ArmorChargeAcquisitionModIdList.includes(mod.id)
								? hasFontMod || hasArmorChargeSpendMod
								: true;
						// If we are already using a font mod, then we can use any other font mod
						// If we don't have any armor charge acquisition mods, then we can use any font mod
						const meetsFontModConstraints = FontModIdList.includes(mod.id)
							? hasFontMod || !hasArmorChargeAcquisitionMod
							: true;
						const meetsArmorChargeSpendModConstraints =
							ArmorChargeSpendModIdList.includes(mod.id)
								? // We can only recommend using a spend mod if it's a duplicate spend mod (two copies of grenade kickstart for example)
								  // or if we don't have any other spend mods or font mods
								  !hasFontMod &&
								  (!hasArmorChargeSpendMod ||
										currentArmorSlotMods.some((cMod) => cMod.id === mod.id))
								: true;
						return (
							!_hasMutuallyExclusiveMods &&
							meetsArmorChargeAcquisitionModConstraints &&
							meetsFontModConstraints &&
							meetsArmorChargeSpendModConstraints
						);
					});
			if (potentialReccomendedMods.length > 0) {
				unusedModSlots[armorSlotId] = maxReservedArmorSlotEnergy;
			}
		}
	});
	return unusedModSlots;
};

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
	// Higher stat tier takes precedence over fewer wasted stats
	if (
		filteredOptimizationTypeList.includes(
			ELoadoutOptimizationTypeId.HigherStatTier
		)
	) {
		filteredOptimizationTypeList = filteredOptimizationTypeList.filter(
			(x) => !(x === ELoadoutOptimizationTypeId.FewerWastedStats)
		);
	}
	// Dedupe and sort the list
	filteredOptimizationTypeList = Array.from(
		new Set(filteredOptimizationTypeList)
	).sort(
		(a, b) =>
			SeverityOrderedLoadoutOptimizationCategoryIdList.indexOf(
				getLoadoutOptimization(a).category
			) -
			SeverityOrderedLoadoutOptimizationCategoryIdList.indexOf(
				getLoadoutOptimization(b).category
			)
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
			'[D2 Loadout Specific] This loadout uses mods that are no longer available. This usually happens when you were using a discounted mod that was available in a previous season via artifact unlocks.',
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
			"Something about this loadout is not configured correctly and no combination of armor pieces can make it valid. This should theoretically never happen for D2 Loadouts. If this is a DIM loadout, this can happen if you created a loadout using discounted mods from an old season. DIM will automatically attempt swap over to using the full cost variants of such mods. When DIM does such a swap, there sometimes won't be enough armor energy capacity to slot the full cost variants, which results in this optimization type. In rare cases this can happen if you somehow managed to create a loadout where the total mod cost for a given armor slot exceeded 10. This would likely only happen if there was a bug in DIM or another third party loadout creation tool.",
		category: ELoadoutOptimizationCategoryId.PROBLEM,
	},
	[ELoadoutOptimizationTypeId.MutuallyExclusiveMods]: {
		id: ELoadoutOptimizationTypeId.MutuallyExclusiveMods,
		name: 'Mutually Exclusive Mods',
		description:
			'This loadout uses mods that are mutually exclusive. This is rare, but can happen if Bungie decides to make two mods mutually exclusive after you have already equipped both of them together. It can also happen if there is a bug in DIM or another third party loadout creation tool that let you create a loadout with such mods.',
		category: ELoadoutOptimizationCategoryId.PROBLEM,
	},
	[ELoadoutOptimizationTypeId.UnusedModSlots]: {
		id: ELoadoutOptimizationTypeId.UnusedModSlots,
		name: 'Unused Mod Slots',
		description:
			"This loadout has space to slot additional mods. It's free real estate!",
		category: ELoadoutOptimizationCategoryId.IMPROVEMENT,
	},
	[ELoadoutOptimizationTypeId.Doomed]: {
		id: ELoadoutOptimizationTypeId.Doomed,
		name: 'Doomed Loadout',
		description:
			'This loadout uses discounted mods from the current season that will become unavailable once the season ends. If this is a DIM loadout, DIM will not be able to automatically swap such discounted mods for their full cost variants, as the total mod cost would exceed the available armor energy capacity.',
		category: ELoadoutOptimizationCategoryId.TRANSIENT,
	},
	[ELoadoutOptimizationTypeId.ManuallyCorrectableDoomed]: {
		id: ELoadoutOptimizationTypeId.ManuallyCorrectableDoomed,
		name: 'Doomed Loadout (Correctable)',
		description:
			'[D2 Loadout Specific] This loadout uses discounted mods from the current season that will become unavailable once the season ends. This loadout has enough armor energy capacity to slot the full cost variants of such mods. Consider manually swapping these mods for their full cost variants to ensure that this loadout is usable after the current season ends.',
		category: ELoadoutOptimizationCategoryId.TRANSIENT,
	},
	[ELoadoutOptimizationTypeId.UnstackableMods]: {
		id: ELoadoutOptimizationTypeId.UnstackableMods,
		name: 'Unstackable Mods',
		description:
			'This loadout uses multiple copies of mods with benefits that do not stack.',
		category: ELoadoutOptimizationCategoryId.WARNING,
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
		ELoadoutOptimizationTypeId.UnusedModSlots,
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
		ELoadoutOptimizationTypeId.UnstackableMods,
		ELoadoutOptimizationTypeId.Doomed,
		ELoadoutOptimizationTypeId.ManuallyCorrectableDoomed,
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

export const IgnorableLoadoutOptimizationTypes =
	OrderedLoadoutOptimizationTypeList.filter(
		(x) =>
			![
				ELoadoutOptimizationTypeId.Error,
				ELoadoutOptimizationTypeId.None,
			].includes(x)
	).map((loadoutOptimizationTypeId) => {
		const loadoutOptimizationType = getLoadoutOptimization(
			loadoutOptimizationTypeId
		);
		const { category } = loadoutOptimizationType;
		const color = getLoadoutOptimizationCategory(category).color;
		return {
			...loadoutOptimizationType,
			color,
		};
	});

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
	maxPossibleReservedArmorSlotEnergy: ArmorSlotEnergyMapping;
	lowestCost: number;
	currentCost: number;
	lowestWastedStats: number;
	currentWastedStats: number;
	mutuallyExclusiveModGroups: string[]; // TODO: Rework this to contain the actual mod ids
	unstackableModIdList: EModId[];
	modPlacement: ArmorStatAndRaidModComboPlacement;
	unusedModSlots: Partial<Record<EArmorSlotId, number>>;
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

enum EModVariantCheckType {
	Base = 'Base',
	Doomed = 'Doomed',
}

type ModReplacer = (
	armorSlotMods: ArmorSlotIdToModIdListMapping
) => ArmorSlotIdToModIdListMapping;

const ModVariantCheckTypeToModReplacerMapping: Record<
	EModVariantCheckType,
	ModReplacer
> = {
	[EModVariantCheckType.Base]: (armorSlotMods) => armorSlotMods,
	[EModVariantCheckType.Doomed]: replaceAllReducedCostVariantMods,
};

type ArmorSlotModsVariants = {
	armorSlotMods: ArmorSlotIdToModIdListMapping;
	modVariantCheckType: EModVariantCheckType;
}[];

// We assume that the DIM mods will be swapped appropriately
// before the analyzer even runs. This is how DIM behaves internally
// and we want to mimic that behavior.
// "Doomed D2" doesn't require any mod swapping. Just check if the loadout contains an in-seaon reduced cost mod
// "Unusable Mods" should be D2 specific. DIM loadouts will never have unusable mods since we pre-swap the mods on initial DIM loadout ingestion.
// "Unavailable Mods" is gone. DIM loadouts will never have unavailable mods since we pre-swap the mods on initial DIM loadout ingestion.
// "Invalid Loadout Configuration" might need to be DIM specific. The description should mention that the user may have initially created that loadout using reduced cost mods that are now out-of-season
// If "Invalid Loadout Configuration" is DIM specific, then we need to have separate checks for mutually exclusive mods and
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
			const metadata: GetLoadoutsThatCanBeOptimizedProgressMetadata = {
				maxPossibleDesiredStatTiers: getDefaultArmorStatMapping(),
				maxPossibleReservedArmorSlotEnergy: getDefaultArmorSlotEnergyMapping(),
				lowestCost: Infinity,
				currentCost: Infinity,
				lowestWastedStats: Infinity,
				currentWastedStats: Infinity,
				mutuallyExclusiveModGroups: [],
				unstackableModIdList: [],
				modPlacement: getDefaultModPlacements().placement,
				unusedModSlots: {},
			};

			// Don't even try to process without an exotic
			if (!loadout.exoticHash) {
				optimizationTypeList.push(ELoadoutOptimizationTypeId.NoExoticArmor);
				result.push({
					optimizationTypeList: optimizationTypeList,
					loadoutId: loadout.dlbGeneratedId,
				});
				progressCallback({
					type: EGetLoadoutsThatCanBeOptimizedProgressType.Progress,
					canBeOptimized: true,
					loadoutId: loadout.dlbGeneratedId,
					optimizationTypeList: optimizationTypeList,
					metadata: metadata,
				});
				return;
			}

			let hasBaseVariantModsResults = false;
			// DIM Loadouts will try to auto-correct any discounted mods from previous seasons
			// by replacing them with the full cost variants. Sometimes there is not enough
			// armor energy capacity to slot the full cost variants. We will check for both
			// the discounted and full cost variants to see if DIM can handle this or not.
			const armorSlotModsVariants: ArmorSlotModsVariants = [
				{
					armorSlotMods: ModVariantCheckTypeToModReplacerMapping[
						EModVariantCheckType.Base
					](loadout.armorSlotMods),
					modVariantCheckType: EModVariantCheckType.Base,
				},
			];

			const _hasAlternateSeasonReducedCostVariantMods =
				hasAlternateSeasonReducedCostVariantMods(loadout.armorSlotMods);
			const _hasActiveSeasonReducedCostVariantMods =
				hasActiveSeasonReducedCostVariantMods(loadout.armorSlotMods);
			// The alternate check overrides the doomed check
			// So don't even bother checking for doomed loadouts if
			// the base variant mods contain alternate season reduced cost mods
			if (
				!_hasAlternateSeasonReducedCostVariantMods &&
				_hasActiveSeasonReducedCostVariantMods
			) {
				armorSlotModsVariants.push({
					armorSlotMods: ModVariantCheckTypeToModReplacerMapping[
						EModVariantCheckType.Doomed
					](loadout.armorSlotMods),
					modVariantCheckType: EModVariantCheckType.Doomed,
				});
			}

			for (let i = 0; i < armorSlotModsVariants.length; i++) {
				const { armorSlotMods, modVariantCheckType } = armorSlotModsVariants[i];

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

				let allModsIdList = [...loadout.raidMods];
				ArmorSlotWithClassItemIdList.forEach((armorSlotId) => {
					allModsIdList = [...allModsIdList, ...armorSlotMods[armorSlotId]];
				});
				const modsArmorStatMapping = getArmorStatMappingFromMods(
					allModsIdList,
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
					armorSlotMods,
					raidMods: loadout.raidMods.filter((x) => x !== null),
					intrinsicArmorPerkOrAttributeIds: loadout.hasHalloweenMask
						? [EIntrinsicArmorPerkOrAttributeId.HalloweenMask]
						: [],
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
					assumedStatValuesStatMapping: getDefaultArmorStatMapping(),
				};
				const sumOfCurrentStatModsCost = sumModCosts(loadout.armorStatMods);
				const processedArmor = doProcessArmor(doProcessArmorParams);
				let maxDiff = -1;

				const flattenedMods = flattenMods(loadout).map((x) => getMod(x));

				if (modVariantCheckType === EModVariantCheckType.Base) {
					hasBaseVariantModsResults = processedArmor.items.length > 0;

					metadata.maxPossibleDesiredStatTiers = {
						...processedArmor.maxPossibleDesiredStatTiers,
					};
					metadata.maxPossibleReservedArmorSlotEnergy = {
						...processedArmor.maxPossibleReservedArmorSlotEnergy,
					};
					const hasMissingArmor = loadout.armor.length < 5;
					let hasHigherStatTiers = false;
					let hasFewerWastedStats = false;
					let hasLowerCost = false;
					let hasUnusedModSlots = false;
					let hasUnmetDIMStatTierConstraints = false;
					let hasStatOver100 = false;
					let hasUnusedFragmentSlots = false;
					let hasUnmasterworkedArmor = false;
					let hasUnspecifiedAspect = false;
					let hasInvalidLoadoutConfiguration = false;
					let _hasMutuallyExclusiveMods = false;
					let _mutuallyExclusiveModGroups: string[] = [];
					let _hasUnstackableMods = false;
					let _unstackableModIdList: EModId[] = [];

					// In one loop find the lowest cost and lowest wasted stats
					processedArmor.items.forEach((x) => {
						if (x.metadata.totalModCost < metadata.lowestCost) {
							metadata.lowestCost = x.metadata.totalModCost;
						}
						if (x.metadata.wastedStats < metadata.lowestWastedStats) {
							metadata.lowestWastedStats = x.metadata.wastedStats;
						}
						// If this is the currently equipped set of armor, then we can use the mod placement
						if (
							!hasMissingArmor &&
							x.armorIdList.every((processedArmorId) =>
								loadout.armor.find((x) => x.id === processedArmorId)
							)
						) {
							metadata.modPlacement = x.modPlacement;
						}
					});

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

					// // Pick the first valid placment as a placeholder
					// // We only use this for rendering armor slot mods
					// if (!modPlacement && processedArmor.items.length > 0) {
					// 	modPlacement = processedArmor.items[0].modPlacement;
					// }
					// TODO: Should this only be done on the first loop?
					metadata.currentCost = sumOfCurrentStatModsCost;
					hasLowerCost =
						maxDiff >= 0 && metadata.lowestCost < sumOfCurrentStatModsCost;

					const wastedStats = getWastedStats(loadout.achievedStats);
					metadata.currentWastedStats = wastedStats;
					hasFewerWastedStats = metadata.lowestWastedStats < wastedStats;

					const unusedModSlots = getUnusedModSlots({
						allModsIdList,
						maxPossibleReservedArmorSlotEnergy:
							metadata.maxPossibleReservedArmorSlotEnergy,
					});
					if (!isEmpty(unusedModSlots)) {
						metadata.unusedModSlots = { ...unusedModSlots };
						hasUnusedModSlots = true;
					}
					hasUnmetDIMStatTierConstraints =
						loadout.loadoutType === ELoadoutType.DIM &&
						ArmorStatIdList.some(
							(armorStatId) =>
								loadout.achievedStatTiers[armorStatId] <
								loadout.dimStatTierConstraints[armorStatId]
						);

					hasStatOver100 = Object.values(loadout.achievedStatTiers).some(
						(x) => x > 100
					);
					hasUnusedFragmentSlots =
						getFragmentSlots(loadout.aspectIdList) >
						loadout.fragmentIdList.length;

					hasUnmasterworkedArmor = loadout.armor.some((x) => !x.isMasterworked);
					hasUnspecifiedAspect = loadout.aspectIdList.length === 1;
					hasInvalidLoadoutConfiguration = processedArmor.items.length === 0;

					[_hasMutuallyExclusiveMods, _mutuallyExclusiveModGroups] =
						hasMutuallyExclusiveMods(flattenedMods);
					metadata.mutuallyExclusiveModGroups = _mutuallyExclusiveModGroups;

					[_hasUnstackableMods, _unstackableModIdList] =
						hasUnstackableMods(flattenedMods);
					metadata.unstackableModIdList = _unstackableModIdList;

					if (hasHigherStatTiers) {
						optimizationTypeList.push(
							ELoadoutOptimizationTypeId.HigherStatTier
						);
					}
					if (hasLowerCost) {
						optimizationTypeList.push(ELoadoutOptimizationTypeId.LowerCost);
					}
					if (hasMissingArmor) {
						optimizationTypeList.push(ELoadoutOptimizationTypeId.MissingArmor);
					}
					if (hasStatOver100) {
						optimizationTypeList.push(ELoadoutOptimizationTypeId.StatsOver100);
					}
					if (hasUnusedFragmentSlots) {
						optimizationTypeList.push(
							ELoadoutOptimizationTypeId.UnusedFragmentSlots
						);
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
					if (_hasUnstackableMods) {
						optimizationTypeList.push(
							ELoadoutOptimizationTypeId.UnstackableMods
						);
					}
					if (hasUnusedModSlots) {
						optimizationTypeList.push(
							ELoadoutOptimizationTypeId.UnusedModSlots
						);
					}
					if (_hasAlternateSeasonReducedCostVariantMods) {
						optimizationTypeList.push(ELoadoutOptimizationTypeId.UnusableMods);
					}
				} else if (modVariantCheckType === EModVariantCheckType.Doomed) {
					const isDoomedLoadout =
						hasBaseVariantModsResults && // The base check returned results
						processedArmor.items.length === 0; // We have no results on the second pass
					let isManuallyCorrectableDoomedLoadout = false;
					// DIM will auto-correct the loadout if it can
					// But in-game loadouts must be manually corrected
					if (loadout.loadoutType === ELoadoutType.InGame) {
						isManuallyCorrectableDoomedLoadout =
							!isDoomedLoadout && _hasActiveSeasonReducedCostVariantMods;
					}
					if (isManuallyCorrectableDoomedLoadout) {
						optimizationTypeList.push(
							ELoadoutOptimizationTypeId.ManuallyCorrectableDoomed
						);
					}

					// Don't add both "Doomed" and "ManuallyCorrectableDoomed"
					if (isDoomedLoadout && !isManuallyCorrectableDoomedLoadout) {
						optimizationTypeList.push(ELoadoutOptimizationTypeId.Doomed);
					}
				}
			}

			const humanizedOptimizationTypes =
				humanizeOptimizationTypes(optimizationTypeList);

			// Do this to fake a high score
			// const humanizedOptimizationTypes = [];

			if (humanizedOptimizationTypes.length > 0) {
				result.push({
					optimizationTypeList: humanizedOptimizationTypes,
					loadoutId: loadout.dlbGeneratedId,
				});
				progressCallback({
					type: EGetLoadoutsThatCanBeOptimizedProgressType.Progress,
					canBeOptimized: true,
					loadoutId: loadout.dlbGeneratedId,
					optimizationTypeList: humanizedOptimizationTypes,
					metadata,
				});
				return;
			} else {
				progressCallback({
					type: EGetLoadoutsThatCanBeOptimizedProgressType.Progress,
					canBeOptimized: false,
					loadoutId: loadout.dlbGeneratedId,
					optimizationTypeList: [],
					metadata,
				});
				return;
			}
		} catch (e) {
			progressCallback({
				type: EGetLoadoutsThatCanBeOptimizedProgressType.Error,
				loadoutId: loadout.dlbGeneratedId,
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
