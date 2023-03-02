import { styled, Box } from '@mui/material';
import React from 'react';

const Container = styled(Box)(({ theme }) => ({
	margin: 'auto',
	width: '50%',
	minWidth: '300px',
	maxWidth: '500px',
	//border: '3px solid green',
	padding: theme.spacing(3),
	height: `calc(100% - 160px)`,
	position: 'relative',
}));

const Content = styled(Box)(({ theme }) => ({
	//border: '3px solid red',
	padding: theme.spacing(3),
	height: `calc(100% - 160px)`,
	position: 'relative',
}));

const Title = styled(Box)(({ theme }) => ({
	fontSize: '2rem',
	fontWeight: 'bold',
}));
const Subtitle = styled(Box)(({ theme }) => ({}));

function NoResults() {
	return (
		<>
			<Container>
				<Content>
					<Title>No Results</Title>
					<Subtitle>
						Try reducing your desired stat tiers, removing mods, or removing
						fragments with stat penalties
					</Subtitle>
				</Content>
			</Container>
		</>
	);
}

export default NoResults;
