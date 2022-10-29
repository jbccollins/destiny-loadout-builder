import {
	// BungieMembershipType,
	DestinyCharacterResponse,
	DestinyComponentType,
	DestinyItemResponse,
	DestinyLinkedProfilesResponse,
	DestinyManifest,
	DestinyProfileResponse,
	DestinyVendorResponse,
	DestinyVendorsResponse,
	getCharacter as getCharacterApi,
	getDestinyManifest,
	getItem,
	getLinkedProfiles,
	getProfile as getProfileApi,
	getVendor as getVendorApi,
	getVendors as getVendorsApi,
	BungieMembershipType,
	DestinyProfileUserInfoCard,
	PlatformErrorCodes
} from 'bungie-api-ts-no-const-enum/destiny2';
import { DestinyAccount } from '@dlb/dim/accounts/destiny-account';
import {
	authenticatedHttpClient,
	unauthenticatedHttpClient
} from './bungie-service-helper';
import {
	getMembershipDataForCurrentUser,
	UserInfoCard
} from 'bungie-api-ts-no-const-enum/user';
import _ from 'lodash';

/**
 * APIs for interacting with Destiny 2 game data.
 *
 * Destiny2 Service at https://destinydevs.github.io/BungieNetPlatform/docs/Endpoints
 */

// -----------------
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
	[BungieMembershipType.BungieNext]: 'Bungie.net'
};

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
	// accounts with errors could have had D1 characters!

	const accountPromises = accounts.profiles
		.flatMap((destinyAccount) => {
			const account: DestinyAccount = {
				displayName: formatBungieName(destinyAccount),
				originalPlatformType: destinyAccount.membershipType,
				membershipId: destinyAccount.membershipId,
				platformLabel: PLATFORM_LABELS[destinyAccount.membershipType],
				destinyVersion: 2,
				platforms: destinyAccount.applicableMembershipTypes,
				lastPlayed: new Date(destinyAccount.dateLastPlayed)
			};

			return [account];
		})
		.concat(
			// Profiles with errors could be D1 accounts
			// Consider both D1 and D2 accounts with errors, save profile errors and show on page
			// unless it's a specific error like DestinyAccountNotFound
			accounts.profilesWithErrors.flatMap((errorProfile) => {
				const destinyAccount = errorProfile.infoCard;
				const account: DestinyAccount = {
					displayName: formatBungieName(destinyAccount),
					originalPlatformType: destinyAccount.membershipType,
					membershipId: destinyAccount.membershipId,
					platformLabel: PLATFORM_LABELS[destinyAccount.membershipType],
					destinyVersion: 1,
					platforms: [destinyAccount.membershipType],
					lastPlayed: new Date()
				};

				return [account];
			})
		);

	const allPromise = Promise.all(accountPromises);
	return _.compact(await allPromise);
}

export async function getDestinyAccountsForBungieAccount(
	bungieMembershipId: string
): Promise<DestinyAccount[]> {
	try {
		const linkedAccounts = await getLinkedAccounts(bungieMembershipId);
		const platforms = await generatePlatforms(linkedAccounts);
		if (platforms.length === 0) {
			// showNotification({
			// 	type: 'warning',
			// 	title: t('Accounts.NoCharacters')
			// });
			// removeToken();
			// dispatch(loggedOut());
		}
		return platforms;
	} catch (e) {
		//reportException('getDestinyAccountsForBungieAccount', e);
		throw e;
	}
}

