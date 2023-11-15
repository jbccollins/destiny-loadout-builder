'use client';

import { oauthClientId } from '@dlb/dim/bungie-api/bungie-api-utils';
import { Button } from '@mui/material';
import Link from 'next/link';

function LoginButton() {
	const queryParams = new URLSearchParams({
		client_id: oauthClientId(),
		response_type: 'code',
	});

	return (
		<Link href={`https://www.bungie.net/en/OAuth/Authorize?${queryParams}`}>
			<Button variant="contained" color="secondary">
				Authorize With Bungie.net
			</Button>
		</Link>
	);
}

export default LoginButton;
