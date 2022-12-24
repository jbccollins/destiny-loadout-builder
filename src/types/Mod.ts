import { EModId } from '@dlb/generated/mod/EModId';
import { ModIdToModMapping } from '@dlb/generated/mod/ModMapping';
import { IMod } from './generation';
import { EArmorSlotId, EModSocketCategoryId } from './IdEnums';
import { EnumDictionary } from './globals';

export const getMod = (id: EModId): IMod => ModIdToModMapping[id];

export const ModIdList = Object.values(EModId);

export const ArmorSlotModIdList = ModIdList.filter(
	(id) => getMod(id).modSocketCategoryId === EModSocketCategoryId.ArmorSlot
);

// TODO: Pre-generate this with a generation script.
const generateArmorSlotIdToArmorSlotModIdListMapping = (): EnumDictionary<
	EArmorSlotId,
	EModId[]
> => {
	const mapping: EnumDictionary<EArmorSlotId, EModId[]> = {
		[EArmorSlotId.Head]: [],
		[EArmorSlotId.Arm]: [],
		[EArmorSlotId.Chest]: [],
		[EArmorSlotId.Leg]: [],
		[EArmorSlotId.ClassItem]: [],
	};
	ArmorSlotModIdList.forEach((id) => {
		mapping[getMod(id).armorSlotId].push(id);
	});
	return mapping;
};

export const ArmorSlotIdToArmorSlotModIdListMapping: EnumDictionary<
	EArmorSlotId,
	EModId[]
> = generateArmorSlotIdToArmorSlotModIdListMapping();