export async function getMembershipData() {
	console.info('BungieApiService', 'getMembershipDataForCurrentUser');
	const response = await getMembershipDataForCurrentUser(
		authenticatedHttpClient
	);
	const res = response?.Response.destinyMemberships;
	console.info('Memberships:', res);
	const memberships = res.filter(
		(m) => m.crossSaveOverride == 0 || m.crossSaveOverride == m.membershipType
	);
	console.info('Filtered Memberships:', memberships);

	let result: UserInfoCard = null;
	if (memberships?.length == 1) {
		// This guardian only has one account linked, so we can proceed as normal
		result = memberships?.[0];
	} else {
		// This guardian has multiple accounts linked.
		// Fetch the last login time for each account, and use the one that was most recently used.
		let lastLoggedInProfileIndex: any = 0;
		let lastPlayed = 0;
		for (const id in memberships) {
			const membership = memberships?.[id];
			const profile = await getProfileApi(authenticatedHttpClient, {
				components: [DestinyComponentType.Profiles],
				membershipType: membership.membershipType,
				destinyMembershipId: membership.membershipId
			});
			if (!!profile && profile.Response?.profile.data?.dateLastPlayed) {
				const date = Date.parse(profile.Response?.profile.data?.dateLastPlayed);
				if (date > lastPlayed) {
					lastPlayed = date;
					lastLoggedInProfileIndex = id;
				}
			}
		}
		console.info(
			'getMembershipDataForCurrentUser',
			'Selected membership data for the last logged in membership.'
		);
		result = memberships?.[lastLoggedInProfileIndex];
	}

	// If you write abusive chat messages, i do not allow you to use my tool.
	if (
		result.membershipType == BungieMembershipType.TigerSteam &&
		result.membershipId == '4611686018482586660'
	) {
		alert(
			"Yeah, no. You write abusive chat messages, and thus you won't be able to use this tool. Have a good day!"
		);
		return null; // automatically log out
	}
	console.log('>>>>>>>>>>>>>>>> RESULT', result.membershipId);
	return result;
}

// -----------------

/**
 * Get the information about the current manifest.
 */
export async function getManifest(): Promise<DestinyManifest> {
	const response = await getDestinyManifest(unauthenticatedHttpClient);
	return response.Response;
}

export async function getLinkedAccounts(
	bungieMembershipId: string
): Promise<DestinyLinkedProfilesResponse> {
	const response = await getLinkedProfiles(authenticatedHttpClient, {
		membershipId: bungieMembershipId,
		membershipType: BungieMembershipType.BungieNext,
		getAllMemberships: true
	});
	return response.Response;
}

/**
 * Get the user's stores on this platform. This includes characters, vault, and item information.
 */
export function getStores(
	platform: DestinyAccount
): Promise<DestinyProfileResponse> {
	return getProfile(
		platform,
		DestinyComponentType.Profiles,
		DestinyComponentType.ProfileInventories,
		DestinyComponentType.ProfileCurrencies,
		DestinyComponentType.Characters,
		DestinyComponentType.CharacterInventories,
		DestinyComponentType.CharacterProgressions,
		DestinyComponentType.CharacterEquipment,
		// TODO: consider loading less item data, and then loading item details on click? Makes searches hard though.
		DestinyComponentType.ItemInstances,
		DestinyComponentType.ItemObjectives,
		DestinyComponentType.ItemSockets,
		DestinyComponentType.ItemCommonData,
		DestinyComponentType.Collectibles,
		DestinyComponentType.ItemPlugStates,
		DestinyComponentType.ItemReusablePlugs,
		// TODO: We should try to defer this until the popup is open!
		DestinyComponentType.ItemPlugObjectives,
		// TODO: we should defer this unless you're on the collections screen
		DestinyComponentType.Records,
		DestinyComponentType.Metrics,
		DestinyComponentType.StringVariables,
		DestinyComponentType.ProfileProgression,
		DestinyComponentType.Craftables,
		DestinyComponentType.Transitory,
		// TODO: This is only needed for event progress
		DestinyComponentType.PresentationNodes
	);
}

/**
 * Get just character info for all a user's characters on the given platform. No inventory, just enough to refresh stats.
 */
export function getCharacters(
	platform: DestinyAccount
): Promise<DestinyProfileResponse> {
	return getProfile(platform, DestinyComponentType.Characters);
}

/**
 * Get character info for on the given platform. No inventory, just enough to refresh activity.
 */
export function getCurrentActivity(
	platform: DestinyAccount,
	characterId: string
): Promise<DestinyCharacterResponse> {
	return getCharacter(
		platform,
		characterId,
		DestinyComponentType.CharacterActivities
	);
}

