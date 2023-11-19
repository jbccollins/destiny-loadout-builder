// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
	oauthClientId,
	oauthClientSecret,
} from '@dlb/dim/bungie-api/bungie-api-utils';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

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

export async function GET(req: NextRequest) {
	const url = new URL(req.url);
	const code = url.searchParams.get('code');
	const body = new URLSearchParams({
		grant_type: 'authorization_code',
		code,
		client_id: oauthClientId(),
		client_secret: oauthClientSecret(),
	});

	const response = await axios
		.post(TOKEN_URL, body, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		})
		.then((res) => res.data)
		.catch(function (error) {
			if (error.response) {
				console.error(error.response.data);
			}
		});

	return NextResponse.json(response);
}

// Probably just need this to effectively do whatever getAccessTokenFromCode is currently doing.
