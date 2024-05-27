import { ELoadoutOptimizationTypeId } from '@dlb/types/AnalyzableLoadout';
import BuggedAlternateSeasonMods from './BuggedAlternateSeasonMods';
import BuggedAlternateSeasonModsCorrectable from './BuggedAlternateSeasonModsCorrectable';
import DeprecatedMods from './DeprecatedMods';
import Error from './Error';
import ExoticArtificeHigherStatTiers from './ExoticArtificeHigherStatTiers';
import ExoticArtificeLowerCost from './ExoticArtificeLowerCost';
import FewerWastedStats from './FewerWastedStats';
import HigherStatTiers from './HigherStatTiers';
import InvalidLoadoutConfiguration from './InvalidLoadoutConfiguration';
import LowerCost from './LowerCost';
import MissingArmor from './MissingArmor';
import MutuallyExclusiveMods from './MutuallyExclusiveMods';
import NoExoticArmor from './NoExoticArmor';
import SeasonalMods from './SeasonalMods';
import SeasonalModsCorrectable from './SeasonalModsCorrectable';
import UnmasterworkedArmor from './UnmasterworkedArmor';
import UnmetDIMStatConstraints from './UnmetDIMStatConstraints';
import UnspecifiedAspect from './UnspecifiedAspect';
import UnstackableMods from './UnstackableMods';
import UnusableMods from './UnusableMods';
import UnusedFragmentSlots from './UnusedFragmentSlots';
import UnusedModSlots from './UnusedModSlots';
import WastedStatTiers from './WastedStatTiers';
import { ResolutionInstructionProps } from './types';

const OptimizationTypeResolutionInstructionsMapping: Record<
	ELoadoutOptimizationTypeId,
	(props: ResolutionInstructionProps) => React.ReactElement
> = {
	[ELoadoutOptimizationTypeId.BuggedAlternateSeasonMods]:
		BuggedAlternateSeasonMods,
	[ELoadoutOptimizationTypeId.BuggedAlternateSeasonModsCorrectable]:
		BuggedAlternateSeasonModsCorrectable,
	[ELoadoutOptimizationTypeId.DeprecatedMods]: DeprecatedMods,
	[ELoadoutOptimizationTypeId.FewerWastedStats]: FewerWastedStats,
	[ELoadoutOptimizationTypeId.HigherStatTiers]: HigherStatTiers,
	[ELoadoutOptimizationTypeId.InvalidLoadoutConfiguration]:
		InvalidLoadoutConfiguration,
	[ELoadoutOptimizationTypeId.LowerCost]: LowerCost,
	[ELoadoutOptimizationTypeId.MissingArmor]: MissingArmor,
	[ELoadoutOptimizationTypeId.MutuallyExclusiveMods]: MutuallyExclusiveMods,
	[ELoadoutOptimizationTypeId.NoExoticArmor]: NoExoticArmor,
	[ELoadoutOptimizationTypeId.SeasonalMods]: SeasonalMods,
	[ELoadoutOptimizationTypeId.SeasonalModsCorrectable]: SeasonalModsCorrectable,
	[ELoadoutOptimizationTypeId.UnmasterworkedArmor]: UnmasterworkedArmor,
	[ELoadoutOptimizationTypeId.UnmetDIMStatConstraints]: UnmetDIMStatConstraints,
	[ELoadoutOptimizationTypeId.UnspecifiedAspect]: UnspecifiedAspect,
	[ELoadoutOptimizationTypeId.UnstackableMods]: UnstackableMods,
	[ELoadoutOptimizationTypeId.UnusableMods]: UnusableMods,
	[ELoadoutOptimizationTypeId.UnusedFragmentSlots]: UnusedFragmentSlots,
	[ELoadoutOptimizationTypeId.UnusedModSlots]: UnusedModSlots,
	[ELoadoutOptimizationTypeId.WastedStatTiers]: WastedStatTiers,
	[ELoadoutOptimizationTypeId.ExoticArtificeHigherStatTiers]:
		ExoticArtificeHigherStatTiers,
	[ELoadoutOptimizationTypeId.ExoticArtificeLowerCost]: ExoticArtificeLowerCost,

	[ELoadoutOptimizationTypeId.Error]: Error,
	[ELoadoutOptimizationTypeId.None]: () => null,
};
export default OptimizationTypeResolutionInstructionsMapping;