async function getCharacter(
	platform: DestinyAccount,
	characterId: string,
	...components: DestinyComponentType[]
): Promise<DestinyCharacterResponse> {
	const response = await getCharacterApi(authenticatedHttpClient, {
		destinyMembershipId: platform.membershipId,
		characterId,
		membershipType: platform.originalPlatformType,
		components
	});

	return response.Response;
}

/**
 * Get parameterized profile information for the whole account. Pass in components to select what
 * you want. This can handle just characters, full inventory, vendors, kiosks, activities, etc.
 */
async function getProfile(
	platform: DestinyAccount,
	...components: DestinyComponentType[]
): Promise<DestinyProfileResponse> {
	const response = await getProfileApi(authenticatedHttpClient, {
		destinyMembershipId: platform.membershipId,
		membershipType: platform.originalPlatformType,
		components
	});
	// TODO: what does it actually look like to not have an account?
	if (Object.keys(response.Response).length === 0) {
		throw new Error('BungieService.NoAccountForPlatform');
	}
	return response.Response;
}

/**
 * Get extra information about a single instanced item. This should be called from the
 * item popup only.
 */
export async function getItemPopupDetails(
	itemInstanceId: string,
	account: DestinyAccount
): Promise<DestinyItemResponse> {
	const response = await getItem(authenticatedHttpClient, {
		destinyMembershipId: account.membershipId,
		membershipType: account.originalPlatformType,
		itemInstanceId,
		components: [
			// Get plug objectives (kill trackers and catalysts)
			DestinyComponentType.ItemPlugObjectives
		]
	});
	return response.Response;
}

/**
 * Get all information about a single instanced item.
 */
export async function getSingleItem(
	itemInstanceId: string,
	account: DestinyAccount
): Promise<DestinyItemResponse> {
	const response = await getItem(authenticatedHttpClient, {
		destinyMembershipId: account.membershipId,
		membershipType: account.originalPlatformType,
		itemInstanceId,
		components: [
			DestinyComponentType.ItemInstances,
			DestinyComponentType.ItemObjectives,
			DestinyComponentType.ItemSockets,
			DestinyComponentType.ItemCommonData,
			DestinyComponentType.ItemPlugStates,
			DestinyComponentType.ItemReusablePlugs,
			DestinyComponentType.ItemPlugObjectives
		]
	});
	return response.Response;
}

export async function getVendor(
	account: DestinyAccount,
	characterId: string,
	vendorHash: number
): Promise<DestinyVendorResponse> {
	const response = await getVendorApi(authenticatedHttpClient, {
		characterId,
		destinyMembershipId: account.membershipId,
		membershipType: account.originalPlatformType,
		components: [
			DestinyComponentType.Vendors,
			DestinyComponentType.VendorSales,
			DestinyComponentType.ItemInstances,
			DestinyComponentType.ItemObjectives,
			DestinyComponentType.ItemSockets,
			DestinyComponentType.ItemCommonData,
			DestinyComponentType.CurrencyLookups,
			DestinyComponentType.ItemPlugStates,
			DestinyComponentType.ItemReusablePlugs,
			// TODO: We should try to defer this until the popup is open!
			DestinyComponentType.ItemPlugObjectives
		],
		vendorHash
	});
	return response.Response;
}

export async function getVendors(
	account: DestinyAccount,
	characterId: string
): Promise<DestinyVendorsResponse> {
	const response = await getVendorsApi(authenticatedHttpClient, {
		characterId,
		destinyMembershipId: account.membershipId,
		membershipType: account.originalPlatformType,
		components: [
			DestinyComponentType.Vendors,
			DestinyComponentType.VendorSales,
			DestinyComponentType.ItemInstances,
			DestinyComponentType.ItemObjectives,
			DestinyComponentType.ItemSockets,
			DestinyComponentType.ItemCommonData,
			DestinyComponentType.CurrencyLookups,
			DestinyComponentType.ItemPlugStates,
			DestinyComponentType.ItemReusablePlugs,
			// TODO: We should try to defer this until the popup is open!
			DestinyComponentType.ItemPlugObjectives
		]
	});
	return response.Response;
}
