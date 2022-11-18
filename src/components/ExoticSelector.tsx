import { styled } from '@mui/material';

import {
	selectSelectedExoticArmor,
	setSelectedExoticArmor,
} from '@dlb/redux/features/selectedExoticArmor/selectedExoticArmorSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { selectSelectedCharacterClass } from '@dlb/redux/features/selectedCharacterClass/selectedCharacterClassSlice';

import { selectAvailableExoticArmor } from '@dlb/redux/features/availableExoticArmor/availableExoticArmorSlice';

import IconAutocompleteDropdown from './IconAutocompleteDropdown';
import { ArmorSlotIdList, ArmorSlotIdToArmorSlot } from '@dlb/types/ArmorSlot';
import { AvailableExoticArmorItem } from '@dlb/types/Armor';
import { useMemo } from 'react';

// const Container = styled('div')(({ theme }) => ({
// 	color: theme.palette.secondary.main,
// 	width: '100%',
// 	// TODO: Fix this styling. Make it actually apply to the child. Does nothing rn.
// 	['.exotic-selector-text-field fieldset']: {
// 		borderTopLeftRadius: '0px',
// 		borderBottomLeftRadius: '0px',
// 		//borderLeftColor: 'transparent'
// 		padding: theme.spacing(1),
// 		paddingRight: 0,
// 	},
// }));

function ExoticSelector() {
	const selectedCharacterClass = useAppSelector(selectSelectedCharacterClass);
	const availableExoticArmor = useAppSelector(selectAvailableExoticArmor);
	const selectedExoticArmor = useAppSelector(selectSelectedExoticArmor);
	const dispatch = useAppDispatch();

	const options: AvailableExoticArmorItem[] = useMemo(() => {
		console.log(
			'>>>>>>>>>>> [Memo] availableExoticArmorItems calcuated <<<<<<<<<<<'
		);
		const res: AvailableExoticArmorItem[] = [];
		if (availableExoticArmor && selectedCharacterClass) {
			ArmorSlotIdList.forEach((armorSlot) => {
				res.push(availableExoticArmor[selectedCharacterClass][armorSlot]);
			});
			return res.flat();
		}
	}, [availableExoticArmor, selectedCharacterClass]);

	const handleChange = (armor: AvailableExoticArmorItem) => {
		if (
			selectedExoticArmor &&
			selectedCharacterClass &&
			armor.hash === selectedExoticArmor[selectedCharacterClass].hash
		) {
			// Don't trigger a redux dirty
			return;
		}
		const newSelectedExoticArmor = { ...selectedExoticArmor };
		newSelectedExoticArmor[selectedCharacterClass] = armor;
		dispatch(setSelectedExoticArmor(newSelectedExoticArmor));
	};

	return (
		availableExoticArmor &&
		selectedCharacterClass &&
		selectedExoticArmor &&
		selectedExoticArmor[selectedCharacterClass] && (
			<IconAutocompleteDropdown
				title={'Exotic'}
				options={options}
				value={selectedExoticArmor[selectedCharacterClass]}
				onChange={handleChange}
				getGroupBy={(option: AvailableExoticArmorItem) =>
					ArmorSlotIdToArmorSlot.get(option.armorSlot).name
				}
				getLabel={(option: AvailableExoticArmorItem) => option.name}
			/>
		)
	);
}

export default ExoticSelector;
