import Head from '@dlb/components/Meta/Head';
import { Box, CircularProgress, styled } from '@mui/material';

const Container = styled(Box)(() => ({
	position: 'fixed',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
}));
const Text = styled(Box)(({ theme }) => ({
	marginBottom: theme.spacing(4),
}));

const CircularProgressWrapper = styled(Box)(() => ({
	margin: 'auto',
	width: '50%',
}));

export default function OauthReturnContent() {
	return (
		<>
			<Head />
			<Container>
				<Text>Authenticating...</Text>
				<CircularProgressWrapper>
					<CircularProgress />
				</CircularProgressWrapper>
			</Container>
		</>
	);
}
