import { LoadoutOptimizationTypeChecker } from '@dlb/types/AnalyzableLoadout';
import higherStatTiersChecker from './HigherStatTiers';

const checker: LoadoutOptimizationTypeChecker = (params) => {
	const meetsOptimizationCriteria =
		higherStatTiersChecker(params).meetsOptimizationCriteria;
	return {
		meetsOptimizationCriteria,
		shortCircuit: false,
		metadataOverrides: meetsOptimizationCriteria
			? {
					maxPossibleExoticArtificeDesiredStatTiers: {
						...params.metadata.maxPossibleDesiredStatTiers,
					},
			  }
			: {},
	};
};

export default checker;
