import { EModId } from '@dlb/generated/mod/EModId';
import { ProcessedArmorItemMetadataClassItem } from '@dlb/services/processArmor';
import { ARTIFICE } from '@dlb/services/processArmor/constants';
import { isRaidOrNightmareRequiredClassItem } from '@dlb/services/processArmor/utils';
import { ArmorItem } from '@dlb/types/Armor';
import { ERaidAndNightMareModTypeId } from '@dlb/types/IdEnums';
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
	} else if (item.classItem.requiredClassItemMetadataKey === ARTIFICE) {
		result = 'Artifice Class Item';
	}
	return `${
		item.classItem.hasMasterworkedVariant ? 'Any Masterworked' : 'Any'
	} ${result}`;
};
