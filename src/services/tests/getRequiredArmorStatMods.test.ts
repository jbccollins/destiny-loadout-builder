import { EModId } from '@dlb/generated/mod/EModId';
import {
	getDefaultArmorMetadata,
	getDefaultAvailableExoticArmorItem,
} from '@dlb/types/Armor';
import { ArmorStatMapping } from '@dlb/types/ArmorStat';
import {
	EArmorSlotId,
	EArmorStatId,
	EDestinyClassId,
} from '@dlb/types/IdEnums';

import { describe, expect, test } from '@jest/globals';
import {
	GetRequiredArmorStatModsParams,
	RequiredStatMods,
	getRequiredArmorStatMods,
} from '@dlb/services/processArmor/getRequiredArmorStatMods';

// import {
// 	GetRequiredArmorStatModsParams,
// 	RequiredStatMods,
// 	getRequiredArmorStatMods,
// } from '@dlb/services/armor-processing';

const defaultArmorMetadataItem = getDefaultArmorMetadata().Warlock;

const artificeWarlockMetadatItem = getDefaultArmorMetadata().Warlock;
artificeWarlockMetadatItem.classItem.hasArtificeClassItem = true;
artificeWarlockMetadatItem.classItem.hasLegendaryClassItem = true;
artificeWarlockMetadatItem.classItem.hasMasterworkedArtificeClassItem = true;
artificeWarlockMetadatItem.classItem.hasMasterworkedLegendaryClassItem = true;
artificeWarlockMetadatItem.artifice.count = 4;
artificeWarlockMetadatItem.artifice.items.Head.count = 1;
artificeWarlockMetadatItem.artifice.items.Arm.count = 1;
artificeWarlockMetadatItem.artifice.items.Chest.count = 1;
artificeWarlockMetadatItem.artifice.items.Leg.count = 1;

type GetRequiredArmorStatModsTestCase = {
	name: string;
	input: GetRequiredArmorStatModsParams;
	output: RequiredStatMods;
};

