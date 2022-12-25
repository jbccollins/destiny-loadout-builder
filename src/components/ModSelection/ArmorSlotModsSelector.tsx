import { Box, styled } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import {
	selectSelectedArmorSlotMods,
	setSelectedArmorSlotMods,
} from '@dlb/redux/features/selectedArmorSlotMods/selectedArmorSlotModsSlice';
import { EModId } from '@dlb/generated/mod/EModId';
import {
	ArmorSlotWithClassItemIdList,
	getArmorSlot,
} from '@dlb/types/ArmorSlot';
import { EArmorSlotId } from '@dlb/types/IdEnums';
import ModSelector from './ModSelector';
import { ArmorSlotIdToArmorSlotModIdListMapping } from '@dlb/types/Mod';
import { selectSelectedDestinyClass } from '@dlb/redux/features/selectedDestinyClass/selectedDestinyClassSlice';
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

function ArmorSlotModSelector() {
	const selectedArmorSlotMods = useAppSelector(selectSelectedArmorSlotMods);
	const dispatch = useAppDispatch();

	const getLabel = (option: Option) => option.name;
	const getDescription = (option: Option) => option.description;
	const getCost = (option: Option) => option.cost;
	const getTitle = (id: EArmorSlotId) => `${getArmorSlot(id).name} Mods`;
	const selectedDestinyClass = useAppSelector(selectSelectedDestinyClass);

	const handleChange = (
		armorSlotId: EArmorSlotId,
		armorSlotModId: EModId,
		index: number
	) => {
		const armorSlotModIds = { ...selectedArmorSlotMods };
		const modIds = [...armorSlotModIds[armorSlotId]];
		modIds[index] = armorSlotModId;
		armorSlotModIds[armorSlotId] = modIds;
		dispatch(setSelectedArmorSlotMods(armorSlotModIds));
	};

	return (
		<>
			<Container>
				{ArmorSlotWithClassItemIdList.map((armorSlotId) => {
					const dropdownIndices = selectedArmorSlotMods[armorSlotId].map(
						(_, i) => i
					);
					return (
						<IconDropdownContainer key={armorSlotId}>
							{dropdownIndices.map((index) => (
								<ModSelector
									enforceMatchingElementRule
									key={index}
									selectedDestinyClass={selectedDestinyClass}
									availableMods={
										ArmorSlotIdToArmorSlotModIdListMapping[armorSlotId]
									}
									getTitle={index === 0 ? () => getTitle(armorSlotId) : null}
									selectedMods={selectedArmorSlotMods[armorSlotId]}
									handleChange={(modId: EModId, index: number) =>
										handleChange(armorSlotId, modId, index)
									}
									getLabel={getLabel}
									getDescription={getDescription}
									getCost={getCost}
									index={index}
									first={index === 0}
									last={index === 1}
								/>
							))}
						</IconDropdownContainer>
					);
				})}
			</Container>
		</>
	);
}

export default ArmorSlotModSelector;
