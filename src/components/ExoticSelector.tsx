import {
	selectSelectedExoticArmor,
	setSelectedExoticArmor,
} from '@dlb/redux/features/selectedExoticArmor/selectedExoticArmorSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { selectSelectedDestinyClass } from '@dlb/redux/features/selectedDestinyClass/selectedDestinyClassSlice';

import { selectAvailableExoticArmor } from '@dlb/redux/features/availableExoticArmor/availableExoticArmorSlice';

import IconAutocompleteDropdown from './IconAutocompleteDropdown';
import { ArmorSlotIdList, getArmorSlot } from '@dlb/types/ArmorSlot';
import { AvailableExoticArmorItem } from '@dlb/types/Armor';
import { useMemo } from 'react';

function ExoticSelector() {
	const selectedDestinyClass = useAppSelector(selectSelectedDestinyClass);
	const availableExoticArmor = useAppSelector(selectAvailableExoticArmor);
	const selectedExoticArmor = useAppSelector(selectSelectedExoticArmor);
	const dispatch = useAppDispatch();

	const options: AvailableExoticArmorItem[] = useMemo(() => {
		console.log(
			'>>>>>>>>>>> [Memo] availableExoticArmorItems calcuated <<<<<<<<<<<'
		);
		const res: AvailableExoticArmorItem[] = [];
		if (availableExoticArmor && selectedDestinyClass) {
			ArmorSlotIdList.forEach((armorSlotId) => {
				res.push(availableExoticArmor[selectedDestinyClass][armorSlotId]);
			});
			return res.flat();
		}
	}, [availableExoticArmor, selectedDestinyClass]);

	const handleChange = (armor: AvailableExoticArmorItem) => {
		if (
			selectedExoticArmor &&
			selectedDestinyClass &&
			armor.hash === selectedExoticArmor[selectedDestinyClass].hash
		) {
			// Don't trigger a redux dirty
			return;
		}
		const newSelectedExoticArmor = { ...selectedExoticArmor };
		newSelectedExoticArmor[selectedDestinyClass] = armor;
		console.log('>>>>> HANDLE CHANGE');
		dispatch(setSelectedExoticArmor(newSelectedExoticArmor));
	};

	// TODO: No exotic?
	// Icon might be: https://www.bungie.net/common/destiny2_content/icons/b4d05ef69d0c3227a7d4f7f35bbc2848.png
	return (
		availableExoticArmor &&
		selectedDestinyClass &&
		selectedExoticArmor &&
		selectedExoticArmor[selectedDestinyClass] && (
			<IconAutocompleteDropdown
				title={'Exotic'}
				options={options}
				value={selectedExoticArmor[selectedDestinyClass]}
				onChange={handleChange}
				getId={(option: AvailableExoticArmorItem) => option.hash.toString()}
				getGroupBy={(option: AvailableExoticArmorItem) =>
					getArmorSlot(option.armorSlot).name
				}
				getLabel={(option: AvailableExoticArmorItem) => option.name}
				textFieldClassName={'exotic-selector-text-field'}
			/>
		)
	);
}

export default ExoticSelector;
