import Dexie from 'dexie';

export interface IBook {
	id: number;
	name: string;
	author: string;
	categories: string[];
}

export interface ITargetStatModCombinations {
	id: number;
	key: string;
	numArtificeItems: number;
	modCombinations: number[][];
}

export class Database extends Dexie {
	private static instance: Database;

	public static getInstance(): Database {
		if (!Database.instance) {
			Database.instance = new Database();
		}

		return Database.instance;
	}

	// Declare implicit table properties.
	// (just to inform Typescript. Instantiated by Dexie in stores() method)
	books!: Dexie.Table<IBook, number>; // number = type of the primary key
	allModCombinations!: Dexie.Table<ITargetStatModCombinations, number>;
	//...other tables goes here...

	private constructor() {
		super('dlb-database');
		this.version(1).stores({
			books: 'id, author, name, *categories',
			allModCombinations: 'id, key, numArtificeItems, **modCombinations',
			//...other tables goes here...
		});
	}
}
// The same thing as the Database class above, but
