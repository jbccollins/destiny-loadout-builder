// Next.js Route Handlers Docs: https://nextjs.org/docs/app/building-your-application/routing/route-handlers

import {
	oauthClientId,
	oauthClientSecret,
} from '@dlb/dim/bungie-api/bungie-api-utils';
import axios from 'axios';

type ReqData = {
	code: string;
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

const TOKEN_URL = 'https://www.bungie.net/platform/app/oauth/token/';

export async function GET(request: Request): Promise<Response> {
	const { searchParams } = new URL(request.url);
	const code = searchParams.get('code') as ReqData['code'];

	if (!code) {
		return new Response(
			JSON.stringify({ error: 'Missing required parameter: code' }),
			{
				status: 400,
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
	}

	const body = new URLSearchParams({
		grant_type: 'authorization_code',
		code,
		client_id: oauthClientId(),
		client_secret: oauthClientSecret(),
	});

	try {
		const response = await axios.post(TOKEN_URL, body, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		});

		return new Response(JSON.stringify(response.data), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	} catch (error: any) {
		console.error(error?.response?.data || error);
		return new Response(
			JSON.stringify({ error: 'Failed to retrieve OAuth token' }),
			{
				status: error?.response?.status || 500,
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
	}
}
