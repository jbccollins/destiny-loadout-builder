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
import { roundDown10 } from '@dlb/services/processArmor/utils';
import {
	AnalyzableLoadout,
	ELoadoutOptimizationTypeId,
	ELoadoutType,
	getDefaultAnalyzableLoadout,
} from '@dlb/types/AnalyzableLoadout';
import {
	ArmorItem,
	AvailableExoticArmor,
	getExtraMasterworkedStats,
} from '@dlb/types/Armor';
import {
	ArmorStatIdList,
	ArmorStatIndices,
	ArmorStatMapping,
	getArmorStatIdFromBungieHash,
	getArmorStatMappingFromFragments,
	getDefaultArmorStatMapping,
} from '@dlb/types/ArmorStat';
import { getAspectByHash } from '@dlb/types/Aspect';
import { Character, Characters } from '@dlb/types/Character';
import { getClassAbilityByHash } from '@dlb/types/ClassAbility';
import { getDestinyClassIdByDestinySubclassId } from '@dlb/types/DestinyClass';
import {
	getDestinySubclassByHash,
	oldToNewSubclassHashes,
} from '@dlb/types/DestinySubclass';
import { DestinyClassHashToDestinyClass } from '@dlb/types/External';
import { getFragmentByHash } from '@dlb/types/Fragment';
import { getGrenadeByHash } from '@dlb/types/Grenade';
import {
	EArmorSlotId,
	EArmorStatId,
	EDestinySubclassId,
	EGearTierId,
	EIntrinsicArmorPerkOrAttributeId,
	EMasterworkAssumption,
	EModSocketCategoryId,
} from '@dlb/types/IdEnums';
import { getJumpByHash } from '@dlb/types/Jump';
import { getMeleeByHash } from '@dlb/types/Melee';
import { getModByHash, replaceAllModsThatDimWillReplace } from '@dlb/types/Mod';
import { getSuperAbilityByHash } from '@dlb/types/SuperAbility';
import { getBonusResilienceOrnamentHashByDestinyClassId } from '@dlb/utils/bonus-resilience-ornaments';
import {
	findAvailableExoticArmorItem,
	flattenMods,
	unflattenMods,
} from './utils';

type ExtractDimLoadoutParams = {
	dimLoadout: DimLoadoutWithId;
	armorItems: ArmorItem[];
	masterworkAssumption: EMasterworkAssumption;
	availableExoticArmor: AvailableExoticArmor;
	buggedAlternateSeasonModIdList: EModId[],
};

export function extractDimLoadout(params: ExtractDimLoadoutParams) {
	const { dimLoadout, armorItems, masterworkAssumption, availableExoticArmor, buggedAlternateSeasonModIdList } =
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

	const flattenedMods = flattenMods(loadout);

	const { armorSlotMods, raidMods, armorStatMods, artificeModIdList } =
		unflattenMods(replaceAllModsThatDimWillReplace(flattenedMods, buggedAlternateSeasonModIdList));

	loadout.armorSlotMods = armorSlotMods;
	loadout.raidMods = raidMods;
	loadout.armorStatMods = armorStatMods;
	loadout.artificeModIdList = artificeModIdList;

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
	buggedAlternateSeasonModIdList: EModId[],
};

export const extractDimLoadouts = (
	params: ExtractDimLoadoutsParams
): AnalyzableLoadout[] => {
	console.log('>>>>>> begin extractDimLoadouts');
	const {
		dimLoadouts,
		armorItems,
		masterworkAssumption,
		availableExoticArmor,
		buggedAlternateSeasonModIdList,
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
				buggedAlternateSeasonModIdList
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
export const extractInGameLoadouts = (
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
