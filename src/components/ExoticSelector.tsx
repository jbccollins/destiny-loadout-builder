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
import WarningIcon from '@mui/icons-material/Warning';
import { Box, Popper, styled } from '@mui/material';
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
			{option.count === 1 && (
				<Box
					sx={{
						fontSize: '12px',
						color: 'orange',
						display: 'flex',
						marginTop: '16px',
					}}
				>
					<WarningIcon sx={{ fontSize: '20px' }} />
					<Box sx={{ marginLeft: '4px' }}>
						You do not own a copy of this exotic. Selecting this option will
						only use the collections roll.
					</Box>
				</Box>
			)}
		</Box>
	);
};
const StyledPopper = styled(Popper)({
	maxHeight: '60vh',
	// maxHeight: '600px',
	['.MuiPaper-root']: {
		maxHeight: '60vh',
	},
	['.MuiAutocomplete-listbox']: {
		maxHeight: '60vh',
	},
});

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
				title={''}
				popperComponent={StyledPopper}
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
