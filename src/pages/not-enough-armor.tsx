import Head from '@dlb/components/Meta/Head';
import SocialIcon from '@dlb/components/SocialIcon';
import { DISCORD_LINK } from '@dlb/dim/utils/constants';
import discord_image from '@dlb/public/discord-mark-white.png';
import { Box, styled } from '@mui/material';

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

function NotEnoughArmor() {
	return (
		<>
			<Head />
			<Container>
				<Title>Not enough armor</Title>
				<Subtitle>
					You do not have enough armor for destinyloadoutbuilder.com to make a
					loadout.
				</Subtitle>
				<Content>
					To create a loadout you must have
					<ul>
						<li>At least one character created</li>
						<li>At least one exotic armor piece for that character</li>
						<li>
							At least one legendary armor piece for every armor slot for that
							character. So a legendary helmet, arms, chestpiece, legs and class
							item.
						</li>
					</ul>
					<Box
						sx={{
							marginY: '16px',
							background: '#2b2b2b',
							padding: '8px',
							borderRadius: '8px',
						}}
					>
						<Box sx={{ marginBottom: '8px' }}>
							Are you seeing this page when you meet all the above criteria?
							Reach out to me on Discord:{' '}
						</Box>
						<SocialIcon
							linkUrl={DISCORD_LINK}
							iconUrl={discord_image}
							text="Discord"
						/>
					</Box>
				</Content>
			</Container>
		</>
	);
}

export default NotEnoughArmor;
