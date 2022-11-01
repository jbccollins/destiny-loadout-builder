import { styled, Box, Slider } from '@mui/material';
import { ComponentProps } from 'react';

type StatSliderProps = {
	locked: boolean;
} & ComponentProps<typeof Slider>;

const Container = styled(Box)(({ theme }) => ({
	color: theme.palette.secondary.main
	// padding: theme.spacing(1)
}));

const iOSBoxShadow =
	'0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

const IOSSlider = styled(Slider)(({ theme }) => ({
	color: theme.palette.mode === 'dark' ? '#3880ff' : '#3880ff',
	height: 2,
	padding: '15px 0',
	'& .MuiSlider-thumb': {
		height: 20,
		width: 20,
		backgroundColor: '#fff',
		boxShadow: iOSBoxShadow,
		'&:focus, &:hover, &.Mui-active': {
			boxShadow:
				'0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
			// Reset on touch devices, it doesn't add specificity
			'@media (hover: none)': {
				boxShadow: iOSBoxShadow
			}
		}
	},
	'& .MuiSlider-valueLabel': {
		fontSize: 12,
		fontWeight: 'normal',
		top: -6,
		backgroundColor: 'unset',
		color: theme.palette.text.primary,
		'&:before': {
			display: 'none'
		},
		'& *': {
			background: 'transparent',
			color: theme.palette.mode === 'dark' ? '#fff' : '#000'
		}
	},
	'& .MuiSlider-track': {
		border: 'none'
	},
	'& .MuiSlider-rail': {
		opacity: 0.5,
		backgroundColor: '#bfbfbf'
	},
	'& .MuiSlider-mark': {
		backgroundColor: '#bfbfbf',
		height: 8,
		width: 1,
		'&.MuiSlider-markActive': {
			opacity: 1,
			backgroundColor: 'currentColor'
		}
	}
}));

function StatSlider(props: StatSliderProps) {
	// ValidDestinyClassesTypes.forEach((classType) => {
	// 	D2Categories.Armor.forEach((a) => {
	// 		console.log(props.items[classType][a]);
	// 	});
	// });

	const { locked, ...rest } = props;

	return (
		<>
			<Container>
				<IOSSlider {...rest} />
			</Container>
		</>
	);
}

export default StatSlider;
