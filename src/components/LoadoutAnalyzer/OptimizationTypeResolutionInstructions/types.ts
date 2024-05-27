import {
	ELoadoutOptimizationTypeId,
	RichAnalyzableLoadout,
} from '@dlb/types/AnalyzableLoadout';

export type ResolutionInstructionProps = {
	loadout: RichAnalyzableLoadout;
};

export type InspectingOptimizationDetailsProps = {
	loadout: RichAnalyzableLoadout;
	optimizationType: ELoadoutOptimizationTypeId;
};
