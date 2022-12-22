import { Box, styled } from '@mui/material';
import IconMultiSelectDropdown from '@dlb/components/IconMultiSelectDropdown';
import {
	CombatStyleModIdList,
	getCombatStyleMod,
} from '@dlb/types/CombatStyleMod';
import React from 'react';
import { ECombatStyleModId } from '@dlb/types/IdEnums';
import {
	selectSelectedCombatStyleMods,
	setSelectedCombatStyleMods,
} from '@dlb/redux/features/selectedCombatStyleMods/selectedCombatStyleModsSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { selectSelectedDestinyClass } from '@dlb/redux/features/selectedDestinyClass/selectedDestinyClassSlice';
import { getStat } from '@dlb/types/ArmorStat';
import { StatBonusStat } from '@dlb/types/globals';

const Container = styled(Box)(({ theme }) => ({
	padding: theme.spacing(1),
}));

const CombatStyleModSelector = () => {
	// const [value, setValue] = React.useState<ECombatStyleModId[]>([CombatStyleModIdList[0]]);

	const selectedCombatStyleMods = useAppSelector(selectSelectedCombatStyleMods);
	const selectedDestinyClass = useAppSelector(selectSelectedDestinyClass);

	const dispatch = useAppDispatch();

	const handleChange = (combatStyleModIds: ECombatStyleModId[]) => {
		// TODO: We can probably avoid triggering a redux dirty if they switch to
		// A set of combatStyleMods that has the same stat bonuses
		dispatch(setSelectedCombatStyleMods(combatStyleModIds));
	};

	const getOptionValue = (id: ECombatStyleModId) => getCombatStyleMod(id);

	const getOptionStat = (stat: StatBonusStat) =>
		getStat(stat, selectedDestinyClass);

	return (
		<Container>
			<IconMultiSelectDropdown
				getOptionValue={getOptionValue}
				getOptionStat={getOptionStat}
				options={CombatStyleModIdList}
				value={selectedCombatStyleMods}
				onChange={handleChange}
				title={'Combat Style Mods'}
				id={'combat-style-mod-selector'}
				showElement
			/>
		</Container>
	);
};

export default CombatStyleModSelector;
