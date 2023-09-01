import { Loadout, LoadoutParameters } from '@destinyitemmanager/dim-api-types';
import { EAspectId } from '@dlb/generated/aspect/EAspectId';
import { EClassAbilityId } from '@dlb/generated/classAbility/EClassAbilityId';
import { EFragmentId } from '@dlb/generated/fragment/EFragmentId';
import { EGrenadeId } from '@dlb/generated/grenade/EGrenadeId';
import { EJumpId } from '@dlb/generated/jump/EJumpId';
import { EMeleeId } from '@dlb/generated/melee/EMeleeId';
import { EModId } from '@dlb/generated/mod/EModId';
import { ESuperAbilityId } from '@dlb/generated/superAbility/ESuperAbilityId';
import { ProcessedArmorItemMetadataClassItem } from '@dlb/services/processArmor';
import {
	AllClassItemMetadata,
	ArmorItem,
	AvailableExoticArmorItem,
} from '@dlb/types/Armor';
import { ArmorSlotWithClassItemIdList } from '@dlb/types/ArmorSlot';
import { ArmorStatMapping, getArmorStat } from '@dlb/types/ArmorStat';
import { getAspect } from '@dlb/types/Aspect';
import { getClassAbility } from '@dlb/types/ClassAbility';
import { getDestinySubclass } from '@dlb/types/DestinySubclass';
import { DestinyClassIdToDestinyClassHash } from '@dlb/types/External';
import { getFragment } from '@dlb/types/Fragment';
import { getGrenade } from '@dlb/types/Grenade';
import {
	EArmorStatId,
	EDestinyClassId,
	EDestinySubclassId,
	EMasterworkAssumption,
} from '@dlb/types/IdEnums';
import { getJump } from '@dlb/types/Jump';
import { getMelee } from '@dlb/types/Melee';
import { ArmorSlotIdToModIdListMapping, getMod } from '@dlb/types/Mod';
import { getSuperAbility } from '@dlb/types/SuperAbility';

export type DimLoadoutConfiguration = {
	raidModIdList: EModId[];
	fragmentIdList: EFragmentId[];
	aspectIdList: EAspectId[];
	jumpId: EJumpId;
	grenadeId: EGrenadeId;
	meleeId: EMeleeId;
	classAbilityId: EClassAbilityId;
	superAbilityId: ESuperAbilityId;
	armorStatModIdList: EModId[];
	artificeModIdList: EModId[];
	exoticArmor: AvailableExoticArmorItem;
	stats: ArmorStatMapping;
	masterworkAssumption: EMasterworkAssumption;
	destinySubclassId: EDestinySubclassId;
	destinyClassId: EDestinyClassId;
	armorList: ArmorItem[];
	armorSlotMods: ArmorSlotIdToModIdListMapping;
	classItem: ProcessedArmorItemMetadataClassItem;
	classItemMetadata: AllClassItemMetadata;
};

export const generateDimQuery = (
	armorList: ArmorItem[],
	classItem: ProcessedArmorItemMetadataClassItem,
	classItemMetadata: AllClassItemMetadata
): string => {
	let query = armorList
		.map((armorItem) => {
			return `id:'${armorItem.id}'`;
		})
		.join(' or ');
	if (classItem.requiredClassItemMetadataKey !== null) {
		query += ` or id:'${
			classItemMetadata[classItem.requiredClassItemMetadataKey].items[0].id
		}'`;
	} else {
		query += ` or id:'${classItemMetadata.Legendary.items[0].id}'`;
	}

	return query;
};

