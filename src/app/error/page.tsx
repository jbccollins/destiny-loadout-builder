'use client';

import Head from '@dlb/components/Meta/Head';
import SocialIcon from '@dlb/components/SocialIcon';
import { DISCORD_LINK } from '@dlb/dim/utils/constants';
import { selectLoadError } from '@dlb/redux/features/loadError/loadErrorSlice';
import { useAppSelector } from '@dlb/redux/hooks';
import { Box, Button, styled } from '@mui/material';
import discord_image from '@public/discord-mark-white.png';
import axios from 'axios';
import { useRouter } from 'next/navigation';
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

const Content = styled(Box)(() => ({}));

const ErrorWrapper = styled(Box)(() => ({
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
				await sendErrorEmail(JSON.stringify(loadError, null, 2));
			}
		})();

		return () => {
			// this now gets called when the component unmounts
		};
	}, [loadError]);
	const [showError, setShowError] = useState(false);

	const handleReset = () => {
		const hiddenLoadoutIdListString = localStorage.getItem(
			'hiddenLoadoutIdList'
		);
		localStorage.clear();
		// This is separately caught and cleared in Loading.tsx
		// We want this to persist through errors if possible
		if (hiddenLoadoutIdListString) {
			localStorage.setItem('hiddenLoadoutIdList', hiddenLoadoutIdListString);
		}
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
				<Box
					sx={{
						marginY: '16px',
						background: '#2b2b2b',
						padding: '8px',
						borderRadius: '8px',
					}}
				>
					<Box sx={{ marginBottom: '8px' }}>
						Still having trouble? Reach out to me on Discord:{' '}
					</Box>
					<SocialIcon
						linkUrl={DISCORD_LINK}
						iconUrl={discord_image}
						text="Discord"
					/>
				</Box>
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
					{showError && (
						<ErrorWrapper>
							{loadError && loadError.err && (
								<>
									<Box>Error:</Box> {loadError.err}
								</>
							)}
							{loadError && loadError.err && (
								<>
									<Box>Logs:</Box>
									<pre>{JSON.stringify(loadError.logs, null, 2)}</pre>
								</>
							)}
						</ErrorWrapper>
					)}
				</Content>
			</Container>
		</>
	);
}

export default Error;
