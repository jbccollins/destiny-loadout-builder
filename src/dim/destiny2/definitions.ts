import { D2ManifestDefinitions } from './d2-definitions';
export interface ManifestDefinitions {
	/** Check if these defs are from D2. Inside an if statement, these defs will be narrowed to type D2ManifestDefinitions. */
	isDestiny2(): this is D2ManifestDefinitions;
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
