import { Select, styled } from '@mui/material';
import { selectSelectedDestinyClass } from '@dlb/redux/features/selectedDestinyClass/selectedDestinyClassSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import IconDropdown from '@dlb/components/IconDropdown';
import {
	SelectedArmorSlotMods,
	selectSelectedArmorSlotMods,
	setSelectedArmorSlotMods,
} from '@dlb/redux/features/selectedArmorSlotMods/selectedArmorSlotModsSlice';
import { selectSelectedDestinySubclass } from '@dlb/redux/features/selectedDestinySubclass/selectedDestinySubclassSlice';
import { EModId } from '@dlb/generated/mod/EModId';
import { ArmorSlotIdList, getArmorSlot } from '@dlb/types/ArmorSlot';
import { EArmorSlotId, EElementId } from '@dlb/types/IdEnums';
import { ArmorSlotIdToArmorSlotModIdListMapping, getMod } from '@dlb/types/Mod';
import { IMod } from '@dlb/types/generation';
import IconAutocompleteDropdown from '../IconAutocompleteDropdown';
import { MISSING_ICON } from '@dlb/types/globals';
import { getModCategory } from '@dlb/types/ModCategory';
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
};

const placeholderOption: IMod = {
	name: 'None Selected...',
	id: null,
	icon: MISSING_ICON,
	description: '',
	hash: 1234,
	elementId: null,
	cost: 0,
	isArtifactMod: false,
	modCategoryId: null,
	modSocketCategoryId: null,
	armorSlotId: null,
	armorSocketIndex: 0,
	elementOverlayIcon: null,
};

const Selector = ({
	armorSlotId,
	selectedArmorSlotMods,
	handleChange,
	getLabel,
	getDescription,
	index,
	withTitle,
}: {
	armorSlotId: EArmorSlotId;
	selectedArmorSlotMods: SelectedArmorSlotMods;
	handleChange: (
		armorSlotId: EArmorSlotId,
		armorSlotModId: EModId,
		index: number
	) => void;
	getLabel: (option: Option) => string;
	getDescription: (option: Option) => string;
	index: number;
	withTitle?: boolean;
}) => {
	const selectedMod = getMod(selectedArmorSlotMods[armorSlotId][index]);
	let otherSelectedModsElementId: EElementId = EElementId.Any;
	for (let i = 0; i < selectedArmorSlotMods[armorSlotId].length; i++) {
		const modId = selectedArmorSlotMods[armorSlotId][i];
		if (modId === null || i === index) {
			continue;
		}
		const elementId = getMod(modId).elementId;
		if (elementId !== EElementId.Any) {
			otherSelectedModsElementId = getMod(modId).elementId;
			break;
		}
	}
	const options: Option[] = [
		placeholderOption,
		...ArmorSlotIdToArmorSlotModIdListMapping[armorSlotId]
			.map((id: EModId) => {
				const mod = getMod(id);
				return {
					...mod,
					// TODO: This name thing is fucking dumb but it's to prevent duplicate keys.
					// Since the Autocomplete in it's infintite wisdom uses the name as a key.
					name: mod.name + (mod.isArtifactMod ? ' (Artifact)' : ''),
					disabled:
						!(mod.elementId === EElementId.Any) &&
						!(mod.elementId === otherSelectedModsElementId) &&
						!(otherSelectedModsElementId === EElementId.Any),
					//disabled: armorSlotModIds.indexOf(x.id as EModId) > -1,
				};
			})
			.sort((optionA, optionB) =>
				`${getModCategory(optionA.modCategoryId).name}${
					optionA.name
				}`.localeCompare(
					`${getModCategory(optionB.modCategoryId).name}${optionB.name}`
				)
			),
	];
	return (
		<IconAutocompleteDropdown
			title={withTitle ? `${getArmorSlot(armorSlotId).name} Mods` : ''}
			// TODO: Memoize these options
			options={options}
			value={selectedMod || placeholderOption}
			//onChange={handleChange}
			onChange={(armorSlotMod: IMod) =>
				handleChange(armorSlotId, armorSlotMod.id as EModId, index)
			}
			getId={(option: IMod) => option.hash.toString()}
			getGroupBy={(option: IMod) => {
				return option.modCategoryId
					? getModCategory(option.modCategoryId).name
					: '';
			}}
			getLabel={getLabel}
			getDescription={getDescription}
			textFieldClassName={`armor-slot-mod-selector-text-field-${index}`}
		/>
	);
};

function ArmorSlotModSelector() {
	const selectedArmorSlotMods = useAppSelector(selectSelectedArmorSlotMods);
	const dispatch = useAppDispatch();

	const getLabel = (option: Option) => option.name;
	const getDescription = (option: Option) => option.description;

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
				{ArmorSlotIdList.map((armorSlotId) => {
					return (
						<IconDropdownContainer key={armorSlotId}>
							<Selector
								withTitle
								armorSlotId={armorSlotId}
								selectedArmorSlotMods={selectedArmorSlotMods}
								handleChange={handleChange}
								getLabel={getLabel}
								getDescription={getDescription}
								index={0}
							/>
							<Selector
								armorSlotId={armorSlotId}
								selectedArmorSlotMods={selectedArmorSlotMods}
								handleChange={handleChange}
								getLabel={getLabel}
								getDescription={getDescription}
								index={1}
							/>
						</IconDropdownContainer>
					);
				})}
			</Container>
		</>
	);
}

export default ArmorSlotModSelector;
