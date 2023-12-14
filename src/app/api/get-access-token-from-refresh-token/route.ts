// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
	oauthClientId,
	oauthClientSecret,
} from '@dlb/dim/bungie-api/bungie-api-utils';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

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

// TODO: Pull this out into a common constant
const TOKEN_URL = 'https://www.bungie.net/platform/app/oauth/token/';

export async function GET(req: NextRequest) {
	const url = new URL(req.url);
	const refreshTokenValue = url.searchParams.get('refreshTokenValue');
	const body = new URLSearchParams({
		grant_type: 'refresh_token',
		refresh_token: refreshTokenValue,
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
				// console.error(error.response.status);
				// console.error(error.response.headers);
			}
		});

	console.log(JSON.stringify(response));

	return NextResponse.json(response);
}
