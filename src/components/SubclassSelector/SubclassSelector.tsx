import {
	ArmorElementalAffinityIcons as ElementalAffinityIcons,
	SubclassElementalAffinities,
} from '@dlb/services/data';
import { Box, Card, styled } from '@mui/material';
import ElementalAffinityDropdown, {
	ElementalAffinityOption,
} from '../ElementalAffinityDropdown';

const Container = styled(Box)(({ theme }) => ({
	color: theme.palette.primary.main,
	padding: theme.spacing(1),
	display: 'flex',
	justifyContent: 'left',
}));

const elementalAffinityOptions: ElementalAffinityOption[] =
	SubclassElementalAffinities.map((elementalAffinity) => {
		return {
			label: elementalAffinity,
			id: elementalAffinity,
			icon: ElementalAffinityIcons[elementalAffinity],
		};
	});

const SubclassSelector = () => {
	const handleChange = (x: any) => {
		console.log(x);
	};

	return (
		<Container>
			<ElementalAffinityDropdown
				options={elementalAffinityOptions}
				title={'Subclass'}
				value={'arc'}
				onChange={(value: string) => handleChange(value)}
			/>
		</Container>
	);
};

export default SubclassSelector;
