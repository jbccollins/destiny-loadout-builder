import Link from 'next/link';
import { oauthClientId } from '../bungie-api/bungie-api-utils';

function Login() {
	const queryParams = new URLSearchParams({
		client_id: oauthClientId(),
		response_type: 'code'
	});

	return (
		<div>
			<div>Login</div>
			<div>
				<Link href={`https://www.bungie.net/en/OAuth/Authorize?${queryParams}`}>
					Authorize With BNet
				</Link>
			</div>
		</div>
	);
}

export default Login;
