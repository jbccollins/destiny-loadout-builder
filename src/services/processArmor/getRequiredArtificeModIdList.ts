import { EModId } from '@dlb/generated/mod/EModId';
import { ArmorStatMapping, ArmorStatIdList } from '@dlb/types/ArmorStat';
import { getArtificeStatModIdFromArmorStatId } from '@dlb/types/Mod';
import { ARTIFICE_BONUS_VALUE } from '@dlb/utils/item-utils';

export type GetrequiredArtificeModIdListParams = {
	desiredArmorStats: ArmorStatMapping;
	totalArmorStatMapping: ArmorStatMapping;
};

export const getRequiredArtificeModIdList = ({
	desiredArmorStats,
	totalArmorStatMapping,
}: GetrequiredArtificeModIdListParams): EModId[] => {
	const requiredArtificeModIdList: EModId[] = [];
	ArmorStatIdList.forEach((armorStatId) => {
		const desiredArmorStat = desiredArmorStats[armorStatId];
		const achievedArmorStat = totalArmorStatMapping[armorStatId];
		const diff = desiredArmorStat - achievedArmorStat;
		let numRequiredArtificeMods = 0;
		if (diff > 0) {
			numRequiredArtificeMods += Math.ceil(diff / ARTIFICE_BONUS_VALUE);
			for (let i = 0; i < numRequiredArtificeMods; i++) {
				requiredArtificeModIdList.push(
					getArtificeStatModIdFromArmorStatId(armorStatId)
				);
			}
		}
	});
	return requiredArtificeModIdList;
};
