import { styled, SxProps, Theme } from '@mui/material';
import IconDropdown from './IconDropdown';
const Container = styled('div')(({ theme }) => ({
	// padding: theme.spacing(1),
	// paddingRight: 0
}));

const IconDropdownContainer = styled('div')(({ theme }) => ({
	//
}));

export type ElementalAffinityOption = {
	label: string;
	id: string;
	icon: string;
};

type ElementalAffinityDropdownProps = {
	value: string;
	onChange: (value: string) => void;
	title?: string;
	selectComponentStyle?: SxProps<Theme>;
	options: ElementalAffinityOption[];
};

function ElementalAffinityDropdown(props: ElementalAffinityDropdownProps) {
	const getLabel = (option: ElementalAffinityOption) => option.label;
	return (
		<Container>
			<IconDropdownContainer>
				<IconDropdown
					hideSelectedOptionText={true}
					selectComponentProps={{
						sx: {
							...props.selectComponentStyle,
							maxWidth: 100,
							borderTopRightRadius: 0,
							borderBottomRightRadius: 0,
						},
					}}
					options={props.options}
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
