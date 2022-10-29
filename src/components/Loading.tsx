import {
	CheckCircleRounded,
	ImportantDevices,
	Scale
} from '@mui/icons-material';
import { Box, styled, Checkbox, Card, CircularProgress } from '@mui/material';

type LoadingProps = Readonly<{ items: [string, boolean][] }>;
const Container = styled(Card)(({ theme }) => ({
	color: theme.palette.secondary.main,
	padding: theme.spacing(3)
}));

const Item = styled(Box)(({ theme }) => ({
	color: theme.palette.secondary.main,
	display: 'flex'
}));

const ItemCheckbox = styled(Checkbox)(({ theme }) => ({
	color: theme.palette.secondary.main
}));

const ItemName = styled(Box)(({ theme }) => ({
	color: theme.palette.secondary.main,
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center'
}));

const LoadingSpinner = styled(CircularProgress)(({ theme }) => ({
	color: theme.palette.secondary.main,
	width: '24px !important', // `${theme.spacing(2.6)} !important`,
	height: '24px !important' // `${theme.spacing(2.6)} !important`
}));

const LoadingSpinnerContainer = styled(Box)(() => ({
	transform: `scale(0.8)`,
	width: '24px !important', // `${theme.spacing(2.6)} !important`,
	height: '24px !important' // `${theme.spacing(2.6)} !important`
}));

function Loading(props: LoadingProps) {
	return (
		<>
			<Container>
				{props.items.map(([name, loaded], i) => (
					<Item key={name}>
						{loaded ? (
							<CheckCircleRounded />
						) : (
							<LoadingSpinnerContainer>
								<LoadingSpinner />
							</LoadingSpinnerContainer>
						)}
						<ItemName>{name}</ItemName>
					</Item>
				))}
			</Container>
		</>
	);
}

export default Loading;
