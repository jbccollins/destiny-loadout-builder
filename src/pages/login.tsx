import Link from 'next/link';
import { oauthClientId } from '@dlb/dim/bungie-api/bungie-api-utils';
import { Button, styled, Box } from '@mui/material';

const Container = styled(Box)(({ theme }) => ({
	position: 'fixed',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)'
}));

function Login() {
	console.log('>>>>>>>>>> oauthClientId <<<<<<<<<<<<', oauthClientId());
	const queryParams = new URLSearchParams({
		client_id: oauthClientId(),
		response_type: 'code'
	});

	return (
		<Container>
			<Link href={`https://www.bungie.net/en/OAuth/Authorize?${queryParams}`}>
				<Button variant="contained" color="secondary">
					Authorize With BNet
				</Button>
			</Link>
		</Container>
	);
}

export default Login;