export const generateDimLink = (
	configuration: DimLoadoutConfiguration
): string => {
	const {
		raidModIdList,
		fragmentIdList,
		aspectIdList,
		armorStatModIdList,
		artificeModIdList,
		exoticArmor,
		stats,
		masterworkAssumption,
		destinyClassId,
		destinySubclassId,
		armorList,
		jumpId,
		meleeId,
		classAbilityId,
		grenadeId,
		superAbilityId,
		armorSlotMods,
		classItem,
		classItemMetadata,
	} = configuration;
	const fragmentHashes: number[] = fragmentIdList.map(
		(fragmentId: EFragmentId) => getFragment(fragmentId).hash
	);
	const selectedModHashes: number[] = raidModIdList
		.filter((modId) => modId !== null)
		.map((modId: EModId) => getMod(modId).hash);
	const armorSlotModHashes: number[] = [];
	ArmorSlotWithClassItemIdList.forEach((armorSlotId) => {
		armorSlotMods[armorSlotId].forEach((id: EModId) => {
			if (id !== null) {
				armorSlotModHashes.push(getMod(id).hash);
			}
		});
	});
	const modHashes: number[] = [...selectedModHashes, ...armorSlotModHashes];
	const aspectHashes: number[] = aspectIdList
		.map((aspectId: EAspectId) => (aspectId ? getAspect(aspectId).hash : null))
		.filter((x) => x != null);
	armorStatModIdList.forEach((armorStatModId: EModId) => {
		modHashes.push(getMod(armorStatModId).hash);
	});
	artificeModIdList.forEach((artificeModId: EModId) => {
		modHashes.push(getMod(artificeModId).hash);
	});

	const data: LoadoutParameters = {
		statConstraints: [
			{
				statHash: getArmorStat(EArmorStatId.Mobility).hash,
				minTier: stats.Mobility / 10 || null,
			},
			{
				statHash: getArmorStat(EArmorStatId.Resilience).hash,
				minTier: stats.Resilience / 10 || null,
			},
			{
				statHash: getArmorStat(EArmorStatId.Recovery).hash,
				minTier: stats.Recovery / 10 || null,
			},
			{
				statHash: getArmorStat(EArmorStatId.Discipline).hash,
				minTier: stats.Discipline / 10 || null,
			},
			{
				statHash: getArmorStat(EArmorStatId.Intellect).hash,
				minTier: stats.Intellect / 10 || null,
			},
			{
				statHash: getArmorStat(EArmorStatId.Strength).hash,
				minTier: stats.Strength / 10 || null,
			},
		],
		mods: modHashes,
		// // TODO: The no const enum thing is preventing me from using the dim api type AssumeArmorMasterwork
		assumeArmorMasterwork:
			masterworkAssumption === EMasterworkAssumption.All
				? 3
				: masterworkAssumption === EMasterworkAssumption.Legendary
				? 2
				: 1,
		exoticArmorHash: exoticArmor.hash,
	};

	const loadout: Loadout = {
		id: 'dlb', // this doesn't matter and will be replaced
		name: `${
			destinySubclassId ? getDestinySubclass(destinySubclassId).name + ' ' : ''
		}${exoticArmor.name} Loadout [DLB GENERATED]`,
		classType: DestinyClassIdToDestinyClassHash[destinyClassId],
		parameters: data,
		equipped: (armorList || []).map(({ hash, id }) => ({
			id,
			hash,
		})),
		unequipped: [],
		clearSpace: false,
	};

	let potentialClassItems: ArmorItem[] = [];
	if (classItem.requiredClassItemMetadataKey !== null) {
		potentialClassItems =
			classItemMetadata[classItem.requiredClassItemMetadataKey].items;
	} else {
		potentialClassItems = classItemMetadata.Legendary.items;
	}

	// Select the highest power class item that meets our requirements
	const ci = [...potentialClassItems].sort((a, b) => b.power - a.power)[0];
	loadout.equipped.push({
		id: ci.id,
		hash: ci.hash,
	});

	// Configure subclass
	const socketOverrides: Record<number, number> = {};

	if (classAbilityId) {
		socketOverrides[0] = getClassAbility(classAbilityId).hash;
	}
	if (jumpId) {
		socketOverrides[1] = getJump(jumpId).hash;
	}
	if (superAbilityId) {
		socketOverrides[2] = getSuperAbility(superAbilityId).hash;
	}
	if (meleeId) {
		socketOverrides[3] = getMelee(meleeId).hash;
	}
	if (grenadeId) {
		socketOverrides[4] = getGrenade(grenadeId).hash;
	}
	aspectHashes.forEach((hash, i) => {
		socketOverrides[i + 5] = hash;
	});
	fragmentHashes.forEach((hash, i) => {
		// Pull these socket indexes out
		socketOverrides[i + 7] = hash;
	});

	if (destinySubclassId) {
		loadout.equipped.push({
			id: '12345', // This doesn't matter and will be overriden but apparently it's required and must be numeric. Idfk.
			hash: getDestinySubclass(destinySubclassId).hash,
			socketOverrides,
		});
	}

	const url =
		'https://app.destinyitemmanager.com/loadouts?loadout=' +
		encodeURIComponent(JSON.stringify(loadout));

	return url;
};
