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
		date: '2023-05-17',
		version: '2.0.8',
		title: 'Class Item Bug Fixes',
		sections: [
			{
				items: [
					`Fix a bug where the class item was always assumed to be masterworked`,
					`Fix a bug where class items would not be added to the DIM loadout`,
					`Add DIM logos to relevant UI elements`,
					`Add a new setting to filter out items that are in D2 loadouts`,
					`Make left panel sections collapsible`,
					`Add "Copy DIM Query" button`,
				],
			},
		],
	},
	{
		date: '2023-05-28',
		version: '2.0.7',
		title: 'Add exotic perk details to exotic armor selector',
		sections: [
			{
				items: [
					`Adds exotic perk name, icon and description to the exotic armor selector`,
					`Adds more space on mobile for users to click out of the fragment selector`,
					`Adjusts some styling for buttons`,
				],
			},
		],
	},
	{
		date: '2023-05-24',
		version: '2.0.6',
		title: 'Fix bug where some artifice armor was not considered',
		sections: [
			{
				items: [
					`Fixed a bug that caused some armor combinations with artifice armor to not be considered in the results`,
				],
			},
		],
	},
	{
		date: '2023-05-24',
		version: '2.0.5',
		title: 'Add new Strand Aspects',
		sections: [
			{
				items: [`Update aspects, mods and such for Season of the Deep`],
			},
		],
	},
	{
		date: '2023-05-17',
		version: '2.0.4',
		title: 'Zero Wasted Stats Setting',
		sections: [
			{
				items: [
					`Add a settings toggle to only show armor combinations that have zero wasted stats`,
					`As this new setting can cause many cases where there are no results found, I also updated the
					"No Results" UI to be more accurate in helping the user diagnose why they may not be
					getting any results`,
				],
			},
		],
	},
	{
		date: '2023-05-14',
		version: '2.0.3',
		title: 'More armor slot mod categories',
		sections: [
			{
				items: [
					`Added more categories for armor slot mods to group them more intuitively`,
				],
			},
		],
	},
	{
		date: '2023-05-13',
		version: '2.0.2',
		title: 'Aspect and Fragment limits',
		sections: [
			{
				items: [
					`Added logic to prevent the user from selecting more fragments than their aspects allow`,
				],
			},
		],
	},
	{
		date: '2023-05-12',
		version: '2.0.1',
		title: 'Mod Selection Rework',
		sections: [
			{
				items: [
					`Added an indicator for each armor slot that shows the minimum armor energy cost`,
					`Added the ability to reserver armor energy for a specific armor slot`,
				],
			},
		],
	},
	{
		date: '2023-05-11',
		version: '2.0.0',
		title: 'New armor processing algorithm',
		sections: [
			{
				items: [
					`Completely rewrote the underlying algorithm to process armor combinations. This should result both faster performance and more accurate results.`,
					`Added the ability to share loadouts via a url`,
					`Note that shareing loadouts will attempt to "best fit" desired stats.`,
				],
			},
		],
	},
	{
		date: '2023-05-03',
		version: '1.4.1',
		title: 'Fix crash for users without enough armor',
		sections: [
			{
				items: [
					`Added more error handling for users without enough armor to create a loadout`,
				],
			},
		],
	},
	{
		date: '2023-04-03',
		version: '1.4.0',
		title: 'Raid mods BETA',
		sections: [
			{
				items: [`Add the ability to select raid mods. This feature is in BETA`],
			},
		],
	},
	{
		date: '2023-04-03',
		version: '1.3.4',
		title: 'Allow the selection of reduced cost mods',
		sections: [
			{
				items: [
					`Add mods that have a reduced costs due to the artifact. Note that this will show some mods that are not available via the current artifact.
					In a future update such mods will be removed from the mod dropdowns.
					`,
				],
			},
		],
	},
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
		date: '2022-01-23',
		version: '1.0.0',
		title: 'Initial Release',
		sections: [
			{
				items: ["It's Alive!"],
			},
		],
	},
];
