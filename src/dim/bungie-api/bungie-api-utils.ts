import { HttpClientConfig } from 'bungie-api-ts-no-const-enum/http';

// TODO: Put this behind a SECRET environment variable
export const API_KEY = process.env.NEXT_PUBLIC_BNET_API_KEY;

export function bungieApiUpdate(
	path: string,
	data?: Record<string, unknown>
): HttpClientConfig {
	return {
		method: 'POST',
		url: `https://www.bungie.net${path}`,
		body: data
	};
}

export function bungieApiQuery(
	path: string,
	params?: Record<string, unknown>
): HttpClientConfig {
	return {
		method: 'GET',
		url: `https://www.bungie.net${path}`,
		params
	};
}

// TODO: Put this behind a SECRET environment variable
export function oauthClientId(): string {
	return process.env.NEXT_PUBLIC_BNET_OAUTH_CLIENT_ID as string;
}

// TODO: Put this behind a SECRET environment variable
export function oauthClientSecret(): string {
	return process.env.NEXT_PUBLIC_BNET_OAUTH_CLIENT_SECRET as string;
}
