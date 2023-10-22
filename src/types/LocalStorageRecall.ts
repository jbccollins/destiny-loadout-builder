import { EAspectId } from '@dlb/generated/aspect/EAspectId';
import { EClassAbilityId } from '@dlb/generated/classAbility/EClassAbilityId';
import { EFragmentId } from '@dlb/generated/fragment/EFragmentId';
import { EGrenadeId } from '@dlb/generated/grenade/EGrenadeId';
import { EJumpId } from '@dlb/generated/jump/EJumpId';
import { EMeleeId } from '@dlb/generated/melee/EMeleeId';
import { EModId } from '@dlb/generated/mod/EModId';
import { ESuperAbilityId } from '@dlb/generated/superAbility/ESuperAbilityId';
import {
	ArmorSlotEnergyMapping,
	getDefaultArmorSlotEnergyMapping,
} from '@dlb/redux/features/reservedArmorSlotEnergy/reservedArmorSlotEnergySlice';
import { getDefaultIntrinsicArmorPerkOrAttributeIdList } from '@dlb/redux/features/selectedIntrinsicArmorPerkOrAttributeIds/selectedIntrinsicArmorPerkOrAttributeIdsSlice';
import { getDefaultRaidModIdList } from '@dlb/redux/features/selectedRaidMods/selectedRaidModsSlice';
import { getDestinySubclassIdListByDestinyClassId } from './DestinyClass';
import {
	EDestinyClassId,
	EDestinySubclassId,
	EDimLoadoutsFilterId,
	EGearTierId,
	EInGameLoadoutsFilterId,
	EIntrinsicArmorPerkOrAttributeId,
	EMasterworkAssumption,
} from './IdEnums';
import {
	ArmorSlotIdToModIdListMapping,
	getDefaultArmorSlotIdToModIdListMapping,
} from './Mod';

type LocalStorageRecallDestinySubclassItem = {
	classAbilityId: EClassAbilityId;
	jumpId: EJumpId;
	superAbilityId: ESuperAbilityId;
	meleeId: EMeleeId;
	grenadeId: EGrenadeId;
	aspectIdList: EAspectId[];
	fragmentIdList: EFragmentId[];
};

type LocalStorageRecallDestinyClass = Record<
	EDestinyClassId,
	{
		subclassConfig: Record<
			EDestinySubclassId,
			LocalStorageRecallDestinySubclassItem
		>;
		exoticHash: number;
		destinySubclassId: EDestinySubclassId;
	}
>;

export type LocalStorageRecall = {
	classSpecificConfig: LocalStorageRecallDestinyClass;
	destinyClassId: EDestinyClassId;
	sharedConfig: {
		armorSlotMods: ArmorSlotIdToModIdListMapping;
		reservedArmorSlotEnergy: ArmorSlotEnergyMapping;
		raidModIdList: [EModId, EModId, EModId, EModId];
		intrinsicArmorPerkOrAttributeIdList: [
			EIntrinsicArmorPerkOrAttributeId,
			EIntrinsicArmorPerkOrAttributeId,
			EIntrinsicArmorPerkOrAttributeId,
			EIntrinsicArmorPerkOrAttributeId
		];
	};
	settings: {
		masterworkAssumption: EMasterworkAssumption;
		minimumGearTierId: EGearTierId;
		dimLoadoutsFilterId: EDimLoadoutsFilterId;
		d2LoadoutsFilterId: EInGameLoadoutsFilterId;
		useZeroWastedStats: boolean;
		alwaysConsiderCollectionsRolls: boolean;
		useOnlyMasterworkedArmor: boolean;
		useBonusResilience: boolean;
	};
};

const generateDefaultSubclassConfig = (
	destinyClassId: EDestinyClassId
): Record<EDestinySubclassId, LocalStorageRecallDestinySubclassItem> => {
	const destinySubclassIdList =
		getDestinySubclassIdListByDestinyClassId(destinyClassId);
	return destinySubclassIdList.reduce((acc, curr) => {
		return {
			...acc,
			[curr]: {
				classAbilityId: null,
				jumpId: null,
				superAbilityId: null,
				meleeId: null,
				grenadeId: null,
				aspectIdList: [],
				fragmentIdList: [],
			},
		};
	}, {} as Record<EDestinySubclassId, LocalStorageRecallDestinySubclassItem>);
};

const generateDefaultClassSpecificConfig =
	(): LocalStorageRecallDestinyClass => {
		return {
			[EDestinyClassId.Hunter]: {
				subclassConfig: generateDefaultSubclassConfig(EDestinyClassId.Hunter),
				exoticHash: null,
				destinySubclassId: null,
			},
			[EDestinyClassId.Titan]: {
				subclassConfig: generateDefaultSubclassConfig(EDestinyClassId.Titan),
				exoticHash: null,
				destinySubclassId: null,
			},
			[EDestinyClassId.Warlock]: {
				subclassConfig: generateDefaultSubclassConfig(EDestinyClassId.Warlock),
				exoticHash: null,
				destinySubclassId: null,
			},
		};
	};

// TODO: Create a way to sync this with redux selector so that if the default changes, this changes
export const getDefaultLocalStorageRecall = (): LocalStorageRecall => ({
	classSpecificConfig: generateDefaultClassSpecificConfig(),
	destinyClassId: null,
	sharedConfig: {
		armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
		reservedArmorSlotEnergy: getDefaultArmorSlotEnergyMapping(),
		raidModIdList: getDefaultRaidModIdList(),
		intrinsicArmorPerkOrAttributeIdList:
			getDefaultIntrinsicArmorPerkOrAttributeIdList(),
	},
	settings: {
		masterworkAssumption: EMasterworkAssumption.All,
		minimumGearTierId: EGearTierId.Legendary,
		dimLoadoutsFilterId: EDimLoadoutsFilterId.All,
		d2LoadoutsFilterId: EInGameLoadoutsFilterId.All,
		useZeroWastedStats: false,
		alwaysConsiderCollectionsRolls: false,
		useOnlyMasterworkedArmor: false,
		useBonusResilience: false,
	},
});

export const LOCAL_STORAGE_RECALL_KEY = 'dlb-recall';
export const setLocalStorageRecall = (recall: LocalStorageRecall): void => {
	localStorage.setItem(LOCAL_STORAGE_RECALL_KEY, JSON.stringify(recall));
};
export const getLocalStorageRecall = (): LocalStorageRecall => {
	try {
		const recall = localStorage.getItem(LOCAL_STORAGE_RECALL_KEY);
		if (recall) {
			return JSON.parse(recall);
		}
	} catch (e) {
		console.error(e);
	}
	return getDefaultLocalStorageRecall();
};

export async function setLocalStorageRecallAsync(
	recall: LocalStorageRecall
): Promise<void> {
	return new Promise((resolve, reject) => {
		try {
			setLocalStorageRecall(recall);
			resolve();
		} catch (e) {
			reject(e);
		}
	});
}
