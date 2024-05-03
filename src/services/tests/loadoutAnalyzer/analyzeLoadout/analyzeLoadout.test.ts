import analyzeLoadout from "@dlb/services/loadoutAnalyzer/analyzeLoadout2";
import { default as BaseCase } from "./cases/Base";
import { default as BuggedAlternateSeasonMod } from "./cases/BuggedAlternateSeasonMod";
import { default as MissingArmorCase } from "./cases/MissingArmor";
import { default as NoExoticArmorCase } from "./cases/NoExoticArmor";
import { default as UnmetDIMStatConstraints } from "./cases/UnmetDIMStatConstraints";
import { default as UnspecifiedAspect } from "./cases/UnspecifiedAspect";

const testFunction = analyzeLoadout;
type TestCaseInput = Parameters<typeof testFunction>;

export type TestCase = [name: string, input: TestCaseInput, output: ReturnType<typeof testFunction>];

const testCases: TestCase[] = [
  BaseCase,
  NoExoticArmorCase,
  MissingArmorCase,
  UnspecifiedAspect,
  UnmetDIMStatConstraints,
  BuggedAlternateSeasonMod,
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