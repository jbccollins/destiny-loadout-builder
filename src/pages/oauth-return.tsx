import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getAccessTokenFromCode } from '@dlb/dim/bungie-api/oauth';
import { Box, CircularProgress, styled } from '@mui/material';
import axios from 'axios';

const Container = styled(Box)(({ theme }) => ({
	position: 'fixed',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)'
}));
const Text = styled(Box)(({ theme }) => ({
	marginBottom: theme.spacing(4)
}));

const CircularProgressWrapper = styled(Box)(({ theme }) => ({
	margin: 'auto',
	width: '50%'
}));

function OauthReturn() {
	const router = useRouter();
	const { code } = router.query;

	useEffect(() => {
		(async () => {
			try {
				if (code) {
					await getAccessTokenFromCode(code as string);
					router.push('/');
				} else {
					// TODO: Better error handling
					// alert('No code found in url params');
					console.warn('No code found in url params, retrying...');
				}
			} catch (e) {
				// TODO redirect only on the right kind of error
				// Test by deleting 'authorization' from localStorage
				// router.push('/login');
				// console.error(e);
			}
		})();

		return () => {
			// this now gets called when the component unmounts
		};
	}, [code, router, router.query]);

	return (
		<Container>
			<Text>Authenticating...</Text>
			<CircularProgressWrapper>
				<CircularProgress />
			</CircularProgressWrapper>
		</Container>
	);
}

export default OauthReturn;
