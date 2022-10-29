import Dexie from 'dexie';
import { IManifestArmor } from '@dlb/types/IManifestArmor';
import { IInventoryArmor } from '@dlb/types//IInventoryArmor';

function buildDb(onUpgrade: () => Promise<void>) {
	const db = new Dexie('destiny-loadout-builder');

	// Declare tables, IDs and indexes
	db.version(16)
		.stores({
			manifestArmor: 'id++, hash, isExotic',
			inventoryArmor:
				'id++, itemInstanceId, isExotic, hash, name, masterworked, clazz'
		})
		.upgrade(async () => {
			await onUpgrade();
		});

	return db;
}

export class DatabaseService {
	private db: Dexie;

	public manifestArmor: Dexie.Table<IManifestArmor, number>;
	public inventoryArmor: Dexie.Table<IInventoryArmor, number>;

	constructor(/* private auth: AuthService */) {
		this.db = buildDb(async () => {
			//await this.auth.clearManifestInfo();
		});
		this.manifestArmor = this.db.table('manifestArmor');
		this.inventoryArmor = this.db.table('inventoryArmor');

		// this.auth.logoutEvent.subscribe(async (k) => {
		// 	await this.clearDatabase();
		// });
	}

	private initialize() {
		this.db = buildDb(async () => {
			// await this.auth.clearManifestInfo();
		});
		this.manifestArmor = this.db.table('manifestArmor');
		this.inventoryArmor = this.db.table('inventoryArmor');
	}

	private async clearDatabase() {
		localStorage.removeItem('LastManifestUpdate');
		localStorage.removeItem('LastArmorUpdate');
		await this.inventoryArmor.clear();
	}

	async resetDatabase(initialize = true) {
		localStorage.removeItem('LastManifestUpdate');
		localStorage.removeItem('last-manifest-revision');
		localStorage.removeItem('last-manifest-db-name');

		localStorage.removeItem('LastArmorUpdate');
		localStorage.removeItem('last-armor-db-name');

		await this.db.delete();
		if (initialize) this.initialize();
	}
}
