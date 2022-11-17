import { EDestinyClassId } from '@dlb/types/IdEnums';
import { Box, styled } from '@mui/material';
import { useEffect } from 'react';
import { selectSelectedCharacterClass } from '@dlb/redux/features/selectedCharacterClass/selectedCharacterClassSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import IconAutocompleteDropdown from '../IconAutocompleteDropdown';
import {
	DestinyClassIdList,
	DestinyClassIdToDestinySubclasses,
} from '@dlb/types/DestinyClass';
import { DestinySubclassIdToDestinySubclass } from '@dlb/types/DestinySubclass';
import { EnumDictionary } from '@dlb/types/globals';

const Container = styled(Box)(({ theme }) => ({
	color: theme.palette.primary.main,
	padding: theme.spacing(1),
	display: 'flex',
	justifyContent: 'left',
}));

export type SubclassSelectorOption = {
	label: string;
	id: string;
	icon: string;
	name: string;
};

// TODO: Rework this to respect the EnumDictionary type not having a get
const subclassAndSuperOptions: EnumDictionary<
	EDestinyClassId,
	SubclassSelectorOption[]
> & {
	append: (key: EDestinyClassId, value: SubclassSelectorOption) => void;
	get: (key: EDestinyClassId) => SubclassSelectorOption;
} = {
	get: (x: EDestinyClassId) => subclassAndSuperOptions[x],
	append: (key: EDestinyClassId, value: SubclassSelectorOption) =>
		subclassAndSuperOptions[key].push(value),
	[EDestinyClassId.Titan]: [],
	[EDestinyClassId.Hunter]: [],
	[EDestinyClassId.Warlock]: [],
};

const generateOptions = () => {
	DestinyClassIdList.forEach((destinyClassId) => {
		const destinySubclassIds =
			DestinyClassIdToDestinySubclasses.get(destinyClassId);
		destinySubclassIds.forEach((destinySubclassId) => {
			const { superAbilities, icon, name } =
				DestinySubclassIdToDestinySubclass.get(destinySubclassId);
			superAbilities.forEach((superAbility) => {
				subclassAndSuperOptions.append(destinyClassId, {
					label: superAbility,
					id: superAbility,
					icon: icon,
					name: name,
				});
			});
		});
	});
};

generateOptions();

const SubclassSelector = () => {
	const handleChange = (x: any) => {
		console.log(x);
	};

	const selectedCharacterClass = useAppSelector(selectSelectedCharacterClass);

	return false;
	// return (
	// 	selectedCharacterClass && (
	// 		<IconAutocompleteDropdown
	// 			options={subclassAndSuperOptions.get(selectedCharacterClass)}
	// 			value={null}
	// 			onChange={handleChange}
	// 			getGroupBy={(option: AvailableExoticArmorItem) =>
	// 				getArmorSlotDisplayName(option.armorSlot)
	// 			}
	// 			getLabel={(option: AvailableExoticArmorItem) => option.name}
	// 		/>
	// 	)
	// );
};

export default SubclassSelector;
