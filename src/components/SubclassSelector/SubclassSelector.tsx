import { EDestinyClassId, EElement } from '@dlb/types/IdEnums';
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
import { DestinySuperAbilityIdToDestinySuperAbility } from '@dlb/types/DestinySuperAbility';
import { ElementIdToElement } from '@dlb/types/Element';

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
	element: EElement;
};

const options = (() => {
	const opts = {
		[EDestinyClassId.Titan]: [],
		[EDestinyClassId.Hunter]: [],
		[EDestinyClassId.Warlock]: [],
	};
	DestinyClassIdList.forEach((destinyClassId) => {
		const destinySubclassIds =
			DestinyClassIdToDestinySubclasses.get(destinyClassId);
		destinySubclassIds.forEach((destinySubclassId) => {
			const { destinySuperAbilityIds } =
				DestinySubclassIdToDestinySubclass.get(destinySubclassId);
			destinySuperAbilityIds.forEach((destinySuperAbilityId) => {
				const { icon, name, id, elementId } =
					DestinySuperAbilityIdToDestinySuperAbility.get(destinySuperAbilityId);
				const { name: elementName } = ElementIdToElement.get(elementId);
				opts[destinyClassId].push({
					label: name,
					id: id,
					icon: icon,
					name: name,
					element: elementName,
				});
			});
		});
	});
	return opts;
})();

const SubclassSelector = () => {
	const handleChange = (x: any) => {
		console.log(x);
	};

	const selectedCharacterClass = useAppSelector(selectSelectedCharacterClass);

	return (
		selectedCharacterClass && (
			<IconAutocompleteDropdown
				title={'Super Ability'}
				options={options[selectedCharacterClass]}
				value={options[selectedCharacterClass][0]}
				onChange={handleChange}
				getGroupBy={(option: SubclassSelectorOption) => option.element}
				getLabel={(option: SubclassSelectorOption) => option.name}
			/>
		)
	);
};

export default SubclassSelector;
