import { getDefaultArmorSlotEnergyMapping } from '@dlb/redux/features/reservedArmorSlotEnergy/reservedArmorSlotEnergySlice';
import { doProcessArmor, preProcessArmor } from '@dlb/services/processArmor';
import allClassItemMetadata from '@dlb/services/tests/fixtures/all-class-item-metadata.json';
import armor from '@dlb/services/tests/fixtures/armor.json';
import { AllClassItemMetadata, Armor } from '@dlb/types/Armor';
import { getDefaultArmorStatMapping } from '@dlb/types/ArmorStat';
import {
	EArmorSlotId,
	EArmorStatId,
	EDestinyClassId,
	EDimLoadoutsFilterId,
	EGearTierId,
	EInGameLoadoutsFilterId,
	EMasterworkAssumption,
} from '@dlb/types/IdEnums';
import {
	getDefaultArmorSlotIdToModIdListMapping,
	getDefaultPotentialRaidModArmorSlotPlacement,
} from '@dlb/types/Mod';

const [preProcessedArmor, _allClassItemMetadata] = preProcessArmor({
	armorGroup: (armor as unknown as Armor)[EDestinyClassId.Warlock],
	selectedExoticArmor: {
		hash: 1906093346,
		armorSlot: EArmorSlotId.Arm,
	},
	dimLoadouts: [],
	dimLoadoutsFilterId: EDimLoadoutsFilterId.All,
	inGameLoadoutsFlatItemIdList: [],
	inGameLoadoutsFilterId: EInGameLoadoutsFilterId.All,
	minimumGearTier: EGearTierId.Legendary,
	allClassItemMetadata: (
		allClassItemMetadata as unknown as AllClassItemMetadata
	)[EDestinyClassId.Warlock],
	alwaysConsiderCollectionsRolls: false,
	useOnlyMasterworkedArmor: false,
	excludeLockedItems: false,
});

const testFunction = doProcessArmor;

type TestCaseInput = Parameters<typeof testFunction>;
type TestCaseOutput = ReturnType<typeof testFunction>;

type TestCase = [name: string, input: TestCaseInput, output: TestCaseOutput];

// TODO: This test takes way too long to run. Find a better way to test this.
const testCases: TestCase[] = [
	[
		'It returns results with one item in each slot',
		[
			{
				masterworkAssumption: EMasterworkAssumption.None,
				useBonusResilience: false,
				selectedExoticArmorItem: null,
				desiredArmorStats: {
					[EArmorStatId.Mobility]: 0,
					[EArmorStatId.Resilience]: 60,
					[EArmorStatId.Recovery]: 60,
					[EArmorStatId.Discipline]: 0,
					[EArmorStatId.Intellect]: 0,
					[EArmorStatId.Strength]: 0,
				},
				fragmentArmorStatMapping: getDefaultArmorStatMapping(),
				modArmorStatMapping: getDefaultArmorStatMapping(),
				potentialRaidModArmorSlotPlacements: [
					getDefaultPotentialRaidModArmorSlotPlacement(),
				],
				armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
				raidMods: [],
				intrinsicArmorPerkOrAttributeIds: [],
				destinyClassId: EDestinyClassId.Warlock,
				reservedArmorSlotEnergy: getDefaultArmorSlotEnergyMapping(),
				useZeroWastedStats: false,
				alwaysConsiderCollectionsRolls: false,
				allClassItemMetadata: _allClassItemMetadata,
				armorItems: preProcessedArmor,
			},
		],
		{
			items: [],
			totalItemCount: 1,
			// TODO: Change max posible desired stat tiers to actual tiers, not values. So divide these by 10
			maxPossibleDesiredStatTiers: {
				[EArmorStatId.Mobility]: 0,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 0,
			},
			maxPossibleReservedArmorSlotEnergy: {
				[EArmorSlotId.Head]: 0,
				[EArmorSlotId.Arm]: 0,
				[EArmorSlotId.Chest]: 0,
				[EArmorSlotId.Leg]: 0,
				[EArmorSlotId.ClassItem]: 0,
			},
		},
	],
];

// const nameOfTestToDebug = 'Base';
const nameOfTestToDebug = null;
describe('profile', () => {
	const filteredTestCases = nameOfTestToDebug
		? testCases.filter((x) => x[0] === nameOfTestToDebug)
		: testCases;
	test.each(filteredTestCases)('%p', (_name, input) => {
		testFunction(...input);
		expect(1).toEqual(1);
	});
});
