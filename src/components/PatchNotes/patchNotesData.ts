export type Section = {
	title?: string;
	items: string[];
};
export type PatchNote = {
	date: string;
	version: string;
	title: string;
	sections: Section[];
};

export const PatchNotes: PatchNote[] = [
	{
		date: '2023-04-03',
		version: '1.3.3',
		title: 'Fix desired stat preview',
		sections: [
			{
				items: [
					`Fixed an issue where the desired stat preview would show a tier as unachievable when in reality it was achievable.
					Note that this was just a visual bug and that clicking on the "unachievable" tier would still work. This fix is a bit of a hack
					and will still result in buggy desired stat preview behavior if the user selects expensive mods.
					`,
				],
			},
		],
	},
	{
		date: '2023-03-31',
		version: '1.3.2',
		title: 'Fix melee ability bug',
		sections: [
			{
				items: [
					'Fixed an issue where strand hunters and warlocks had their melee abilities swapped',
				],
			},
		],
	},
	{
		date: '2023-03-28',
		version: '1.3.1',
		title: 'Add contributors file',
		sections: [
			{
				items: [
					'Add a markdown file containing all the contributors for this project',
				],
			},
		],
	},
	{
		date: '2023-03-26',
		version: '1.3.0',
		title: 'Handle users with less armor',
		sections: [
			{
				items: [
					'Gracefully handle the case where a user does not have exotic armor for each class',
					'Add a logout button',
				],
			},
		],
	},
	{
		date: '2023-03-25',
		version: '1.2.3',
		title: 'No subclass selection defaults',
		sections: [
			{
				items: [
					'Allow the user to create a loadout with no subclass selections',
					'Add the abiltiy to clear the subclass section',
					'Fix a crash when the user had a linked profile with no characters',
					'Fix a crash when the user selected the Nightstalker subclass',
				],
			},
		],
	},
	{
		date: '2023-03-15',
		version: '1.2.2',
		title: 'Add analytics',
		sections: [
			{
				items: ['Add the base Vercel analytics package'],
			},
		],
	},
	{
		date: '2023-03-15',
		version: '1.2.1',
		title: 'Find even more armor combinations',
		sections: [
			{
				items: [
					'Fixed another bug that would sometimes prevent certain armor combinations from appearing in the results',
				],
			},
		],
	},
	{
		date: '2023-03-12',
		version: '1.2.0',
		title: 'Find more armor combinations',
		sections: [
			{
				items: [
					'Fixed a bug that would sometimes prevent certain armor combinations from appearing in the results',
					'Fixed a bug that caused a crash when the user had "classified" armor (Thanks Root of Nightmares)',
					'Artifice "forged" armor mods are now properly applied when opening the loadout in DIM',
					'Fixed stasis aspect descriptions',
					'Added a more helpful error message for crashes instead of just redirecting to the login screen',
					'Added error logging for help with debugging production crashes',
				],
			},
		],
	},
	{
		date: '2023-02-01',
		version: '1.1.0',
		title: 'Add Strand and new armor mods',
		sections: [
			{
				items: [
					'Added Strand subclass options',
					'NB: The Bungie api is returning wonky images for some strand subclass options',
					'Added patch notes',
					'Added reworked armor mods',
					'Added "No Results" UI',
				],
			},
		],
	},
	{
		date: '2022-10-23',
		version: '1.0.0',
		title: 'Initial Release',
		sections: [
			{
				items: ["It's Alive!"],
			},
		],
	},
];
