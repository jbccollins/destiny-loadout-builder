'use client';

import { EModId } from '@dlb/generated/mod/EModId';
import { selectDisabledRaidMods } from '@dlb/redux/features/disabledRaidMods/disabledRaidModsSlice';
import { selectSelectedDestinyClass } from '@dlb/redux/features/selectedDestinyClass/selectedDestinyClassSlice';
import { selectSelectedIntrinsicArmorPerkOrAttributeIds } from '@dlb/redux/features/selectedIntrinsicArmorPerkOrAttributeIds/selectedIntrinsicArmorPerkOrAttributeIdsSlice';
import {
	selectSelectedRaidMods,
	setSelectedRaidMods,
} from '@dlb/redux/features/selectedRaidMods/selectedRaidModsSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { RaidModIdList } from '@dlb/types/Mod';
import { getRaidAndNightmareModType } from '@dlb/types/RaidAndNightmareModType';
import { IMod } from '@dlb/types/generation';
import { styled } from '@mui/material';
import ModSelector from './ModSelection/ModSelector';
const Container = styled('div')(({ theme }) => ({
	padding: theme.spacing(1),
}));

function RaidModSelector() {
	const selectedRaidMods = useAppSelector(selectSelectedRaidMods);
	const disabledMods = useAppSelector(selectDisabledRaidMods);
	const dispatch = useAppDispatch();

	const selectedIntrinsicArmorPerkOrAttributeIds = useAppSelector(
		selectSelectedIntrinsicArmorPerkOrAttributeIds
	);

	const numSelectedIntrinsicArmorPerkOrAttributeIds =
		selectedIntrinsicArmorPerkOrAttributeIds.filter((x) => x !== null).length;
	const disabledIndices =
		numSelectedIntrinsicArmorPerkOrAttributeIds > 0
			? selectedRaidMods
					.map((x, i) => (x === null ? i : null))
					.filter((x) => x !== null)
					.slice(-1 * numSelectedIntrinsicArmorPerkOrAttributeIds)
			: [];

	const getLabel = (option: IMod) => option.name;
	const getDescription = (option: IMod) => option.description;
	const getCost = (option: IMod) => option.cost;

	const getGroupBy = (option: IMod) => {
		return option.raidAndNightmareModTypeId
			? getRaidAndNightmareModType(option.raidAndNightmareModTypeId).name
			: '';
	};

	const getGroupBySort = (optionA: IMod, optionB: IMod) =>
		`${getRaidAndNightmareModType(optionA.raidAndNightmareModTypeId).name}${
			optionA.name
		}`.localeCompare(
			`${getRaidAndNightmareModType(optionB.raidAndNightmareModTypeId).name}${
				optionB.name
			}`
		);

	const selectedDestinyClass = useAppSelector(selectSelectedDestinyClass);

	const handleChange = (modId: EModId, index: number) => {
		const modIds = [...selectedRaidMods];
		modIds[index] = modId;
		dispatch(setSelectedRaidMods(modIds));
	};

	const isModDisabled = (mod: IMod): boolean => {
		return disabledMods[mod.id];
	};

	const dropdownIndices = selectedRaidMods.map((_, i) => i);
	return (
		<Container>
			{/* <Box sx={{ color: 'orange', display: 'flex', marginBottom: '16px' }}>
				<Warning />
				<Box sx={{ paddingLeft: '8px' }}>
					Raid Mods are in beta. Expect bugs.
				</Box>
			</Box> */}
			{dropdownIndices.map((index) => (
				<ModSelector
					idPrefix={'raid-mod-selector'}
					isModDisabled={isModDisabled}
					getGroupBy={getGroupBy}
					getGroupBySort={getGroupBySort}
					key={index}
					selectedDestinyClass={selectedDestinyClass}
					availableMods={RaidModIdList}
					// getTitle={index === 0 ? () => 'Raid and Nightmare Mods' : null}
					selectedMods={selectedRaidMods}
					handleChange={handleChange}
					getLabel={getLabel}
					getDescription={getDescription}
					getCost={getCost}
					index={index}
					first={index === 0}
					last={index === dropdownIndices.length - 1}
					textFieldClassName={'raid-mod-selector-text-field'}
					compact={false}
					disabled={disabledIndices.includes(index)}
				/>
			))}
		</Container>
	);
}

export default RaidModSelector;
