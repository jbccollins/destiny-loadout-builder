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
		date: '2024-06-06',

		version: '2.6.0',


		title: 'More Final Shape Updates',
		sections: [
			{
				items: [
					`Update the current season reduced cost mods (Bungie please stop adding these mods I fucking hate them)`,
					`Add "Empowered Finish" as an unstackable mod`,
					`Fixed a bug where the Bungie Api was mixing up Strand and Stasis resistance mods. (This was a fucky-wucky on Bungie's part)`,
					`Re-enabled all raid mods`,
					`Move all of Lightfall's special armor perks to the "Legacy Perk" section`,
					`Note that I have yet to add the new Final Shape special armor perks`
				]
			},
		],
	},
	{
		date: '2024-06-04',
		version: '2.6.0',
		title: 'The Final Shape Initial Update',
		sections: [
			{
				items: [
					`Update all aspects, fragments, mods, etc... for the final shape`,
					`Disabled all raid mods for now. These will be re-enabled in a future release.`,
				],
			},
		],
	},
	{
		date: '2024-05-29',
		version: '2.5.13',
		title: 'Exotic Artifice Fixes',
		sections: [
			{
				items: [
					`Improved logic and UI around exotic class items`,
				],
			},
		],
	},
	{
		date: '2024-05-26',
		version: '2.5.12',
		title: 'Exotic Artifice Fixes',
		sections: [
			{
				items: [
					`Added two new analyzer optimization types "Lower Cost (Exotic Artifice)" and "Higher Stat Tiers (Exotic Artifice)"`,
					`Removed the confusing setting "Exotic Artifice Analyzer Assumption", this has been replaced by the above two optimization types`,
					`Fixed a bug where some optimal mod combinations involving 5 artifice mods were not being considered`,
					`The analyzer will take significantly longer to run now due to the new optimization types`,
				],
			},
		],
	},
	{
		date: '2024-05-25',
		version: '2.5.11',
		title: 'Moar The Final Shape Prep',
		sections: [
			{
				items: [
					`Added exotic artifice analyzer assumption setting`,
					`Added support for exotic class items (placeholder for now)`,
					`Moved armor processing to a web worker. This was needed to make the extra overhead of the exotic class item processing more palatable`,
					`Fixed a bug where opening a shared DLB loadout url would change your settings back to default`,
				],
			},
		],
	},
	{
		date: '2024-05-24',
		version: '2.5.10',
		title: 'The Final Shape Prep',
		sections: [
			{
				items: [
					`Added fake prismatic subclass options to the subclass selector`,
					`Added an exotic artifice assumption selector`,
				],
			},
		],
	},
	{
		date: '2024-05-19',
		version: '2.5.9',
		title: 'Moar Analyzer Improvements',
		sections: [
			{
				items: [
					`Added a new optimization type "Bugged Alternate Season Mods (Correctable)" that is subtley different from the non-correctable variant.`,
					`More under the hood analyzer refactor`,
				],
			},
		],
	},
	{
		date: '2024-05-12',
		version: '2.5.8',
		title: 'Analyzer Improvements',
		sections: [
			{
				items: [
					`Completely re-wrote the analyzer under the hood`,
					`Fixed a bug where "Unusable Mods" was not captured for mods that did not have a "Full Cost" variant (Stuff like dual siphon mods)`,
					`Removed the "Stats Over 100" optimization type. This has been replaced by a new Optimization type "Wasted Stat Tiers" which checks for stats over 110`,
				],
			},
		],
	},
	{
		date: '2024-04-11',
		version: '2.5.7',
		title: 'Add "Bugged Alternate Season Mod" Support',
		sections: [
			{
				items: [
					`Add a new analyzer optimization type to check for loadouts that contain bugged discounted mods from old seasons. This is a complicated one to explain but the end result is that users affected by this bug will no longer get a worse grade for it.`,
					`Add a way for users to filter the analyzer results to hide fully optimized loadouts`,
				],
			},
		],
	},
	{
		date: '2024-04-10',
		version: '2.5.6',
		title: 'Add "Ignore Loadout Specific Optimization" Feature',
		sections: [
			{
				items: [
					`Give users the ability to ignore optimization types on a per loadout basis. This can help when the user decides "I know this loadout is suboptimal but I like it".`,
				],
			},
		],
	},
	{
		date: '2024-04-07',
		version: '2.5.5',
		title: 'Fix Exotic Armor Icon Bug',
		sections: [
			{
				items: [
					`Fix a bug where the exotic selector would sometimes show the icon for an exotic armor ornament instead of the icon for base exotic armor piece`,
				],
			},
		],
	},
	{
		date: '2024-04-07',
		version: '2.5.4',
		title: 'Add "Unstackable Mods" Support',
		sections: [
			{
				items: [
					`Prevent users from selecting multiple copies of mods that do not stack`,
					`Add a new analyzer optimization type to check for loadouts that contain unstackable mods`,
				],
			},
		],
	},
	{
		date: '2024-02-02',
		version: '2.5.3',
		title: 'Support Beta DIM Links',
		sections: [
			{
				items: [
					`Add a setting to use Beta DIM links when opening loadouts in DIM`,
				],
			},
		],
	},
	{
		date: '2024-01-26',
		version: '2.5.2',
		title: 'Add DIM Loadout Import',
		sections: [
			{
				items: [
					`Add the ability to paste in a DIM loadout share url and automatically populate the app with the DIM loadout data`,
				],
			},
		],
	},
	{
		date: '2024-01-22',
		version: '2.5.1',
		title: 'Add "Assume starting stat values" advanced option',
		sections: [
			{
				items: [
					`Add a new advanced option to the desired stat tiers selector that allows the user to assume that they are starting with X amount of any stat`,
				],
			},
		],
	},
	{
		date: '2023-11-20',
		version: '2.5.0',
		title: 'Major Internal Refactor',
		sections: [
			{
				items: [
					`Many under the hood changes to the way the app is built`,
					`Massive shoutout to @M7ilan for doing the heavy lifting on this one`,
				],
			},
		],
	},
	{
		date: '2023-11-28',
		version: '2.4.34',
		title: 'Add "Ascendant Protector" Intrinsic Armor Perk',
		sections: [
			{
				items: [
					`Add the "Ascendant Protector" intrinsic armor perk to the armor attributes section`,
				],
			},
		],
	},
	{
		date: '2023-11-28',
		version: '2.4.33',
		title: 'Update everything for Season of the Wish',
		sections: [
			{
				items: [
					`Update all aspects, fragments, mods, etc... to match the new season`,
				],
			},
		],
	},
	{
		date: '2023-11-10',
		version: '2.4.32',
		title:
			'Add a white border around non-masterworked items in the results view',
		sections: [
			{
				items: [
					`Previously this border was transparent which made it difficult to tell if an exotic item was masterworked`,
				],
			},
		],
	},
	{
		date: '2023-11-08',
		version: '2.4.31',
		title: 'Add setting to exclude locked items',
		sections: [
			{
				items: [
					`Add a setting to exclude items that are locked in-game from the results`,
					`Upgrade the app from Nextjs 12 => 14. Fingers crossed that nothing breaks.`,
					`Lots of internal cleanup of unused code`,
				],
			},
		],
	},
	{
		date: '2023-11-08',
		version: '2.4.30',
		title: 'Add masterwork assumption back',
		sections: [
			{
				items: [
					`Add the masterwork assumption setting back with the caveat that all class items are assumed to be masterworked`,
				],
			},
		],
	},
	{
		date: '2023-11-06',
		version: '2.4.29',
		title: 'Add loadout counts to the analyzer',
		sections: [
			{
				items: [
					`Show total loadout counts and loadout counts per class in the analyzer`,
					`Minor spacing changes to the analyzer`,
				],
			},
		],
	},
	{
		date: '2023-11-04',
		version: '2.4.28',
		title: 'Add help tooltip to armor slot armor energy indicator',
		sections: [
			{
				items: [
					`Add a tooltip to the minimum used armor energy indicator that explains what it means`,
				],
			},
		],
	},
	{
		date: '2023-11-02',
		version: '2.4.27',
		title: 'Desktop Analyzer Layout',
		sections: [
			{
				items: [
					`Show the analyzer results in an expanded view on desktop`,
					`Mobile layout is unchanged`,
				],
			},
		],
	},
	{
		date: '2023-10-28',
		version: '2.4.26',
		title: 'New Optimization Types',
		sections: [
			{
				items: [
					`Add two new optimization types: "Doomed Loadout" and "Doomed Loadout (Correctable)`,
					`Remove the "Unavailable Mods" optimization type`,
					`Correct the descriptions of the "Invalid Loadout Configuration" and "Unusable Mods" optimization types`,
					`Add a new setting to completely ignore specific optimization types`,
					`Fix a bug where optimization types were improperly applied to loadouts containing FotL masks`,
					`Notes: These changes to optimization types were made to bring DLB into alignment with DIM on how discounted mods are handled`,
				],
			},
		],
	},
	{
		date: '2023-10-27',
		version: '2.4.25-BETA',
		title: 'Enforce FotL mask when editing a loadout via the analyzer',
		sections: [
			{
				items: [
					`Loadouts that contain FotL masks will now have the Armor Attributes section populated with the FotL mask attribute when editing a loadout via the analyzer`,
				],
			},
		],
	},
	{
		date: '2023-10-24',
		version: '2.4.24-BETA',
		title: 'Unused Mod Slots Optimization',
		sections: [
			{
				items: [
					`Add a new analyzer optimization: "Unused Mod Slots"`,
					`Note that this optimization needs a bit more testing on my end before I'm sure it's 100% accurate`,
				],
			},
		],
	},
	{
		date: '2023-10-23',
		version: '2.4.23-BETA',
		title: 'Analyzer Class Specific Grades',
		sections: [
			{
				items: [
					`Add class specific grades to the analyzer`,
					`Add a new page that the user will be redirected to when there is Bungie API Maintenance. Previously the user was dumped on the error page.`,
					`Removed the settings for "Masterwork Assumption" and "Minimum Gear Tier". These were really buggy and I doubt anyone actually used them. Will revisit these options later.`,
					`Fix a bug where unmasterworked class items were not assumed to be masterworked`,
					`Fix a bug where the user might get into a state where they always land on the "Analyze" tab`,
					`Fix a bug where the application would become unusable if the user opened a shared loadout for a class that they did not have a valid set of armor for`,
				],
			},
		],
	},
	{
		date: '2023-10-22',
		version: '2.4.22-BETA',
		title: 'Minor analyzer UI changes',
		sections: [
			{
				items: [
					`Condense the width of the mod placement component to reduce the chance of needing to scroll horizontally`,
					`When generating a DIM link, prefer class items that are masterworked if there is a tie in power`,
					`Fix a bug where the user would not be loaded into the analyzer tab via a direct url link if they had to log in first`,
					`Fix a bug where the user could select mutually exclusive mods (e.g. two copies of "Fastball" or two copies of various "Finisher" mods on the class item)`,
					`Fix a bug where the user's analyzer search would not persist when switching between the "build" and "analyze" tabs`,
				],
			},
		],
	},
	{
		date: '2023-10-22',
		version: '2.4.21-BETA',
		title: 'Fix exotic armor recall bug',
		sections: [
			{
				items: [
					`Fix a bug where exotic armor was not being recalled properly when the user did not select a subclass`,
					`Fix a bug where, if the DIM API was down, the analyzer tool wouldn't analyze in-game loadouts`,
				],
			},
		],
	},
	{
		date: '2023-10-09',
		version: '2.4.20-BETA',
		title: 'Fix FotL Mask Bug',
		sections: [
			{
				items: [
					`Fix a bug where no results were returned when the user selected the "Festival of the Lost Mask" armor attribute`,
				],
			},
		],
	},
	{
		date: '2023-10-09',
		version: '2.4.19-BETA',
		title: 'Remember last used application configuration',
		sections: [
			{
				items: [
					`The app will now remember the last used application configuration (selected subclass, mods, settings etc...)`,
					`Fixed a bug with the fragments selector where it was possible to select more fragments than the game allows`,
					`Add beta.destinyloadoutbuilder.com to test risky changes like this one`,
					`Add a "Reset" button to the settings page as saving the last used application configuration is a risky change and this provides an escape hatch`,
				],
			},
		],
	},
	{
		date: '2023-10-10',
		version: '2.4.18',
		title: 'Better loadout details view',
		sections: [
			{
				items: [
					`Add subclass config and unplaced mods to the details view in for items in the analyzer tab`,
				],
			},
		],
	},
	{
		date: '2023-10-08',
		version: '2.4.17',
		title: 'Analyzer crash fix',
		sections: [
			{
				items: [
					`Fix a rare bug that could cause the user to see no results in the analyzer if they were missing an aspect in one of their in-game loadouts`,
				],
			},
		],
	},
	{
		date: '2023-10-06',
		version: '2.4.16',
		title: 'Mod Placement Details Bug Fixes',
		sections: [
			{
				items: [
					`Fix a few minor bugs associated with adding the Mod Placement Details to the analyzer tab`,
				],
			},
		],
	},
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
