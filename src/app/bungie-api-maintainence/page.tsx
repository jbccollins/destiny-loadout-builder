"use client";

import discord_image from '@/public/discord-mark-white.png';
import Head from '@dlb/components/Meta/Head';
import SocialIcon from '@dlb/components/SocialIcon';
import { DISCORD_LINK } from '@dlb/dim/utils/constants';
import { Box, Button, Link, styled } from '@mui/material';
import { useRouter } from 'next/navigation';

const Container = styled(Box)(({ theme }) => ({
	// position: 'fixed',
	// top: '50%',
	// left: '50%',
	// transform: 'translate(-50%, -50%)',
	margin: 'auto',
	width: '100vw',
	height: '100vh',
	overflowY: 'auto',
	justifyItems: 'center',
	maxWidth: '1400px',
	// width: 'calc(100vw - 40px)',
	display: 'grid',
	gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))',
	padding: theme.spacing(5),
	'@media only screen and (max-width: 680px)': {
		gridTemplateColumns: 'repeat(auto-fit, minmax(100%, 1fr))',
		padding: theme.spacing(1),
	},
	gridGap: '1rem',
	rowGap: '1rem',

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

function BungieApiDown() {
	const router = useRouter();

	const login = () => {
		router.push('/login');
	};

	return (
		<>
			<Head />
			<Container>
				<Box sx={{ maxWidth: '600px', width: '100%' }}>
					<Title>The Bungie API is down for maintenance</Title>
					<Subtitle>
						This app will not work until the Bungie API is back up. Check{' '}
						<Link target={'_blank'} href="https://twitter.com/BungieHelp">
							@BungieHelp
						</Link>{' '}
						on twitter for status updates.
						<br />
						When the Bungie API is back up, try clicking the login button.
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
					<Button sx={{ margin: '8px' }} variant="contained" onClick={login}>
						Login
					</Button>
				</Box>

				<Box sx={{ maxWidth: '600px', width: '100%' }}>
					<a
						className="twitter-timeline"
						data-height="500"
						data-theme="dark"
						href="https://twitter.com/BungieHelp?ref_src=twsrc%5Etfw"
					>
						Tweets by BungieHelp
					</a>{' '}
					<script
						async
						src="https://platform.twitter.com/widgets.js"
						charSet="utf-8"
					></script>
				</Box>
			</Container>
		</>
	);
}

export default BungieApiDown;
