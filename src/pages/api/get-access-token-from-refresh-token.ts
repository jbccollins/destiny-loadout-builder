// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
	oauthClientId,
	oauthClientSecret
} from '@dlb/dim/bungie-api/bungie-api-utils';
import { getMembershipData } from '@dlb/dim/bungie-api/destiny2-api';
import { Token } from '@dlb/dim/bungie-api/oauth-tokens';
import axios from 'axios';
import { UserInfoCard } from 'bungie-api-ts-no-const-enum/user';
import type { NextApiRequest, NextApiResponse } from 'next';

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

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<OauthTokenData>
) {
	const { refreshTokenValue } = req.query as ReqData;
	const body = new URLSearchParams({
		grant_type: 'refresh_token',
		refresh_token: refreshTokenValue,
		client_id: oauthClientId(),
		client_secret: oauthClientSecret()
	});

	const response = await axios
		.post(TOKEN_URL, body, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		})
		.then((res) => res.data)
		.catch(function (error) {
			if (error.response) {
				console.log('>>>>>>>>>>>>>>>>>>>>>> ERROR FETCHING OAUTH TOKEN');
				console.error(error.response.data);
				// console.error(error.response.status);
				// console.error(error.response.headers);
			}
		});

	console.log(JSON.stringify(response));

	res.status(200).json(response);
}
