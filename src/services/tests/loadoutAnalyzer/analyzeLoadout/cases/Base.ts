import { TestCase } from "../analyzeLoadout.test";
import { getBaseOutput, getBaseParams } from "../fixtureHelpers";

const testCase: TestCase = [
  'Base',
  [getBaseParams()],
  getBaseOutput(),
];

export default testCase;