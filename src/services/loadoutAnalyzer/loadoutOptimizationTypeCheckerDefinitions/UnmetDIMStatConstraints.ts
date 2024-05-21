import {
	ELoadoutType,
	LoadoutOptimizationTypeChecker,
} from '@dlb/types/AnalyzableLoadout';
import { ArmorStatIdList } from '@dlb/types/ArmorStat';

const checker: LoadoutOptimizationTypeChecker = (params) => {
	const { loadout } = params;

	const meetsOptimizationCriteria =
		loadout.loadoutType === ELoadoutType.DIM &&
		ArmorStatIdList.some(
			(armorStatId) =>
				loadout.achievedStatTiers[armorStatId] <
				loadout.dimStatTierConstraints[armorStatId]
		);

	return {
		meetsOptimizationCriteria,
		shortCircuit: false,
	};
};

export default checker;
