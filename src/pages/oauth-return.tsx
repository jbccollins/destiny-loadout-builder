import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getAccessTokenFromCode } from '@dlb/dim/bungie-api/oauth';
import { Box, CircularProgress, styled } from '@mui/material';

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
		console.log('>>>>> OauthReturn code: ', code);
		if (code) {
			getAccessTokenFromCode(code as string);
			router.push('/');
		} else {
			// TODO: Better error handling
			// alert('No code found in url params');
			console.warn('No code found in url params');
		}
	}, [code, router, router.query]);
	// TODO: Maybe add like a loading spinner here or something
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
