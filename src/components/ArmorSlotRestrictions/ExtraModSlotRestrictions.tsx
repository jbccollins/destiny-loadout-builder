import {
	ArmorExtraModSlotIdList,
	ArmorExtraMotSlotIdToArmorExtraMotSlot,
} from '@dlb/types/ArmorExtraModSlot';
import { styled } from '@mui/material';
import IconDropdown from '@dlb/components/IconDropdown';
const Container = styled('div')(({ theme }) => ({
	// padding: theme.spacing(1),
	// paddingRight: 0
}));

const IconDropdownContainer = styled('div')(({ theme }) => ({
	//
}));

type Option = {
	label: string;
	id: string;
	disabled: boolean;
	icon: string;
};

const options: Option[] = ArmorExtraModSlotIdList.map((armorExtraModSlotId) => {
	const armorExtraModSlot =
		ArmorExtraMotSlotIdToArmorExtraMotSlot.get(armorExtraModSlotId);
	return {
		label: armorExtraModSlot.name,
		id: armorExtraModSlotId,
		disabled: false,
		icon: armorExtraModSlot.icon,
	};
});

type ExtraModSlotDropdownProps = {
	value: string;
	onChange: (value: string) => void;
	title?: string;
};

function ExtraModSlotDropdown(props: ExtraModSlotDropdownProps) {
	const getLabel = (option: Option) => option.label;

	return (
		<Container>
			<IconDropdownContainer>
				<IconDropdown
					hideSelectedOptionText={true}
					selectComponentProps={{
						sx: {
							maxWidth: 100,
							borderTopRightRadius: 0,
							borderTopLeftRadius: 0,
							borderBottomRightRadius: 0,
							borderBottomLeftRadius: 0,
						},
					}}
					options={options}
					getLabel={getLabel}
					title={props.title}
					value={props.value}
					onChange={props.onChange}
				/>
			</IconDropdownContainer>
		</Container>
	);
}

export default ExtraModSlotDropdown;
