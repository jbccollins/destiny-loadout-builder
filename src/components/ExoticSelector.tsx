import BungieImage from '@dlb/dim/dim-ui/BungieImage';

import {
	ArmorSlots,
	AvailableExoticArmorItem,
	DestinyClasses,
	EDestinyClass,
	getArmorSlotDisplayName
} from '@dlb/services/data';
import {
	Box,
	styled,
	Card,
	Autocomplete,
	FormControl,
	TextField
} from '@mui/material';

import {
	selectSelectedExoticArmor,
	setSelectedExoticArmor
} from '@dlb/redux/features/selectedExoticArmor/selectedExoticArmorSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { selectSelectedCharacterClass } from '@dlb/redux/features/selectedCharacterClass/selectedCharacterClassSlice';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { selectAvailableExoticArmor } from '@dlb/redux/features/availableExoticArmor/availableExoticArmorSlice';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

const Container = styled('div')(({ theme }) => ({
	color: theme.palette.secondary.main,
	['.exotic-selector-text-field fieldset']: {
		borderTopLeftRadius: '0px',
		borderBottomLeftRadius: '0px',
		//borderLeftColor: 'transparent'
		padding: theme.spacing(1),
		paddingRight: 0
	}
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
				EDestinyClass,
				AvailableExoticArmorItem
			> = {
				[EDestinyClass.Titan]: null,
				[EDestinyClass.Hunter]: null,
				[EDestinyClass.Warlock]: null
			};
			DestinyClasses.forEach((className) => {
				if (availableExoticArmor[className]) {
					for (const armorSlot of ArmorSlots) {
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
		selectedCharacterClass
	]);

	useEffect(() => {
		setDefaultSelectedExoticArmor();
	}, [setDefaultSelectedExoticArmor]);

	let options: AvailableExoticArmorItem[] = [];
	if (availableExoticArmor && selectedCharacterClass) {
		ArmorSlots.forEach((armorSlot) => {
			options = options.concat(
				availableExoticArmor[selectedCharacterClass][armorSlot]
			);
		});
		console.log('>>>>>>>>>>> options <<<<<<<<<<<<', options);
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
			<Container>
				<FormControl fullWidth>
					<Autocomplete
						id="country-select-demo"
						sx={{ width: 400 }}
						options={options}
						autoHighlight
						value={selectedExoticArmor[selectedCharacterClass]}
						disableClearable
						groupBy={(option) => getArmorSlotDisplayName(option.armorSlot)}
						onChange={(_, value) => {
							handleChange(value as AvailableExoticArmorItem);
						}}
						isOptionEqualToValue={(option, value) => {
							return option.name == value.name && option.icon == value.icon;
						}}
						getOptionLabel={(option) =>
							(option as AvailableExoticArmorItem).name
						}
						renderOption={(props, option, { inputValue }) => {
							const matches = match(option.name, inputValue, {
								insideWords: true
							});
							const parts = parse(option.name, matches);
							return (
								<Box
									component="li"
									sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
									{...props}
								>
									<BungieImage width="20" src={option.icon} alt="asdf" />
									<div>
										{parts.map((part, index) => (
											<span
												key={index}
												style={{
													fontWeight: part.highlight ? 700 : 400
												}}
											>
												{part.text}
											</span>
										))}
									</div>
								</Box>
							);
						}}
						renderInput={(params) => {
							return (
								<TextField
									className="exotic-selector-text-field"
									label="Exotic"
									//labelId="demo-simple-select-label-2"
									{...params}
									InputProps={{
										...params.InputProps,
										startAdornment: (
											<Box
												sx={{
													marginTop: '7.5px',
													marginBottom: '1.5px',
													marginLeft: '5px'
												}}
											>
												<BungieImage
													width={40}
													height={40}
													src={selectedExoticArmor[selectedCharacterClass].icon}
												/>
											</Box>
										),
										autoComplete: 'new-password' // disable autocomplete and autofill
									}}
								/>
							);
						}}
					/>
				</FormControl>
			</Container>
		)
	);
}

export default ExoticSelector;
