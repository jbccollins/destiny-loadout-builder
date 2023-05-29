import { selectSelectedDestinyClass } from '@dlb/redux/features/selectedDestinyClass/selectedDestinyClassSlice';
import {
	selectSelectedExoticArmor,
	setSelectedExoticArmor,
} from '@dlb/redux/features/selectedExoticArmor/selectedExoticArmorSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';

import { selectAvailableExoticArmor } from '@dlb/redux/features/availableExoticArmor/availableExoticArmorSlice';

import BungieImage from '@dlb/dim/dim-ui/BungieImage';
import { AvailableExoticArmorItem } from '@dlb/types/Armor';
import { ArmorSlotIdList, getArmorSlot } from '@dlb/types/ArmorSlot';
import { MISSING_ICON } from '@dlb/types/globals';
import { Box } from '@mui/material';
import { useMemo } from 'react';
import IconAutocompleteDropdown from './IconAutocompleteDropdown';

const getExtraContent = (option: AvailableExoticArmorItem) => {
	return (
		<Box sx={{ marginTop: '10px' }}>
			{option.exoticPerk && (
				<Box>
					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<Box>
							<BungieImage
								width={'25px'}
								height={'25px'}
								src={option.exoticPerk.icon}
							/>
						</Box>
						<Box
							sx={{ marginLeft: '4px', fontSize: '14px', marginTop: '-5px' }}
						>
							{option.exoticPerk.name}
						</Box>
					</Box>
					<Box sx={{ fontSize: '12px' }}>{option.exoticPerk.description}</Box>
				</Box>
			)}
			{!option.exoticPerk && (
				<Box>
					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<Box>
							<BungieImage width={'25px'} height={'25px'} src={MISSING_ICON} />
						</Box>
						<Box
							sx={{ marginLeft: '4px', fontSize: '14px', marginTop: '-5px' }}
						>
							No Exotic Perk
						</Box>
					</Box>
					<Box sx={{ fontSize: '12px' }}>
						{'Aeon exotics have no intrinsic exotic perk.'}
					</Box>
				</Box>
			)}
		</Box>
	);
};

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
				getExtraContent={getExtraContent}
				getLabel={(option: AvailableExoticArmorItem) => option.name}
				textFieldClassName={'exotic-selector-text-field'}
			/>
		)
	);
}

export default ExoticSelector;
