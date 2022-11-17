import BungieImage from '@dlb/dim/dim-ui/BungieImage';

import { DestinyClassIdList } from '@dlb/types/DestinyClass';
import {
	Box,
	styled,
	Card,
	Autocomplete,
	FormControl,
	TextField,
} from '@mui/material';

import {
	selectSelectedExoticArmor,
	setSelectedExoticArmor,
} from '@dlb/redux/features/selectedExoticArmor/selectedExoticArmorSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { selectSelectedCharacterClass } from '@dlb/redux/features/selectedCharacterClass/selectedCharacterClassSlice';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { selectAvailableExoticArmor } from '@dlb/redux/features/availableExoticArmor/availableExoticArmorSlice';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import IconAutocompleteDropdown from './IconAutocompleteDropdown';
import { EDestinyClassId } from '@dlb/types/IdEnums';
import { ArmorSlotIdList, ArmorSlotIdToArmorSlot } from '@dlb/types/ArmorSlot';
import { AvailableExoticArmorItem } from '@dlb/types/Armor';

const Container = styled('div')(({ theme }) => ({
	color: theme.palette.secondary.main,
	width: '100%',
	// TODO: Fix this styling. Make it actually apply to the child. Does nothing rn.
	['.exotic-selector-text-field fieldset']: {
		borderTopLeftRadius: '0px',
		borderBottomLeftRadius: '0px',
		//borderLeftColor: 'transparent'
		padding: theme.spacing(1),
		paddingRight: 0,
	},
}));

// TODO: Group by armor slot
function ExoticSelector() {
	const selectedCharacterClass = useAppSelector(selectSelectedCharacterClass);
	const availableExoticArmor = useAppSelector(selectAvailableExoticArmor);
	const selectedExoticArmor = useAppSelector(selectSelectedExoticArmor);
	const dispatch = useAppDispatch();
	const [hasSelectedDefaultExotics, setHasSelectedDefaultExotics] =
		useState(false);

	const setDefaultSelectedExoticArmor = useCallback(() => {
		if (
			availableExoticArmor &&
			selectedCharacterClass &&
			!hasSelectedDefaultExotics
		) {
			const newSelectedExoticArmor: Record<
				EDestinyClassId,
				AvailableExoticArmorItem
			> = {
				[EDestinyClassId.Titan]: null,
				[EDestinyClassId.Hunter]: null,
				[EDestinyClassId.Warlock]: null,
			};
			DestinyClassIdList.forEach((className) => {
				if (availableExoticArmor[className]) {
					for (const armorSlot of ArmorSlotIdList) {
						// TODO: this lookup of className in the availableExoticArmor const is not
						// typesafe and is not picked up by intellisense. remove all such mapping consts
						// from the data file. `availableExoticArmor['derp']` is not caught!!!!!
						if (availableExoticArmor[className][armorSlot].length > 0) {
							// Just pick the first exotic item we find
							newSelectedExoticArmor[className] =
								availableExoticArmor[className][armorSlot][0];
							break;
						}
					}
				}
			});
			setHasSelectedDefaultExotics(true);
			dispatch(setSelectedExoticArmor(newSelectedExoticArmor));
		}
	}, [
		availableExoticArmor,
		dispatch,
		hasSelectedDefaultExotics,
		selectedCharacterClass,
	]);

	useEffect(() => {
		setDefaultSelectedExoticArmor();
	}, [setDefaultSelectedExoticArmor]);

	// let options: AvailableExoticArmorItem[] = useMemo(
	// 	() => [],
	// 	[availableExoticArmor, selectedCharacterClass]
	// );
	// TODO: Don't recalculate this every render. Set this in the loading component
	let options: AvailableExoticArmorItem[] = [];
	if (availableExoticArmor && selectedCharacterClass) {
		ArmorSlotIdList.forEach((armorSlot) => {
			options = options.concat(
				availableExoticArmor[selectedCharacterClass][armorSlot]
			);
		});
		// console.log('>>>>>>>>>>> options <<<<<<<<<<<<', options);
	}

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

	// TODO: fix all the copy/pasted "country" references
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
