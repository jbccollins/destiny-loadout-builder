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
		date: '2023-10-06',
		version: '2.4.15',
		title: 'Add discord link to main page',
		sections: [
			{
				items: [
					`Bring the discord link more front and center, right next to the tabs`,
				],
			},
		],
	},
	{
		date: '2023-10-05',
		version: '2.4.14',
		title: 'Add mod placement details to the analyzer tab',
		sections: [
			{
				items: [
					`Where applicable, show mod placements in the details section for each loadout in the analyzer tab`,
				],
			},
		],
	},
	{
		date: '2023-10-05',
		version: '2.4.13',
		title: 'Add resolution instructions in the analyzer tab',
		sections: [
			{
				items: [
					`Add instructions to resolve each of the analyzer optimization checks`,
				],
			},
		],
	},
	{
		date: '2023-10-04',
		version: '2.4.12',
		title: 'Add "only use masterworked armor" setting',
		sections: [
			{
				items: [
					`Add a new setting to only consider masterworked armor in the results`,
				],
			},
		],
	},
	{
		date: '2023-10-04',
		version: '2.4.11',
		title: 'Add bonus resilience setting',
		sections: [
			{
				items: [
					`Add a new setting to add a constant +1 resilience to all loadouts with non-exotic chestpieces`,
					`This will add the Solstice (Rekindled) ornament to the chestpiece. The ornament will be included in the DIM link`,
					`Editing a loadout that has such an ornament will turn this setting on`,
					`Since settings can now get turned on automatically, I also added a banner on the results page to alert the user about active non-default settings`,
				],
			},
		],
	},
	{
		date: '2023-10-03',
		version: '2.4.10',
		title: 'Manifest caching and other analyzer work',
		sections: [
			{
				items: [
					`Add caching for the manifest. This should speed up the load time of the app.`,
					`Update the legend for the analyzer`,
					`Add a new "Loadout Health Grade" to the analyzer`,
					`Clicking on an optimization type in the analyzer will now show a description of what that optimization type means. A bit nicer than having to look up what the type means in the legend.`,
					`A ton of minor updates to the analyzer`,
				],
			},
		],
	},
	{
		date: '2023-09-24',
		version: '2.4.9',
		title: 'Add the ability to link directly to the analyzer tab',
		sections: [
			{
				items: [
					`The analyzer tab can now be linked to directly via the url. For example: https://destinyloadoutbuilder.com/?tab=1`,
					'Minor UI changes to the analyzer filters UI',
				],
			},
		],
	},
	{
		date: '2023-09-23',
		version: '2.4.8',
		title:
			'Fix a bug where not having 10 D2 loadouts would cause the analyzer to show no results',
		sections: [
			{
				items: [`What the title says`],
			},
		],
	},
	{
		date: '2023-09-23',
		version: '2.4.7',
		title: 'Add more analyzer optimization checks',
		sections: [
			{
				items: [
					`Add 5 more optimization checks to the analyzer, bringing the total to 15`,
					`Fix a bug where discounted mods were not named properly in some places in the build tab`,
					`Change the sort order of the analyzer to sort DIM loadouts by name rather than creation date`,
				],
			},
		],
	},
	{
		date: '2023-09-22',
		version: '2.4.6',
		title: 'Add search and loadout type filter to analyzer',
		sections: [
			{
				items: [
					`Add a search bar to the analyzer`,
					`Add the ability to filter the analyzer by loadout type`,
				],
			},
		],
	},
	{
		date: '2023-09-22',
		version: '2.4.5',
		title: 'Add "in-game" loadout analysis',
		sections: [
			{
				items: [
					`Add the ability to analyze in-game loadouts`,
					`Rework the UI for the analyzer a bit`,
				],
			},
		],
	},
	{
		date: '2023-09-22',
		version: '2.4.4',
		title: 'Minor Analyzer UI Fixes',
		sections: [
			{
				items: [
					`Attempt to fix some minor UI issues that show up in production but not in local`,
				],
			},
		],
	},
	{
		date: '2023-09-22',
		version: '2.4.3',
		title: 'Prep for "in-game" loadout analysis',
		sections: [
			{
				items: [
					`Add some behind the scenes code to prep for "in-game" loadout analysis.`,
					`Fix minor bugs with the loadout analyzer user interface. Functionality is unchanged.`,
				],
			},
		],
	},
	{
		date: '2023-09-21',
		version: '2.4.2',
		title: 'Even More Analyzer Updates',
		sections: [
			{
				items: [
					`Completely reworked the loadout state for the analyzer`,
					`Add more analyzer optimization checks`,
					`Add the ability to filter by optimization type`,
					`Add the ability to hide loadouts`,
					`Loadouts are now grouped by class via tabs`,
				],
			},
		],
	},
	{
		date: '2023-09-20',
		version: '2.4.1',
		title: 'Collections Rolls Settings and More Analyzer Updates',
		sections: [
			{
				items: [
					`Add a setting to avoid considering collections exotic rolls when the user already owns a copy of the exotic armor piece`,
					`Updates to the loadout analyzer, adding a legend and more checks for more optimizations`,
				],
			},
		],
	},
	{
		date: '2023-09-19',
		version: '2.4.0',
		title: 'Add Collections Exotic Rolls',
		sections: [
			{
				items: [
					`Add collections exotic rolls to the exotic selector`,
					`This improves the experience of opening a shared loadout link when the user does not own the exotic armor piece`,
					`In the future a setting to avoid considering collections exotic rolls will be added`,
				],
			},
		],
	},
	{
		date: '2023-09-15',
		version: '2.3.3',
		title: 'Add more analyzer optimization checks',
		sections: [
			{
				items: [
					`Add checks for missing armor, old mods and unused stat tiers to the loadout analyzer`,
					`Improve the usability of tooltips on mobile devices`,
				],
			},
		],
	},
	{
		date: '2023-09-12',
		version: '2.3.2',
		title: 'Fix Old DIM Loadouts',
		sections: [
			{
				items: [
					`Fix a bug where old DIM loadouts would cause the app to crash`,
				],
			},
		],
	},
	{
		date: '2023-09-11',
		version: '2.3.1',
		title: 'Better Error Reporting',
		sections: [
			{
				items: [
					`Add better error reporting when fatal errors occur on while loading the app`,
				],
			},
		],
	},
	{
		date: '2023-09-08',
		version: '2.3.0',
		title: 'Alpha Loadout Analyzer',
		sections: [
			{
				title: 'Alpha Loadout Analyzer',
				items: [
					`Add a new "Loadout Analyzer" tool. This tool checks all of your existing DIM loadouts to see if any could reach higher stat tiers while using the same Aspects, Fragments, Mods, etc...`,
					`Changed the left panel tab navigator to use icons now that there is a fourth tab for the Loadout Analyzer.`,
					`Note that this currently only supports DIM loadouts but will support in-game loadouts in the future.`,
				],
			},
			{
				title: 'Other Changes',
				items: [
					`Fixed a bug where the website favicon was not showing up on all pages`,
				],
			},
		],
	},
	{
		date: '2023-09-07',
		version: '2.2.7',
		title: "Add Crota's End Raid Mods",
		sections: [
			{
				items: [`Add Crota's End Raid Mods to the Raid Mods section`],
			},
		],
	},
	{
		date: '2023-09-01',
		version: '2.2.6',
		title: 'Add S22 Intrinsic Armor Perk: Exhumed Excess',
		sections: [
			{
				items: [`Add the Exhumed Excess perk to the Armor Attributes section`],
			},
		],
	},
	{
		date: '2023-09-01',
		version: '2.2.5',
		title: 'Prioritize higher power class items',
		sections: [
			{
				items: [
					`DIM Links now prefer class items with higher power levels when multiple class items are available`,
				],
			},
		],
	},
	{
		date: '2023-08-25',
		version: '2.2.4',
		title: 'Season of the Witch Update',
		sections: [
			{
				items: [
					`Update Aspects, Fragments and Mods that were changed in Season of the Witch`,
				],
			},
		],
	},
	{
		date: '2023-07-17',
		version: '2.2.3',
		title: 'Add "Show Mod Placement" breakdown',
		sections: [
			{
				items: [
					`Add a new section to the results table that shows the mod placement for each armor item`,
					'Minor behind the scenes code refactoring',
				],
			},
		],
	},
	{
		date: '2023-07-07',
		version: '2.2.2',
		title: 'Add better default sort',
		sections: [
			{
				items: [
					`Add a secondary and tertiary sort to the default sort order for results.
					Results are now sorted by Total Mod Cost → Total Stat Tiers → Total Wasted Stats`,
					`Fix a bug introduced in 2.2.0 that broke shared loadout links`,
					'Update login page text a bit',
				],
			},
		],
	},
	{
		date: '2023-07-03',
		version: '2.2.1',
		title: 'Add Favicon',
		sections: [
			{
				items: [
					'Add a favicon and other meta tags to improve the look of the site when shared on social media',
					'Add link to d2exotic.com',
				],
			},
		],
	},
	{
		date: '2023-06-30',
		version: '2.2.0',
		title: 'Add Armor Attributes',
		sections: [
			{
				items: [
					'Add the ability to select armor attributes like "Iron Banner", "Guardian Games Class Item", and "Festival of the Lost Mask" as well as perks like "Sonar Amplifier"',
					'Remove armor stats from the "Order By" dropdown as they were kinda confusing',
					'Move Raid Mods to their own section, separate from armor mods',
					'Rename "Mods" section to "Armor Mods"',
					'Allow mobile users to view the "No Results" troubleshooting section',
				],
			},
		],
	},
	{
		date: '2023-06-20',
		version: '2.1.9',
		title: 'Consider items in postmaster',
		sections: [
			{
				items: [
					`Fixed a bug where armor in the postmaster was not being considered in the results`,
				],
			},
		],
	},
	{
		date: '2023-06-20',
		version: '2.1.8',
		title: 'Fix rare bug with raid mods',
		sections: [
			{
				items: [
					`Fixed a rare bug that could prevent some results from being shown when the user selected raid mods in combination with many armor mods or high reserved armor energy`,
				],
			},
		],
	},
	{
		date: '2023-06-16',
		version: '2.1.7',
		title: 'Stop using beta DIM links',
		sections: [
			{
				items: [
					`Switch over to using production DIM links instead of beta DIM links`,
				],
			},
		],
	},
	{
		date: '2023-06-09',
		version: '2.1.6',
		title: 'Class and Exotic selecor UI changes',
		sections: [
			{
				items: [
					`Change the class and exotic selectors to be stacked instead of side by side`,
					`Increase the maximum height of the exotic selector dropdown popover`,
				],
			},
		],
	},
	{
		date: '2023-06-06',
		version: '2.1.5',
		title: 'Permissions disclosure',
		sections: [
			{
				items: [
					`Add text to the login page that discloses the permissions this app requires from Bungie`,
					`Fix a bug where the "Show Results" button appeared on the "Settings" and "About" tabs`,
				],
			},
		],
	},
	{
		date: '2023-06-05',
		version: '2.1.4',
		title: 'De-clutter Mod Selection',
		sections: [
			{
				items: [
					`Put "authorized" mods that are not from the current season into a separate category that is below all other categories in the mod selection dropdowns`,
					`Change some dropdowns to not open the virtual keyboard on mobile (This will be a setting in the future)`,
				],
			},
		],
	},
	{
		date: '2023-06-05',
		version: '2.1.3',
		title: 'Add Shared Loadout Stat Priority',
		sections: [
			{
				items: [
					`Add the ability order stats by priority for shared loadout links`,
				],
			},
		],
	},
	{
		date: '2023-06-05',
		version: '2.1.2',
		title: 'Class Item Bug Fixes Round 2',
		sections: [
			{
				items: [
					`Fix a bug where class items were not respecting the "DIM" and "D2" loadout filters`,
				],
			},
		],
	},
	{
		date: '2023-06-04',
		version: '2.1.1',
		title: 'Leg Mod Categorization Fixes',
		sections: [
			{
				items: [`Fix a bug where some leg mods were improperly categorized`],
			},
		],
	},
	{
		date: '2023-06-04',
		version: '2.1.0',
		title: 'Class Item Bug Fixes',
		sections: [
			{
				items: [
					`Fix a bug where the class item was always assumed to be masterworked`,
					`Fix a bug where class items would not be added to the DIM loadout`,
					`Fix a bug where shared loadout URLs would not work properly when the user was not already logged in`,
					`Add DIM logos to relevant UI elements`,
					`Add a new setting to filter out items that are in D2 loadouts`,
					`Add "Copy DIM Query" button`,
					`Add Social and Support links`,
					`Make left panel sections collapsible`,
					`Rename "Patch Notes" tab to "About"`,
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
