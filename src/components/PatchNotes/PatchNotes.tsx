import SocialIcon from '@dlb/components/SocialIcon';
import {
	DISCORD_LINK,
	KOFI_LINK,
	TWITTER_LINK
} from '@dlb/dim/utils/constants';
import discord_image from '@public/discord-mark-white.png';
import kofi_image from '@public/kofi-logo.png';
import twitter_image from '@public/twitter-logo.png';
import { Box, Link, styled } from '@mui/material';
import { PatchNotes as patchNotes } from './patchNotesData';

const Container = styled(Box)(({ theme }) => ({
	color: theme.palette.secondary.main,
	display: 'flex',
	width: '100%',
	flexWrap: 'wrap',
	alignItems: 'flex-start',
}));

const PatchNoteContainer = styled(Box)(({ theme }) => ({
	width: '100%',
	'&:nth-of-type(odd)': { background: 'rgb(50, 50, 50)' },
	padding: theme.spacing(1),
}));

const Header = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexWrap: 'wrap',
	flexDirection: 'row',
	justifyContent: 'space-between',
	paddingBottom: theme.spacing(1),
}));

const Content = styled(Box)(({ theme }) => ({}));

const Title = styled(Box)(({ theme }) => ({
	fontSize: '1.3rem',
	paddingBottom: theme.spacing(0.2),
	width: '100%',
	fontWeight: 'bold',
}));

const SectionTitle = styled(Box)(({ theme }) => ({
	fontSize: '1.5rem',
	paddingBottom: theme.spacing(0.2),
	width: '100%',
	fontWeight: 'bold',
}));

const Subtitle = styled(Box)(({ theme }) => ({
	fontSize: '0.8rem',
}));

const Section = styled(Box)(({ theme }) => ({}));

const Item = styled(Box)(({ theme }) => ({
	display: 'flex',
	fontSize: '1.15rem',
	lineHeight: '1.3rem',
	paddingBottom: theme.spacing(0.5),
}));

const Bullet = styled(Box)(({ theme }) => ({
	fontSize: '30px',
	lineHeight: '1rem',
	marginRight: '4px',
}));

function PatchNotes() {
	return (
		<>
			<Container>
				<SectionTitle>Social and Support</SectionTitle>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						marginTop: '8px',
						marginLeft: '8px',
						flex: 1,
						flexWrap: 'wrap',
					}}
				>
					<SocialIcon
						linkUrl={DISCORD_LINK}
						iconUrl={discord_image}
						text="Discord"
					/>
					<SocialIcon linkUrl={KOFI_LINK} iconUrl={kofi_image} text="Donate" />
					<SocialIcon
						linkUrl={TWITTER_LINK}
						iconUrl={twitter_image}
						text="Twitter"
					/>
					<Box
						sx={{
							background: '#2b2b2b',
							padding: 2,
							borderRadius: '4px',
							fontSize: '20px',
							marginTop: 1,
						}}
					>
						Check out my other Destiny project:{' '}
						<Link target="_blank" href="https://www.d2exotic.com">
							d2exotic.com
						</Link>
					</Box>
				</Box>
				<SectionTitle sx={{ marginTop: '16px' }}>Patch Notes</SectionTitle>
				{patchNotes.map((patchNote, k) => (
					<PatchNoteContainer key={k}>
						<Header>
							<Title>{patchNote.title}</Title>

							<Subtitle>v-{patchNote.version}</Subtitle>
							<Subtitle>{patchNote.date}</Subtitle>
						</Header>
						<Content>
							{patchNote.sections.map((section, i) => (
								<Section key={i}>
									{section.items.map((item, j) => (
										<Item key={j}>
											<Bullet>◦</Bullet>
											{item}
										</Item>
									))}
								</Section>
							))}
						</Content>
					</PatchNoteContainer>
				))}
			</Container>
		</>
	);
}

export default PatchNotes;
