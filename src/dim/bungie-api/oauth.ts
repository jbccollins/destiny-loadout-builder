import { infoLog } from '@dlb/dim/utils/log';
import { dedupePromise } from '@dlb/dim/utils/util';
import axios from 'axios';
import { setToken, Token, Tokens } from './oauth-tokens';

// all these api url params don't match our variable naming conventions

export const getAccessTokenFromRefreshToken = async (
	refreshToken: Token
): Promise<void> => {
	await axios
		.get(
			`/api/get-access-token-from-refresh-token?refreshTokenValue=${refreshToken.value}`
		)
		.then((response) => {
			return handleAccessToken(response.data);
		})
		.catch(function (error) {
			if (error.response) {
				console.error(error.response.data);
			}
		});
};

export const getAccessTokenFromCode = async (code: string): Promise<void> => {
	await axios
		.get(`/api/get-access-token-from-code?code=${code}`)
		.then((response) => {
			return handleAccessToken(response.data);
		})
		.catch(function (error) {
			if (error.response) {
				console.error(error.response.data);
			}
		});
};

function handleAccessToken(
	response:
		| {
				access_token: string;
				expires_in: number;
				membership_id: string;
				refresh_token?: string;
				refresh_expires_in: number;
		  }
		| undefined
): Tokens {
	if (response?.access_token) {
		const data = response;
		const inception = Date.now();
		const accessToken: Token = {
			value: data.access_token,
			expires: data.expires_in,
			name: 'access',
			inception,
		};

		const tokens: Tokens = {
			accessToken,
			bungieMembershipId: data.membership_id,
		};

		if (data.refresh_token) {
			tokens.refreshToken = {
				value: data.refresh_token,
				expires: data.refresh_expires_in,
				name: 'refresh',
				inception,
			};
		}

		// TODO: Figure out the right place to set tokens and how to redirect to login
		setToken(tokens);
		return tokens;
	} else {
		throw new Error(
			'No data or access token in response: ' + JSON.stringify(response)
		);
	}
}
