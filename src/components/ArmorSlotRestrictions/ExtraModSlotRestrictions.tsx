import BungieImage from '@dlb/dim/dim-ui/BungieImage';
import {
	ArmorExtraModSlotIcons,
	ArmorExtraModSlotNames,
	ArmorExtraModSlots,
	EArmorElementalAffinity,
	EArmorExtraModSlot,
	EDestinyClass
} from '@dlb/services/data';
import { Box, styled, Card, capitalize, Typography } from '@mui/material';
import {
	selectSelectedCharacterClass,
	setSelectedCharacterClass
} from '@dlb/redux/features/selectedCharacterClass/selectedCharacterClassSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { useCallback, useEffect, useMemo } from 'react';
import { selectCharacters } from '@dlb/redux/features/characters/charactersSlice';
import IconDropdown from '../IconDropdown';
import { selectSelectedArmorSlotRestrictions } from '@dlb/redux/features/selectedArmorSlotRestrictions/selectedArmorSlotRestrictionsSlice';
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

const options: Option[] = ArmorExtraModSlots.map((armorExtraModSlot) => {
	return {
		label: ArmorExtraModSlotNames[armorExtraModSlot],
		id: armorExtraModSlot,
		disabled: false,
		icon: ArmorExtraModSlotIcons[armorExtraModSlot]
	};
});

console.log('>>>>>> OPTIONS', options);

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
					selectComponentProps={{
						sx: {
							maxWidth: 100,
							borderTopRightRadius: 0,
							borderTopLeftRadius: 0,
							borderBottomRightRadius: 0,
							borderBottomLeftRadius: 0
						}
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
