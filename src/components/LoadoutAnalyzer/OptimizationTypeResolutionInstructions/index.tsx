import { ELoadoutOptimizationTypeId } from '@dlb/types/AnalyzableLoadout';
import BuggedAlternateSeasonMods from './BuggedAlternateSeasonMods';
import HigherStatTiers from './HigherStatTiers';
import UnusableMods from './UnusableMods';
import { ResolutionInstructionProps } from './types';

const OptimizationTypeResolutionInstructionsMapping: Partial<
	Record<
		ELoadoutOptimizationTypeId,
		(props: ResolutionInstructionProps) => React.ReactElement
	>
> = {
	[ELoadoutOptimizationTypeId.BuggedAlternateSeasonMods]:
		BuggedAlternateSeasonMods,
	[ELoadoutOptimizationTypeId.HigherStatTiers]: HigherStatTiers,
	[ELoadoutOptimizationTypeId.UnusableMods]: UnusableMods,
};
export default OptimizationTypeResolutionInstructionsMapping;
