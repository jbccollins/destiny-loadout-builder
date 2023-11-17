import { warnLogCollapsedStack } from '@dlb/dim/utils/log';
import {
	AllDestinyManifestComponents,
	DestinyActivityDefinition,
	DestinyActivityModeDefinition,
	DestinyActivityModifierDefinition,
	DestinyBreakerTypeDefinition,
	DestinyClassDefinition,
	DestinyCollectibleDefinition,
	DestinyDamageTypeDefinition,
	DestinyDestinationDefinition,
	DestinyEnergyTypeDefinition,
	DestinyEventCardDefinition,
	DestinyFactionDefinition,
	DestinyGenderDefinition,
	DestinyInventoryBucketDefinition,
	DestinyInventoryItemDefinition,
	DestinyItemCategoryDefinition,
	DestinyItemTierTypeDefinition,
	DestinyLoadoutColorDefinition,
	DestinyLoadoutConstantsDefinition,
	DestinyLoadoutIconDefinition,
	DestinyLoadoutNameDefinition,
	DestinyMaterialRequirementSetDefinition,
	DestinyMetricDefinition,
	DestinyMilestoneDefinition,
	DestinyObjectiveDefinition,
	DestinyPlaceDefinition,
	DestinyPlugSetDefinition,
	DestinyPowerCapDefinition,
	DestinyPresentationNodeDefinition,
	DestinyProgressionDefinition,
	DestinyRaceDefinition,
	DestinyRecordDefinition,
	DestinySandboxPerkDefinition,
	DestinySeasonDefinition,
	DestinySeasonPassDefinition,
	DestinySocketCategoryDefinition,
	DestinySocketTypeDefinition,
	DestinyStatDefinition,
	DestinyStatGroupDefinition,
	DestinyTraitDefinition,
	DestinyVendorDefinition,
	DestinyVendorGroupDefinition,
} from 'bungie-api-ts-no-const-enum/destiny2';
import { doGetManifest } from '../manifest/manifest-service';

export const allTables = [
	'Activity',
	'ActivityMode',
	'ActivityModifier',
	'BreakerType',
	'Class',
	'Collectible',
	'DamageType',
	'Destination',
	'EnergyType',
	'EventCard',
	'Faction',
	'Gender',
	'InventoryBucket',
	'InventoryItem',
	'ItemCategory',
	'ItemTierType',
	'LoadoutColor',
	'LoadoutConstants',
	'LoadoutIcon',
	'LoadoutName',
	'MaterialRequirementSet',
	'Metric',
	'Milestone',
	'Objective',
	'Place',
	'PlugSet',
	'PowerCap',
	'PresentationNode',
	'Progression',
	'Race',
	'Record',
	'SandboxPerk',
	'Season',
	'SeasonPass',
	'SocketCategory',
	'SocketType',
	'Stat',
	'StatGroup',
	'Trait',
	'Vendor',
	'VendorGroup',
];

export interface DefinitionTable<T> {
	/**
	 * for troubleshooting/questionable lookups, include second arg
	 * and sentry can gather info about the source of the invalid hash.
	 * `requestor` ideally a string/number, or a definition including a "hash" key
	 */
	get(hash: number, requestor?: { hash: number } | string | number): T;
	getAll(): { [hash: number]: T };
}

