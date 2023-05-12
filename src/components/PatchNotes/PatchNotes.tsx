import { Box, styled } from '@mui/material';
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
				{patchNotes.map((patchNote) => (
					<PatchNoteContainer key={patchNote.version}>
						<Header>
							<Title>{patchNote.title}</Title>

							<Subtitle>v-{patchNote.version}</Subtitle>
							<Subtitle>{patchNote.date}</Subtitle>
						</Header>
						<Content>
							{patchNote.sections.map((section) => (
								<Section key={section.title}>
									{section.items.map((item) => (
										<Item key={item}>
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
