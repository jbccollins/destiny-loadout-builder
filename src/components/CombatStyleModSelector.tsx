import { Box, styled } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import {
	selectSelectedCombatStyleMods,
	setSelectedCombatStyleMods,
} from '@dlb/redux/features/selectedCombatStyleMods/selectedCombatStyleModsSlice';
import { EModId } from '@dlb/generated/mod/EModId';
import { selectSelectedDestinyClass } from '@dlb/redux/features/selectedDestinyClass/selectedDestinyClassSlice';
import { CombatStyleModIdList } from '@dlb/types/Mod';
import ModSelector from './ModSelection/ModSelector';
const Container = styled('div')(({ theme }) => ({
	padding: theme.spacing(1),
}));

const IconDropdownContainer = styled('div')(({ theme }) => ({
	paddingTop: theme.spacing(1),
	paddingBottom: theme.spacing(2),
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

function CombatStyleModSelector() {
	const selectedCombatStyleMods = useAppSelector(selectSelectedCombatStyleMods);
	const dispatch = useAppDispatch();

	const getLabel = (option: Option) => option.name;
	const getDescription = (option: Option) => option.description;
	const getCost = (option: Option) => option.cost;
	const getTitle = () => '';
	const selectedDestinyClass = useAppSelector(selectSelectedDestinyClass);

	const handleChange = (combatStyleModId: EModId, index: number) => {
		const modIds = [...selectedCombatStyleMods];
		modIds[index] = combatStyleModId;
		dispatch(setSelectedCombatStyleMods(modIds));
	};
	const dropdownIndices = selectedCombatStyleMods.map((_, i) => i);
	return (
		<Container>
			{dropdownIndices.map((index) => (
				<ModSelector
					enforceMatchingElementRule={false}
					key={index}
					selectedDestinyClass={selectedDestinyClass}
					availableMods={CombatStyleModIdList}
					getTitle={index === 0 ? () => 'Combat Style Mods' : null}
					selectedMods={selectedCombatStyleMods}
					handleChange={handleChange}
					getLabel={getLabel}
					getDescription={getDescription}
					getCost={getCost}
					index={index}
					first={index === 0}
					last={index === 1}
				/>
			))}
		</Container>
	);
}

export default CombatStyleModSelector;