const getRequiredArmorStatModsTestCases: GetRequiredArmorStatModsTestCase[] = [
	{
		name: 'It returns one major mobility mod when the only required stat is mobility',
		input: {
			stats: [0, 0, 0, 0, 0, 0],
			desiredArmorStats: {
				[EArmorStatId.Mobility]: 10,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 0,
			},
			numRemainingArmorPieces: 0,
			destinyClassId: EDestinyClassId.Warlock,
			armorMetadataItem: defaultArmorMetadataItem,
			numSeenArtificeArmorItems: 0,
			selectedExotic: getDefaultAvailableExoticArmorItem(),
		},
		output: {
			requiredArmorStatModIdList: [EModId.MobilityMod],
			requiredArtificeModIdList: [],
			requiredArmorStatModsArmorStatMapping: {
				[EArmorStatId.Mobility]: 10,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 0,
			},
			numUnusedArtificeMods: 0,
		},
	},
	{
		name: 'It returns one major and one minor mobility mod when the only required stat is mobility',
		input: {
			stats: [5, 0, 0, 0, 0, 0],
			desiredArmorStats: {
				[EArmorStatId.Mobility]: 20,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 0,
			},
			numRemainingArmorPieces: 0,
			destinyClassId: EDestinyClassId.Warlock,
			armorMetadataItem: defaultArmorMetadataItem,
			numSeenArtificeArmorItems: 0,
			selectedExotic: getDefaultAvailableExoticArmorItem(),
		},
		output: {
			requiredArmorStatModIdList: [EModId.MobilityMod, EModId.MinorMobilityMod],
			requiredArtificeModIdList: [],
			requiredArmorStatModsArmorStatMapping: {
				[EArmorStatId.Mobility]: 15,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 0,
			},
			numUnusedArtificeMods: 0,
		},
	},
	{
		name: 'It returns a ton of stats with a bunch of variations',
		input: {
			stats: [18, 54, 20, 101, 35, 41],
			desiredArmorStats: {
				[EArmorStatId.Mobility]: 30,
				[EArmorStatId.Resilience]: 60,
				[EArmorStatId.Recovery]: 80,
				[EArmorStatId.Discipline]: 100,
				[EArmorStatId.Intellect]: 40,
				[EArmorStatId.Strength]: 60,
			},
			numRemainingArmorPieces: 0,
			destinyClassId: EDestinyClassId.Warlock,
			armorMetadataItem: defaultArmorMetadataItem,
			numSeenArtificeArmorItems: 0,
			selectedExotic: getDefaultAvailableExoticArmorItem(),
		},
		output: {
			requiredArmorStatModIdList: [
				EModId.MobilityMod,
				EModId.MinorMobilityMod,
				EModId.ResilienceMod,
				EModId.RecoveryMod,
				EModId.RecoveryMod,
				EModId.RecoveryMod,
				EModId.RecoveryMod,
				EModId.RecoveryMod,
				EModId.RecoveryMod,
				EModId.MinorIntellectMod,
				EModId.StrengthMod,
				EModId.StrengthMod,
			],
			requiredArtificeModIdList: [],
			requiredArmorStatModsArmorStatMapping: {
				[EArmorStatId.Mobility]: 15,
				[EArmorStatId.Resilience]: 10,
				[EArmorStatId.Recovery]: 60,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 5,
				[EArmorStatId.Strength]: 20,
			},
			numUnusedArtificeMods: 0,
		},
	},
	{
		name: 'With three remaining pieces, it returns one mod when the only required stat is 100 mobility',
		input: {
			stats: [0, 0, 0, 0, 0, 0],
			desiredArmorStats: {
				[EArmorStatId.Mobility]: 100,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 0,
			},
			numRemainingArmorPieces: 3,
			destinyClassId: EDestinyClassId.Warlock,
			armorMetadataItem: defaultArmorMetadataItem,
			numSeenArtificeArmorItems: 0,
			selectedExotic: getDefaultAvailableExoticArmorItem(),
		},
		output: {
			requiredArmorStatModIdList: [EModId.MinorMobilityMod],
			requiredArtificeModIdList: [],
			requiredArmorStatModsArmorStatMapping: {
				[EArmorStatId.Mobility]: 5,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 0,
			},
			numUnusedArtificeMods: 0,
		},
	},
	{
		name: 'With two remaining pieces',
		input: {
			stats: [8, 0, 21, 0, 0, 0],
			desiredArmorStats: {
				[EArmorStatId.Mobility]: 100,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 90,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 0,
			},
			numRemainingArmorPieces: 2,
			destinyClassId: EDestinyClassId.Warlock,
			armorMetadataItem: defaultArmorMetadataItem,
			numSeenArtificeArmorItems: 0,
			selectedExotic: getDefaultAvailableExoticArmorItem(),
		},
		output: {
			requiredArmorStatModIdList: [
				EModId.MobilityMod,
				EModId.MobilityMod,
				EModId.MobilityMod,
				EModId.MinorRecoveryMod,
			],
			requiredArtificeModIdList: [],
			requiredArmorStatModsArmorStatMapping: {
				[EArmorStatId.Mobility]: 30,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 5,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 0,
			},
			numUnusedArtificeMods: 0,
		},
	},
	{
		name: 'With two remaining pieces',
		input: {
			stats: [8, 0, 21, 0, 0, 0],
			desiredArmorStats: {
				[EArmorStatId.Mobility]: 100,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 90,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 0,
			},
			numRemainingArmorPieces: 2,
			destinyClassId: EDestinyClassId.Warlock,
			armorMetadataItem: defaultArmorMetadataItem,
			numSeenArtificeArmorItems: 0,
			selectedExotic: getDefaultAvailableExoticArmorItem(),
		},
		output: {
			requiredArmorStatModIdList: [
				EModId.MobilityMod,
				EModId.MobilityMod,
				EModId.MobilityMod,
				EModId.MinorRecoveryMod,
			],
			requiredArtificeModIdList: [],
			requiredArmorStatModsArmorStatMapping: {
				[EArmorStatId.Mobility]: 30,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 5,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 0,
			},
			numUnusedArtificeMods: 0,
		},
	},
	{
		name: 'With no remaining pieces, and a mix of artifice and non-artifice armor, it returns the corect combination of armor stat mods and artifice stat mods',
		input: {
			stats: [18, 78, 68, 100, 24, 33],
			desiredArmorStats: {
				[EArmorStatId.Mobility]: 0,
				[EArmorStatId.Resilience]: 100,
				[EArmorStatId.Recovery]: 100,
				[EArmorStatId.Discipline]: 100,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 0,
			},
			numRemainingArmorPieces: 0,
			destinyClassId: EDestinyClassId.Warlock,
			armorMetadataItem: artificeWarlockMetadatItem,
			numSeenArtificeArmorItems: 2,
			selectedExotic: {
				armorSlot: EArmorSlotId.Chest,
				name: 'Starfire Protocol',
				count: 1,
				destinyClassName: EDestinyClassId.Warlock,
				hash: 2082483156,
				icon: '',
			},
		},
		output: {
			requiredArmorStatModIdList: [
				EModId.ResilienceMod,
				EModId.ResilienceMod,
				EModId.RecoveryMod,
				EModId.RecoveryMod,
				EModId.RecoveryMod,
			],
			requiredArtificeModIdList: [
				EModId.ResilienceForged,
				EModId.RecoveryForged,
			],
			requiredArmorStatModsArmorStatMapping: {
				[EArmorStatId.Mobility]: 0,
				[EArmorStatId.Resilience]: 20,
				[EArmorStatId.Recovery]: 30,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 0,
			},
			numUnusedArtificeMods: 0,
		},
	},
	{
		name: 'It properly chooses to replace two minor mods with artifice mods instead of one major mod',
		input: {
			stats: [1, 2, 2, 0, 0, 0],
			desiredArmorStats: {
				[EArmorStatId.Mobility]: 15,
				[EArmorStatId.Resilience]: 5,
				[EArmorStatId.Recovery]: 5,
				[EArmorStatId.Discipline]: 5,
				[EArmorStatId.Intellect]: 5,
				[EArmorStatId.Strength]: 5,
			},
			numRemainingArmorPieces: 0,
			destinyClassId: EDestinyClassId.Warlock,
			armorMetadataItem: artificeWarlockMetadatItem,
			numSeenArtificeArmorItems: 3,
			selectedExotic: {
				armorSlot: EArmorSlotId.Chest,
				name: 'Starfire Protocol',
				count: 1,
				destinyClassName: EDestinyClassId.Warlock,
				hash: 2082483156,
				icon: '',
			},
		},
		output: {
			requiredArmorStatModIdList: [
				EModId.MobilityMod,
				EModId.MinorMobilityMod,
				EModId.MinorResilienceMod,
				EModId.MinorDisciplineMod,
				EModId.MinorIntellectMod,
			],
			requiredArtificeModIdList: [
				EModId.RecoveryForged,
				EModId.StrengthForged,
				EModId.StrengthForged,
			],
			requiredArmorStatModsArmorStatMapping: {
				[EArmorStatId.Mobility]: 15,
				[EArmorStatId.Resilience]: 5,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 5,
				[EArmorStatId.Intellect]: 5,
				[EArmorStatId.Strength]: 0,
			},
			numUnusedArtificeMods: 1,
			// This would also work. The algorithm doesn't try to use fewer
			// artifice mods if possible.
			// [
			// 	EModId.MinorMobilityMod,
			// 	EModId.MinorDisciplineMod,
			// 	EModId.MinorIntellectMod,
			// 	EModId.MinorStrengthMod,
			// 	EModId.MobilityMod,
			// ],
			// [EModId.ResilienceForged, EModId.RecoveryForged],
			// {
			// 	[EArmorStatId.Mobility]: 15,
			// 	[EArmorStatId.Resilience]: 0,
			// 	[EArmorStatId.Recovery]: 0,
			// 	[EArmorStatId.Discipline]: 5,
			// 	[EArmorStatId.Intellect]: 5,
			// 	[EArmorStatId.Strength]: 5,
			// },
		},
	},
	{
		name: 'With nine mods needed it properly replaces the 4 minor mods with artifice mods',
		input: {
			stats: [2, 2, 2, 2, 50, 0],
			desiredArmorStats: {
				[EArmorStatId.Mobility]: 15,
				[EArmorStatId.Resilience]: 15,
				[EArmorStatId.Recovery]: 15,
				[EArmorStatId.Discipline]: 15,
				[EArmorStatId.Intellect]: 60,
				[EArmorStatId.Strength]: 0,
			},
			numRemainingArmorPieces: 0,
			destinyClassId: EDestinyClassId.Warlock,
			armorMetadataItem: artificeWarlockMetadatItem,
			numSeenArtificeArmorItems: 4,
			selectedExotic: {
				armorSlot: EArmorSlotId.Chest,
				name: 'Starfire Protocol',
				count: 1,
				destinyClassName: EDestinyClassId.Warlock,
				hash: 2082483156,
				icon: '',
			},
		},
		output: {
			requiredArmorStatModIdList: [
				EModId.MobilityMod,
				EModId.ResilienceMod,
				EModId.RecoveryMod,
				EModId.DisciplineMod,
				EModId.IntellectMod,
			],
			requiredArtificeModIdList: [
				EModId.MobilityForged,
				EModId.ResilienceForged,
				EModId.RecoveryForged,
				EModId.DisciplineForged,
			],
			requiredArmorStatModsArmorStatMapping: {
				[EArmorStatId.Mobility]: 10,
				[EArmorStatId.Resilience]: 10,
				[EArmorStatId.Recovery]: 10,
				[EArmorStatId.Discipline]: 10,
				[EArmorStatId.Intellect]: 10,
				[EArmorStatId.Strength]: 0,
			},
			numUnusedArtificeMods: 0,
		},
	},
];

