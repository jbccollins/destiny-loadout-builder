// A loadout that has some armor, mods or subclass options selected is considered valid
// If a loadout just contains weapons, shaders, etc. then it is considered invalid

import { EAspectId } from '@dlb/generated/aspect/EAspectId';
import { EModId } from '@dlb/generated/mod/EModId';
import { ArmorSlotEnergyMapping } from '@dlb/redux/features/reservedArmorSlotEnergy/reservedArmorSlotEnergySlice';
import { AnalyzableLoadout } from '@dlb/types/AnalyzableLoadout';
import {
	Armor,
	ArmorItem,
	AvailableExoticArmor,
	AvailableExoticArmorItem,
	DestinyClassToAllClassItemMetadataMapping,
	EXOTIC_CLASS_ITEM,
} from '@dlb/types/Armor';
import {
	ArmorSlotIdList,
	ArmorSlotWithClassItemIdList,
	EXOTIC_CLASS_ITEM_ICON,
} from '@dlb/types/ArmorSlot';
import { getAspect } from '@dlb/types/Aspect';
import { DestinyClassIdList } from '@dlb/types/DestinyClass';
import {
	EArmorSlotId,
	EDestinyClassId,
	EGearTierId,
	EModSocketCategoryId,
} from '@dlb/types/IdEnums';
import {
	ArmorChargeAcquisitionModIdList,
	ArmorChargeSpendModIdList,
	ArmorSlotIdToModIdListMapping,
	FontModIdList,
	NonArtifactArmorSlotModIdList,
	getMod,
	hasMutuallyExclusiveMods,
} from '@dlb/types/Mod';

export const usesExoticClassItem = (loadout: AnalyzableLoadout): boolean => {
	return loadout.armor.some(
		(x) =>
			x.armorSlot === EArmorSlotId.ClassItem &&
			x.gearTierId === EGearTierId.Exotic
	);
};

export const isEditableLoadout = (loadout: AnalyzableLoadout): boolean => {
	const hasFullSetOfLegendaryArmor =
		loadout.armor.length === 5 &&
		loadout.armor.every((x) => x.gearTierId === EGearTierId.Legendary);

	return (
		!hasFullSetOfLegendaryArmor &&
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
		ArmorSlotWithClassItemIdList.forEach((armorSlotId) => {
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

export const flattenMods = (loadout: AnalyzableLoadout): EModId[] => {
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

type UnflattenModsOutput = {
	armorSlotMods: ArmorSlotIdToModIdListMapping;
	raidMods: [EModId, EModId, EModId, EModId];
	armorStatMods: EModId[];
	artificeModIdList: EModId[];
};

export const unflattenMods = (modIdList: EModId[]): UnflattenModsOutput => {
	const armorSlotMods: ArmorSlotIdToModIdListMapping = {
		[EArmorSlotId.Head]: [null, null, null],
		[EArmorSlotId.Arm]: [null, null, null],
		[EArmorSlotId.Chest]: [null, null, null],
		[EArmorSlotId.Leg]: [null, null, null],
		[EArmorSlotId.ClassItem]: [null, null, null],
	};
	const raidMods: [EModId, EModId, EModId, EModId] = [null, null, null, null];
	const armorStatMods: EModId[] = [];
	const artificeModIdList: EModId[] = [];

	modIdList.forEach((modId) => {
		const mod = getMod(modId);
		if (!mod) {
			return;
		}
		if (mod.modSocketCategoryId === EModSocketCategoryId.ArmorSlot) {
			// replace the first null index with the modId
			const armorSlotId = mod.armorSlotId;
			const index = armorSlotMods[armorSlotId].findIndex((x) => x === null);
			if (index !== -1) {
				armorSlotMods[armorSlotId][index] = modId;
			} else {
				console.warn('No null index found for armor slot mod', modId);
			}
		} else if (mod.modSocketCategoryId === EModSocketCategoryId.Raid) {
			// replace the first null index with the modId
			const index = raidMods.findIndex((x) => x === null);
			if (index !== -1) {
				raidMods[index] = modId;
			} else {
				console.warn('No null index found for raid mod', modId);
			}
		} else if (mod.modSocketCategoryId === EModSocketCategoryId.Stat) {
			armorStatMods.push(modId);
		} else if (mod.modSocketCategoryId === EModSocketCategoryId.ArtificeStat) {
			artificeModIdList.push(modId);
		}
	});

	return {
		armorSlotMods,
		raidMods,
		armorStatMods,
		artificeModIdList,
	};
};

export const exoticClassItem: AvailableExoticArmorItem = {
	hash: -1,
	name: EXOTIC_CLASS_ITEM,
	armorSlot: EArmorSlotId.ClassItem,
	count: 1,
	exoticPerk: null,
	icon: EXOTIC_CLASS_ITEM_ICON,
	destinyClassName: EDestinyClassId.Hunter,
};

export const ExoticClassItemMapping: Record<
	EDestinyClassId,
	AvailableExoticArmorItem
> = {
	[EDestinyClassId.Hunter]: {
		...exoticClassItem,
		destinyClassName: EDestinyClassId.Hunter,
	},
	[EDestinyClassId.Titan]: {
		...exoticClassItem,
		destinyClassName: EDestinyClassId.Titan,
	},
	[EDestinyClassId.Warlock]: {
		...exoticClassItem,
		destinyClassName: EDestinyClassId.Warlock,
	},
};

export const findAvailableExoticArmorItem = (
	hash: number,
	destinyClassId: EDestinyClassId,
	availableExoticArmor: AvailableExoticArmor
): AvailableExoticArmorItem => {
	// TODO: This is a hack to handle the exotic class item
	if (hash === -1) {
		return ExoticClassItemMapping[destinyClassId];
	}

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

type GetUnusedModSlotsParams = {
	modIdList: EModId[];
	maxPossibleReservedArmorSlotEnergy: ArmorSlotEnergyMapping;
};
export const getUnusedModSlots = ({
	modIdList,
	maxPossibleReservedArmorSlotEnergy,
}: GetUnusedModSlotsParams): Partial<Record<EArmorSlotId, number>> => {
	const unusedModSlots: Partial<Record<EArmorSlotId, number>> = {};
	const allArmorSlotMods = modIdList
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

			const potentialRecommendedMods =
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
			if (potentialRecommendedMods.length > 0) {
				unusedModSlots[armorSlotId] = maxReservedArmorSlotEnergy;
			}
		}
	});
	return unusedModSlots;
};

export const getFragmentSlots = (aspectIdList: EAspectId[]): number => {
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
