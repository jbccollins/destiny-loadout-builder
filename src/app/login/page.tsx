'use client';
import LoginButton from '@dlb/components/LoginButton';
import Head from '@dlb/components/Meta/Head';
import SocialIcon from '@dlb/components/SocialIcon';
import { DISCORD_LINK } from '@dlb/dim/utils/constants';
import discord_image from '@public/discord-mark-white.png';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Box, Collapse, IconButton, styled } from '@mui/material';
import logo_with_padding from '@public/logo-with-padding.png';
import Image from 'next/image';
import { useState } from 'react';

const Container = styled(Box)(() => ({
	position: 'absolute',
	height: '100vh',
	width: '100vw',
	overflowY: 'auto',
	textAlign: 'center',
}));

function Login() {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Head />
			<Container>
				<Box
					sx={{
						position: 'absolute',
						maxWidth: '300px',
						width: '100%',
						paddingTop: '60px',
						paddingBottom: '20px',
						left: '50%',
						transform: 'translate(-50%, 0%)',
					}}
				>
					<Box
						sx={{
							// transform: 'translate(50%, 0%)',
							margin: 'auto',
							marginBottom: '8px',
							width: 120,
							height: 120,
							borderRadius: '50%',
							background: 'rgb(50,50,50)',
							padding: '10px',
							paddingTop: '14px',
							paddingBottom: '6px',
						}}
					>
						<Image
							src={logo_with_padding}
							alt="me"
							height="100"
							width="100"
							className="objectFit-contain, objectPosition-center"
						/>
					</Box>
					<Box
						sx={{
							fontSize: '24px',
							fontWeight: 'bold',
							marginBottom: '32px',
							marginTop: '32px',
						}}
					>
						Build optimized loadouts for Destiny 2!
					</Box>
					{/* <Box
					sx={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}
				>
					Permission Required
				</Box>
				<Box sx={{ fontSize: '16px', marginBottom: '32px' }}>
					Allow destinyloadoutbuilder.com to view your Destiny inventory and
					vault
				</Box> */}
					<LoginButton />
					<Box
						sx={{ marginTop: '32px', marginX: 'auto', display: 'inline-block' }}
					>
						<SocialIcon
							linkUrl={DISCORD_LINK}
							iconUrl={discord_image}
							text="Discord"
						/>
					</Box>
					<Box
						onClick={() => setOpen(!open)}
						sx={{ cursor: 'pointer', marginTop: '24px' }}
					>
						Learn more
						<IconButton aria-label="expand row" size="small">
							{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
						</IconButton>
					</Box>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box sx={{ textAlign: 'left' }}>
							Bungie requires third party applications (like this one) to ask
							you for permission to view items in your Destiny inventory and
							vault. With your consent, Bungie will give this application
							read-only access to your items. Bungie does not share any of your
							personal information or account credentials with this application.
							Nor does any third party service like XBox, Playstation, or Steam.
						</Box>
					</Collapse>
				</Box>
			</Container>
		</>
	);
}

export default Login;