describe('getRequiredArmorStatMods', () => {
	test(getRequiredArmorStatModsTestCases[0].name, () => {
		const { input, output } = getRequiredArmorStatModsTestCases[0];
		expect(getRequiredArmorStatMods(input)).toEqual(output);
	});
	test(getRequiredArmorStatModsTestCases[1].name, () => {
		const { input, output } = getRequiredArmorStatModsTestCases[1];
		expect(getRequiredArmorStatMods(input)).toEqual(output);
	});
	test(getRequiredArmorStatModsTestCases[2].name, () => {
		const { input, output } = getRequiredArmorStatModsTestCases[2];
		expect(getRequiredArmorStatMods(input)).toEqual(output);
	});
	test(getRequiredArmorStatModsTestCases[3].name, () => {
		const { input, output } = getRequiredArmorStatModsTestCases[3];
		expect(getRequiredArmorStatMods(input)).toEqual(output);
	});
	test(getRequiredArmorStatModsTestCases[4].name, () => {
		const { input, output } = getRequiredArmorStatModsTestCases[4];
		expect(getRequiredArmorStatMods(input)).toEqual(output);
	});
	test(getRequiredArmorStatModsTestCases[5].name, () => {
		const { input, output } = getRequiredArmorStatModsTestCases[5];
		expect(getRequiredArmorStatMods(input)).toEqual(output);
	});
	test(getRequiredArmorStatModsTestCases[6].name, () => {
		const { input, output } = getRequiredArmorStatModsTestCases[6];
		expect(getRequiredArmorStatMods(input)).toEqual(output);
	});
	test(getRequiredArmorStatModsTestCases[7].name, () => {
		const { input, output } = getRequiredArmorStatModsTestCases[7];
		const result = getRequiredArmorStatMods(input);
		expect(result).toEqual(output);
	});
	test(getRequiredArmorStatModsTestCases[8].name, () => {
		const { input, output } = getRequiredArmorStatModsTestCases[8];
		expect(getRequiredArmorStatMods(input)).toEqual(output);
	});
});