export interface D2ManifestDefinitions {
	Activity: DefinitionTable<DestinyActivityDefinition>;
	ActivityMode: DefinitionTable<DestinyActivityModeDefinition>;
	ActivityModifier: DefinitionTable<DestinyActivityModifierDefinition>;
	BreakerType: DefinitionTable<DestinyBreakerTypeDefinition>;
	Class: DefinitionTable<DestinyClassDefinition>;
	Collectible: DefinitionTable<DestinyCollectibleDefinition>;
	DamageType: DefinitionTable<DestinyDamageTypeDefinition>;
	Destination: DefinitionTable<DestinyDestinationDefinition>;
	EnergyType: DefinitionTable<DestinyEnergyTypeDefinition>;
	EventCard: DefinitionTable<DestinyEventCardDefinition>;
	Faction: DefinitionTable<DestinyFactionDefinition>;
	Gender: DefinitionTable<DestinyGenderDefinition>;
	InventoryBucket: DefinitionTable<DestinyInventoryBucketDefinition>;
	InventoryItem: DefinitionTable<DestinyInventoryItemDefinition>;
	ItemCategory: DefinitionTable<DestinyItemCategoryDefinition>;
	ItemTierType: DefinitionTable<DestinyItemTierTypeDefinition>;
	LoadoutColor: DefinitionTable<DestinyLoadoutColorDefinition>;
	LoadoutIcon: DefinitionTable<DestinyLoadoutIconDefinition>;
	LoadoutName: DefinitionTable<DestinyLoadoutNameDefinition>;
	MaterialRequirementSet: DefinitionTable<DestinyMaterialRequirementSetDefinition>;
	Metric: DefinitionTable<DestinyMetricDefinition>;
	Milestone: DefinitionTable<DestinyMilestoneDefinition>;
	Objective: DefinitionTable<DestinyObjectiveDefinition>;
	Place: DefinitionTable<DestinyPlaceDefinition>;
	PlugSet: DefinitionTable<DestinyPlugSetDefinition>;
	PowerCap: DefinitionTable<DestinyPowerCapDefinition>;
	PresentationNode: DefinitionTable<DestinyPresentationNodeDefinition>;
	Progression: DefinitionTable<DestinyProgressionDefinition>;
	Race: DefinitionTable<DestinyRaceDefinition>;
	Record: DefinitionTable<DestinyRecordDefinition>;
	SandboxPerk: DefinitionTable<DestinySandboxPerkDefinition>;
	Season: DefinitionTable<DestinySeasonDefinition>;
	SeasonPass: DefinitionTable<DestinySeasonPassDefinition>;
	SocketCategory: DefinitionTable<DestinySocketCategoryDefinition>;
	SocketType: DefinitionTable<DestinySocketTypeDefinition>;
	Stat: DefinitionTable<DestinyStatDefinition>;
	StatGroup: DefinitionTable<DestinyStatGroupDefinition>;
	Trait: DefinitionTable<DestinyTraitDefinition>;
	Vendor: DefinitionTable<DestinyVendorDefinition>;
	VendorGroup: DefinitionTable<DestinyVendorGroupDefinition>;
	LoadoutConstants: DefinitionTable<DestinyLoadoutConstantsDefinition>;
}

export class HashLookupFailure extends Error {
	table: string;
	id: number;

	constructor(table: string, id: number) {
		super(`hashLookupFailure: ${table}[${id}]`);
		this.table = table;
		this.id = id;
		this.name = 'HashLookupFailure';
	}
}

/**
 * Manifest database definitions. This returns a promise for an
 * object that has a property named after each of the tables listed
 * above (defs.TalentGrid, etc.).
 */
export async function getDefinitions(): Promise<D2ManifestDefinitions> {
	const manifest = await doGetManifest(allTables);
	const defs = buildDefinitionsFromManifest(manifest);
	return defs;
}

export function buildDefinitionsFromManifest(db: AllDestinyManifestComponents) {
	const defs: Partial<D2ManifestDefinitions> = {};
	allTables.forEach((tableShort) => {
		const table =
			`Destiny${tableShort}Definition` as keyof AllDestinyManifestComponents;
		defs[tableShort] = {
			get(id: number, requestor?: { hash: number } | string | number) {
				const dbTable = db[table];
				if (!dbTable) {
					throw new Error(`Table ${table} does not exist in the manifest`);
				}
				const dbEntry = dbTable[id];
				if (!dbEntry && tableShort !== 'Record') {
					// there are valid negative hashes that we have added ourselves via enhanceDBWithFakeEntries,
					// but other than that they should be whole & reasonable sized numbers
					if (id < 1 || !Number.isSafeInteger(id)) {
						const requestingEntryInfo =
							typeof requestor === 'object' ? requestor.hash : requestor;
						// warnLogCollapsedStack(
						// 	'invalidHash',
						// 	new HashLookupFailure(table, id),
						// 	{
						// 		requestingEntryInfo,
						// 		failedHash: id,
						// 		failedComponent: table,
						// 	}
						// );
					} else {
						warnLogCollapsedStack(
							'hashLookupFailure',
							`${table}[${id}]`,
							requestor
						);
					}
				}
				return dbEntry;
			},
			getAll() {
				return db[table];
			},
		};
	});

	return defs as D2ManifestDefinitions;
}
