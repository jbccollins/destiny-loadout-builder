import { EModId } from '@dlb/generated/mod/EModId';
import { ProcessedArmorItemMetadataClassItem } from '@dlb/services/processArmor';
import { ARTIFICE } from '@dlb/services/processArmor/constants';
import { ArmorStatAndRaidModComboPlacement } from '@dlb/services/processArmor/getModCombos';
import {
	isIntrinsicArmorPerkOrAttributeRequiredClassItem,
	isRaidOrNightmareRequiredClassItem,
} from '@dlb/services/processArmor/utils';
import { ArmorItem } from '@dlb/types/Armor';
import {
	EIntrinsicArmorPerkOrAttributeId,
	ERaidAndNightMareModTypeId,
} from '@dlb/types/IdEnums';
import { getIntrinsicArmorPerkOrAttribute } from '@dlb/types/IntrinsicArmorPerkOrAttribute';
import { getRaidAndNightmareModType } from '@dlb/types/RaidAndNightmareModType';

export type SortableFields = {
	Mobility: number;
	Resilience: number;
	Recovery: number;
	Discipline: number;
	Intellect: number;
	Strength: number;
	totalModCost: number;
	totalStatTiers: number;
	wastedStats: number;
};

export type ResultsTableLoadout = {
	id: string;
	sortableFields: SortableFields;
	armorItems: ArmorItem[];
	requiredStatModIdList: EModId[];
	requiredArtificeModIdList: EModId[];
	classItem: ProcessedArmorItemMetadataClassItem;
	modPlacement: ArmorStatAndRaidModComboPlacement;
};

export const getClassItemText = (item: ResultsTableLoadout): string => {
	let result = 'Class Item';
	// const artificeArmorItems = item.armorItems.filter((x) => x.isArtifice);
	if (
		item.classItem.requiredClassItemMetadataKey !== null &&
		isRaidOrNightmareRequiredClassItem(
			item.classItem.requiredClassItemMetadataKey
		)
	) {
		result = `${
			getRaidAndNightmareModType(
				item.classItem
					.requiredClassItemMetadataKey as ERaidAndNightMareModTypeId
			).abbreviation
		} Class Item`;
	} else if (
		item.classItem.requiredClassItemMetadataKey !== null &&
		isIntrinsicArmorPerkOrAttributeRequiredClassItem(
			item.classItem.requiredClassItemMetadataKey
		)
	) {
		result = `${
			getIntrinsicArmorPerkOrAttribute(
				item.classItem
					.requiredClassItemMetadataKey as EIntrinsicArmorPerkOrAttributeId
			).abbreviation
		} Class Item`;
	} else if (item.classItem.requiredClassItemMetadataKey === ARTIFICE) {
		result = 'Artifice Class Item';
	}
	return `${
		item.classItem.hasMasterworkedVariant ? 'Any Masterworked' : 'Any'
	} ${result}`;
};
