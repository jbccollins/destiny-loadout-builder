import Link from 'next/link';
import { oauthClientId } from '@dlb/dim/bungie-api/bungie-api-utils';
import { Button, styled, Box } from '@mui/material';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { selectLoadError } from '@dlb/redux/features/loadError/loadErrorSlice';
import { useAppSelector } from '@dlb/redux/hooks';

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
	fontWeight: 'bold',
	marginBottom: theme.spacing(1),
}));

const Content = styled(Box)(({ theme }) => ({}));

const ErrorWrapper = styled(Box)(({ theme }) => ({
	whiteSpace: 'pre-line',
	maxHeight: '80vh',
	overflow: 'auto',
}));

function Error() {
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
	return (
		<Container>
			<Title>A fatal error occured while loading your Destiny inventory</Title>
			<Subtitle>
				<Link href={'/login'}>Click here</Link> to log in again
			</Subtitle>
			<Content>
				{!showError && (
					<Button
						sx={{ margin: '8px' }}
						variant="contained"
						onClick={() => setShowError(true)}
					>
						Show Error
					</Button>
				)}
				{showError && <ErrorWrapper>{loadError}</ErrorWrapper>}
			</Content>
		</Container>
	);
}

export default Error;
