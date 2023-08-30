import Head from '@dlb/components/Meta/Head';
import { selectLoadError } from '@dlb/redux/features/loadError/loadErrorSlice';
import { useAppSelector } from '@dlb/redux/hooks';
import { Box, Button, styled } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const sendErrorEmail = async (error: string): Promise<void> => {
	await axios
		.post(`/api/send-error-email`, { error })
		.then((response) => {
			console.log('response', response);
		})
		.catch(function (error) {
			if (error.response) {
				console.error(error.response.data);
			}
		});
};

const Container = styled(Box)(({ theme }) => ({
	position: 'fixed',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	maxWidth: '100vw',
	padding: theme.spacing(1),
	['a']: {
		color: 'lightblue',
		textDecoration: 'underline',
	},
}));

const Title = styled(Box)(({ theme }) => ({
	fontSize: 24,
	fontWeight: 'bold',
	marginBottom: theme.spacing(1),
}));

const Subtitle = styled(Box)(({ theme }) => ({
	fontSize: 18,
	marginBottom: theme.spacing(1),
}));

const Content = styled(Box)(({ theme }) => ({}));

const ErrorWrapper = styled(Box)(({ theme }) => ({
	whiteSpace: 'pre-line',
	maxHeight: '80vh',
	overflow: 'auto',
}));

function Error() {
	const router = useRouter();
	const loadError = useAppSelector(selectLoadError);
	useEffect(() => {
		(async () => {
			if (loadError) {
				await sendErrorEmail(loadError);
			}
		})();

		return () => {
			// this now gets called when the component unmounts
		};
	}, [loadError]);
	const [showError, setShowError] = useState(false);

	const handleReset = () => {
		localStorage.clear();
		router.push('/login');
	};

	return (
		<>
			<Head />
			<Container>
				<Title>
					A fatal error occured while loading your Destiny inventory
				</Title>
				<Subtitle>
					Click the RESET button to hard refresh the application
				</Subtitle>
				<Content>
					<Button
						sx={{ margin: '8px' }}
						variant="contained"
						onClick={() => handleReset()}
					>
						Reset
					</Button>
					{!showError && (
						<Button
							sx={{ margin: '8px' }}
							variant="text"
							onClick={() => setShowError(true)}
						>
							Show Error
						</Button>
					)}
					{showError && <ErrorWrapper>{loadError}</ErrorWrapper>}
				</Content>
			</Container>
		</>
	);
}

export default Error;
