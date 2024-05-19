import { EModId } from '@dlb/generated/mod/EModId';
import analyzeLoadout from '@dlb/services/loadoutAnalyzer/analyzeLoadout';
import * as ModCategory from '@dlb/types/ModCategory';
import BaseCase from './cases/Base';
import BuggedAlternateSeasonMods from './cases/BuggedAlternateSeasonMods';
import BuggedAlternateSeasonModsCorrectable from './cases/BuggedAlternateSeasonModsCorrectable';
import DeprecatedMods from './cases/DeprecatedMods';
import FewerWastedStats from './cases/FewerWastedStats';
import HigherStatTiers from './cases/HigherStatTiers';
import InvalidLoadoutConfiguration from './cases/InvalidLoadoutConfiguration';
import LowerCost from './cases/LowerCost';
import MissingArmorCase from './cases/MissingArmor';
import MutuallyExclusiveMods from './cases/MutuallyExclusiveMods';
import NoExoticArmorCase from './cases/NoExoticArmor';
import SeasonalMods from './cases/SeasonalMods';
import SeasonalModsCorrectable from './cases/SeasonalModsCorrectable';
import UnmasterworkedArmor from './cases/UnmasterworkedArmor';
import UnmetDIMStatConstraints from './cases/UnmetDIMStatConstraints';
import UnspecifiedAspect from './cases/UnspecifiedAspect';
import UnstackableMods from './cases/UnstackableMods';
import UnusableMods from './cases/UnusableMods';
import UnusedFragmentSlots from './cases/UnusedFragmentSlots';
import UnusedModSlots from './cases/UnusedModSlots';
import WastedStatTiers from './cases/WastedStatTiers';

const mockGetActiveSeasonArtifactModIdList = jest.spyOn(
	ModCategory,
	'getActiveSeasonArtifactModIdList'
);

mockGetActiveSeasonArtifactModIdList.mockImplementation(() => [
	EModId.ArtifactThermodynamicSiphon,
	EModId.ArtifactSolarStrandDualSiphon,
	EModId.ArtifactArcLoader,
]);

const testFunction = analyzeLoadout;
type TestCaseInput = Parameters<typeof testFunction>;

export type TestCase = [
	name: string,
	input: TestCaseInput,
	output: ReturnType<typeof testFunction>
];

const testCases: TestCase[] = [
	BaseCase,
	BuggedAlternateSeasonMods,
	BuggedAlternateSeasonModsCorrectable,
	DeprecatedMods,
	FewerWastedStats,
	HigherStatTiers,
	InvalidLoadoutConfiguration,
	LowerCost,
	MissingArmorCase,
	MutuallyExclusiveMods,
	NoExoticArmorCase,
	SeasonalMods,
	SeasonalModsCorrectable,
	UnmasterworkedArmor,
	UnmetDIMStatConstraints,
	UnspecifiedAspect,
	UnstackableMods,
	UnusableMods,
	UnusedFragmentSlots,
	UnusedModSlots,
	WastedStatTiers,
];

describe('analyzeLoadout', () => {
	test.each(testCases)('%p', (_name, input, output) => {
		const result = testFunction(...input);
		expect(result).toEqual(output);
	});
});
