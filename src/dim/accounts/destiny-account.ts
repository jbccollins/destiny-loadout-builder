import { DestinyVersion } from '@destinyitemmanager/dim-api-types';
// import { ThunkResult } from "app/store/types";
// import { DimError } from "app/utils/dim-error";
import {
	BungieMembershipType,
	DestinyGameVersions,
	DestinyLinkedProfilesResponse,
	DestinyProfileUserInfoCard,
} from 'bungie-api-ts-no-const-enum/destiny2';
import { UserInfoCard } from 'bungie-api-ts-no-const-enum/user';
import _ from 'lodash';
//import { reportException } from "@dlb/dim/utils/exceptions";
// import { loggedOut } from "./actions";

// See https://github.com/Bungie-net/api/wiki/FAQ:-Cross-Save-pre-launch-testing,-and-how-it-may-affect-you for more info

/**
 * Platform types (membership types) in the Bungie API.
 */
const PLATFORM_LABELS = {
	[BungieMembershipType.TigerXbox]: 'Xbox',
	[BungieMembershipType.TigerPsn]: 'PlayStation',
	[BungieMembershipType.TigerBlizzard]: 'Blizzard',
	[BungieMembershipType.TigerDemon]: 'Demon',
	[BungieMembershipType.TigerSteam]: 'Steam',
	[BungieMembershipType.TigerStadia]: 'Stadia',
	[BungieMembershipType.TigerEgs]: 'Epic',
	[BungieMembershipType.BungieNext]: 'Bungie.net',
};

/** A specific Destiny account (one per platform and Destiny version) */
export interface DestinyAccount {
	/** Platform account name (gamertag or PSN ID) */
	readonly displayName: string;
	/** The platform type this account started on. It may not be exclusive to this platform anymore, but this is what gets used to call APIs. */
	readonly originalPlatformType: BungieMembershipType;
	/** readable platform name */
	readonly platformLabel: string;
	/** Destiny platform membership ID. */
	readonly membershipId: string;
	/** Which version of Destiny is this account for? */
	readonly destinyVersion: DestinyVersion;
	/** Which version of Destiny 2 / DLC do they own? (not reliable after Cross-Save) */
	readonly versionsOwned?: DestinyGameVersions;
	/** All the platforms this account plays on (post-Cross-Save) */
	readonly platforms: BungieMembershipType[];

	/** When was this account last used? */
	readonly lastPlayed?: Date;
}

/**
 * Get all Destiny accounts associated with a Bungie account.
 *
 * Each Bungie.net account may be linked with one Destiny 1 account
 * per platform (Xbox, PS4) and one Destiny 2 account per platform (Xbox, PS4, PC).
 * This account is indexed by a Destiny membership ID and is how we access their characters.
 *
 * We don't know whether or not the account is associated with D1 or D2 characters until we
 * try to load them.
 *
 * @param bungieMembershipId Bungie.net membership ID
 */
// export function getDestinyAccountsForBungieAccount(
// 	bungieMembershipId: string
// ): ThunkResult<DestinyAccount[]> {
// 	return async (dispatch) => {
// 		try {
// 			const linkedAccounts = await getLinkedAccounts(bungieMembershipId);
// 			const platforms = await generatePlatforms(linkedAccounts);
// 			if (platforms.length === 0) {
// 				// showNotification({
// 				//   type: "warning",
// 				//   title: t("Accounts.NoCharacters"),
// 				// });
// 				console.warn("Accounts.NoCharacters");
// 				removeToken();
// 				// dispatch(loggedOut());
// 			}
// 			return platforms;
// 		} catch (e) {
// 			console.error("getDestinyAccountsForBungieAccount", e);
// 			// reportException("getDestinyAccountsForBungieAccount", e);
// 			throw e;
// 		}
// 	};
// }

function formatBungieName(
	destinyAccount: DestinyProfileUserInfoCard | UserInfoCard
) {
	return (
		destinyAccount.bungieGlobalDisplayName +
		(destinyAccount.bungieGlobalDisplayNameCode
			? `#${destinyAccount.bungieGlobalDisplayNameCode
					.toString()
					.padStart(4, '0')}`
			: '')
	);
}

/**
 * @param accounts raw Bungie API accounts response
 */
async function generatePlatforms(
	accounts: DestinyLinkedProfilesResponse
): Promise<DestinyAccount[]> {
	const accountPromises = accounts.profiles.flatMap((destinyAccount) => {
		const account: DestinyAccount = {
			displayName: formatBungieName(destinyAccount),
			originalPlatformType: destinyAccount.membershipType,
			membershipId: destinyAccount.membershipId,
			platformLabel: PLATFORM_LABELS[destinyAccount.membershipType],
			destinyVersion: 2,
			platforms: destinyAccount.applicableMembershipTypes,
			lastPlayed: new Date(destinyAccount.dateLastPlayed),
		};

		return [account];
	});

	const allPromise = Promise.all(accountPromises);
	return _.compact(await allPromise);
}

/**
 * Find the date of the most recently played character.
 */
function getLastPlayedD1Character(
	response: { id: string; dateLastPlayed: string }[]
): Date {
	return response.reduce((memo, rawStore) => {
		if (rawStore.id === 'vault') {
			return memo;
		}

		const d1 = new Date(rawStore.dateLastPlayed);

		return memo ? (d1 >= memo ? d1 : memo) : d1;
	}, new Date(0));
}

/**
 * @return whether the accounts represent the same account
 */
export function compareAccounts(
	account1: DestinyAccount,
	account2: DestinyAccount
): boolean {
	return (
		account1 === account2 ||
		(account1 &&
			account2 &&
			account1.membershipId === account2.membershipId &&
			account1.destinyVersion === account2.destinyVersion)
	);
}
