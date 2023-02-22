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
import { EArmorSlotId, EElementId } from '@dlb/types/IdEnums';
import ModSelector from './ModSelector';
import { ArmorSlotIdToArmorSlotModIdListMapping, getMod } from '@dlb/types/Mod';
import { selectSelectedDestinyClass } from '@dlb/redux/features/selectedDestinyClass/selectedDestinyClassSlice';
import { IMod } from '@dlb/types/generation';
import { selectDisabledArmorSlotMods } from '@dlb/redux/features/disabledArmorSlotMods/disabledArmorSlotModsSlice';
import BungieImage from '@dlb/dim/dim-ui/BungieImage';

const Container = styled('div')(({ theme }) => ({
	padding: theme.spacing(1),
}));

const IconDropdownContainer = styled('div')(({ theme }) => ({
	paddingBottom: theme.spacing(1),
	display: 'flex',
	position: 'relative',
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
	const disabledMods = useAppSelector(selectDisabledArmorSlotMods);
	const selectedArmorSlotMods = useAppSelector(selectSelectedArmorSlotMods);
	const dispatch = useAppDispatch();

	const getLabel = (option: Option) => option.name;
	const getDescription = (option: Option) => option.description;
	const getCost = (option: Option) => option.cost;
	const getTitle = (id: EArmorSlotId) => ''; //`${getArmorSlot(id).name} Mods`;
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

	const isModDisabled = (
		mod: IMod,
		index: number,
		selectedMods: EModId[]
	): boolean => {
		if (disabledMods[mod.id] && disabledMods[mod.id][index]) {
			return true;
		}
		let otherSelectedModsElementId: EElementId = EElementId.Any;
		for (let i = 0; i < selectedMods.length; i++) {
			const modId = selectedMods[i];
			if (modId === null || i === index) {
				continue;
			}
			const elementId = getMod(modId).elementId;
			if (elementId !== EElementId.Any) {
				otherSelectedModsElementId = getMod(modId).elementId;
				break;
			}
		}
		return (
			!(mod.elementId === EElementId.Any) &&
			!(mod.elementId === otherSelectedModsElementId) &&
			!(otherSelectedModsElementId === EElementId.Any)
		);
	};

	return (
		<>
			<Container>
				{ArmorSlotWithClassItemIdList.map((armorSlotId) => {
					const dropdownIndices = selectedArmorSlotMods[armorSlotId].map(
						(_, i) => i
					);
					return (
						<IconDropdownContainer
							key={armorSlotId}
							className={'icon-dropdown-container'}
						>
							<Box sx={{ paddingTop: '16px', paddingRight: '6px' }}>
								<BungieImage
									width={'30px'}
									height={'30px'}
									src={getArmorSlot(armorSlotId).icon}
								/>
							</Box>
							{dropdownIndices.map((index) => (
								<ModSelector
									isModDisabled={(mod: IMod) =>
										isModDisabled(
											mod,
											index,
											selectedArmorSlotMods[armorSlotId]
										)
									}
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
									idPrefix={armorSlotId}
									first={index === 0}
									last={index === dropdownIndices.length - 1}
									textFieldClassName={'armor-slot-mod-selector-text-field'}
									compact
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
