import { styled, Box } from '@mui/material';
import LoginButton from '@dlb/components/LoginButton';

const Container = styled(Box)(({ theme }) => ({
	position: 'fixed',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
}));

function Login() {
	return (
		<Container>
			<LoginButton />
		</Container>
	);
}

export default Login;
