import { Box, Icon, styled } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import {
	selectSelectedRaidMods,
	setSelectedRaidMods,
} from '@dlb/redux/features/selectedRaidMods/selectedRaidModsSlice';
import { EModId } from '@dlb/generated/mod/EModId';
import { selectSelectedDestinyClass } from '@dlb/redux/features/selectedDestinyClass/selectedDestinyClassSlice';
import { RaidModIdList } from '@dlb/types/Mod';
import ModSelector from './ModSelection/ModSelector';
import { selectDisabledRaidMods } from '@dlb/redux/features/disabledRaidMods/disabledRaidModsSlice';
import { IMod } from '@dlb/types/generation';
import { Warning } from '@mui/icons-material';
const Container = styled('div')(({ theme }) => ({
	padding: theme.spacing(1),
}));

type Option = {
	name: string;
	id: string;
	disabled?: boolean;
	icon: string;
	description: string;
	extraIcons?: string[];
	cost: number;
};

function RaidModSelector() {
	const selectedRaidMods = useAppSelector(selectSelectedRaidMods);
	const disabledMods = useAppSelector(selectDisabledRaidMods);
	const dispatch = useAppDispatch();

	const getLabel = (option: Option) => option.name;
	const getDescription = (option: Option) => option.description;
	const getCost = (option: Option) => option.cost;
	const getTitle = () => '';
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
					enforceMatchingElementRule={false}
					key={index}
					selectedDestinyClass={selectedDestinyClass}
					availableMods={RaidModIdList}
					getTitle={index === 0 ? () => 'Raid and Nightmare Mods' : null}
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
				/>
			))}
		</Container>
	);
}

export default RaidModSelector;
