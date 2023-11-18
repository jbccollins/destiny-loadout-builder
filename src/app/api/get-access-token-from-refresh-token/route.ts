// Next.js Route Handlers Docs: https://nextjs.org/docs/app/building-your-application/routing/route-handlers

import {
	oauthClientId,
	oauthClientSecret,
} from '@dlb/dim/bungie-api/bungie-api-utils';
import axios from 'axios';

type ReqData = {
	refreshTokenValue: string;
};

export type OauthTokenData =
	| {
			access_token: string;
			expires_in: number;
			membership_id: string;
			refresh_token?: string;
			refresh_expires_in: number;
	  }
	| undefined;

export async function GET(request: Request): Promise<Response> {
	const { searchParams } = new URL(request.url);
	const refreshTokenValue = searchParams.get(
		'refreshTokenValue'
	) as ReqData['refreshTokenValue'];

	if (!refreshTokenValue) {
		return new Response(
			JSON.stringify({
				error: 'Missing required parameter: refreshTokenValue',
			}),
			{
				status: 400,
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
	}

	const body = new URLSearchParams({
		grant_type: 'refresh_token',
		refresh_token: refreshTokenValue,
		client_id: oauthClientId(),
		client_secret: oauthClientSecret(),
	});

	try {
		const response = await axios.post(
			'https://www.bungie.net/platform/app/oauth/token/',
			body,
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			}
		);

		return new Response(JSON.stringify(response.data), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	} catch (error: any) {
		console.error(error?.response?.data || error);
		return new Response(
			JSON.stringify({ error: 'Failed to refresh OAuth token' }),
			{
				status: error?.response?.status || 500,
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
	}
}
