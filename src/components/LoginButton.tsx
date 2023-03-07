import Link from 'next/link';
import { oauthClientId } from '@dlb/dim/bungie-api/bungie-api-utils';
import { Button } from '@mui/material';

function Login() {
	const queryParams = new URLSearchParams({
		client_id: oauthClientId(),
		response_type: 'code',
	});

	return (
		<Link href={`https://www.bungie.net/en/OAuth/Authorize?${queryParams}`}>
			<Button variant="contained" color="secondary">
				Authorize With BNet
			</Button>
		</Link>
	);
}

export default Login;
