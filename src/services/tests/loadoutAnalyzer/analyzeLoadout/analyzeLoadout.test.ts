import analyzeLoadout from "@dlb/services/loadoutAnalyzer/analyzeLoadout2";
import { default as BaseCase } from "./cases/Base";
import { default as BuggedAlternateSeasonMods } from "./cases/BuggedAlternateSeasonMods";
import { default as DeprecatedMods } from "./cases/DeprecatedMods";
import { default as FewerWastedStats } from "./cases/FewerWastedStats";
import { default as HigherStatTiers } from "./cases/HigherStatTiers";
import { default as InvalidLoadoutConfiguration } from "./cases/InvalidLoadoutConfiguration";
import { default as LowerCost } from "./cases/LowerCost";
import { default as MissingArmorCase } from "./cases/MissingArmor";
import { default as MutuallyExclusiveMods } from "./cases/MutuallyExclusiveMods";
import { default as NoExoticArmorCase } from "./cases/NoExoticArmor";
import { default as UnmasterworkedArmor } from "./cases/UnmasterworkedArmor";
import { default as UnmetDIMStatConstraints } from "./cases/UnmetDIMStatConstraints";
import { default as UnspecifiedAspect } from "./cases/UnspecifiedAspect";
import { default as UnusableMods } from "./cases/UnusableMods";
import { default as UnusedFragmentSlots } from "./cases/UnusedFragmentSlots";
import { default as WastedStatTiers } from "./cases/WastedStatTiers";

const testFunction = analyzeLoadout;
type TestCaseInput = Parameters<typeof testFunction>;

export type TestCase = [name: string, input: TestCaseInput, output: ReturnType<typeof testFunction>];

const testCases: TestCase[] = [
  BaseCase,
  NoExoticArmorCase,
  MissingArmorCase,
  UnspecifiedAspect,
  UnmetDIMStatConstraints,
  BuggedAlternateSeasonMods,
  HigherStatTiers,
  LowerCost,
  FewerWastedStats,
  DeprecatedMods,
  WastedStatTiers,
  UnusedFragmentSlots,
  UnusableMods,
  UnmasterworkedArmor,
  InvalidLoadoutConfiguration,
  MutuallyExclusiveMods
];

// const nameOfTestToDebug = 'Base case';
const nameOfTestToDebug = null;
describe('analyzeLoadout', () => {
  const filteredTestCases = nameOfTestToDebug
    ? testCases.filter((x) => x[0] === nameOfTestToDebug)
    : testCases;
  test.each(filteredTestCases)('%p', (_name, input, output) => {
    const result = testFunction(...input);
    expect(result).toEqual(output);
  });
});