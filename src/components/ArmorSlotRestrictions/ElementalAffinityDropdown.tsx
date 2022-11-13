import {
	ArmorElementalAffinities,
	ArmorElementalAffinityIcons
} from '@dlb/services/data';
import { styled, Theme, SxProps } from '@mui/material';
import IconDropdown from '../IconDropdown';
const Container = styled('div')(({ theme }) => ({
	// padding: theme.spacing(1),
	// paddingRight: 0
}));

const IconDropdownContainer = styled('div')(({ theme }) => ({
	['.demo-simple-select']: {
		['.character-class-name']: {
			display: 'none'
		}
	}
}));

type Option = {
	label: string;
	id: string;
	disabled: boolean;
	icon: string;
};

const options: Option[] = ArmorElementalAffinities.map(
	(armorElementalAffinity) => {
		return {
			label: armorElementalAffinity,
			id: armorElementalAffinity,
			disabled: false,
			icon: ArmorElementalAffinityIcons[armorElementalAffinity]
		};
	}
);

type ElementalAffinityDropdownProps = {
	value: string;
	onChange: (value: string) => void;
	title?: string;
	selectComponentStyle?: SxProps<Theme>;
};

function ElementalAffinityDropdown(props: ElementalAffinityDropdownProps) {
	const getLabel = (option: Option) => option.label;
	console.log();
	return (
		<Container>
			<IconDropdownContainer>
				<IconDropdown
					selectComponentProps={{
						sx: {
							...props.selectComponentStyle,
							maxWidth: 100,
							borderTopRightRadius: 0,
							borderBottomRightRadius: 0
						}
					}}
					options={options}
					getLabel={getLabel}
					value={props.value}
					onChange={props.onChange}
					title={props.title}
				/>
			</IconDropdownContainer>
		</Container>
	);
}

export default ElementalAffinityDropdown;
