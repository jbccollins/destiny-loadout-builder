import {
	selectSelectedIntrinsicArmorPerkOrAttributeIds,
	setSelectedIntrinsicArmorPerkOrAttributeIds,
} from '@dlb/redux/features/selectedIntrinsicArmorPerkOrAttributeIds/selectedIntrinsicArmorPerkOrAttributeIdsSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { EIntrinsicArmorPerkOrAttributeId } from '@dlb/types/IdEnums';
import {
	IIntrinsicArmorPerkOrAttribute,
	getIntrinsicArmorPerkOrAttribute,
	intrinsicArmorPerkOrAttributeIdList,
} from '@dlb/types/IntrinsicArmorPerkOrAttribute';
import { MISSING_ICON } from '@dlb/types/globals';
import { Box, styled } from '@mui/material';
import IconAutocompleteDropdown from './IconAutocompleteDropdown';

const Container = styled('div')(({ theme }) => ({
	padding: theme.spacing(1),
}));

// type Option = {
// 	id: string;
// 	disabled?: boolean;
// 	icon: string;
// 	description: string;
// 	groupName: string;
// 	name: string;
// };

// const options = intrinsicArmorPerkOrAttributeIdList.map(
// 	(intrinsicArmorPerkOrAttributeId) => {
// 		const { id, description, icon, name, groupName } =
// 			getIntrinsicArmorPerkOrAttribute(intrinsicArmorPerkOrAttributeId);
// 		return {
// 			name,
// 			icon,
// 			id,
// 			description,
// 			groupName,
// 		};
// 	}
// );

const placeholderOption: IIntrinsicArmorPerkOrAttribute = {
	name: 'None Selected...',
	id: null,
	icon: MISSING_ICON,
	description: '',
	armorSlotId: null,
	groupName: null,
};

const options = [
	placeholderOption,
	...intrinsicArmorPerkOrAttributeIdList.map((x) =>
		getIntrinsicArmorPerkOrAttribute(x)
	),
];

type IntrinsicArmorPerkOrAttributeDropdownProps = {
	valueId: EIntrinsicArmorPerkOrAttributeId;
	onChange: (value: IIntrinsicArmorPerkOrAttribute) => void;
};
function IntrinsicArmorPerkOrAttributeDropdown({
	valueId,
	onChange,
}: IntrinsicArmorPerkOrAttributeDropdownProps) {
	return (
		<>
			<Container>
				<Box>
					<IconAutocompleteDropdown
						options={options}
						value={
							valueId
								? getIntrinsicArmorPerkOrAttribute(valueId)
								: placeholderOption
						}
						title={''}
						// value={selectedExoticArmor[selectedDestinyClass]}
						onChange={onChange}
						getId={(option: IIntrinsicArmorPerkOrAttribute) => option.id}
						getGroupBy={(option: IIntrinsicArmorPerkOrAttribute) =>
							option.groupName
						}
						getDescription={(option: IIntrinsicArmorPerkOrAttribute) =>
							option.description
						}
						getLabel={(option: IIntrinsicArmorPerkOrAttribute) => option.name}
					/>
				</Box>
			</Container>
		</>
	);
}

function IntrinsicArmorPerkOrAttributeSelector() {
	const dispatch = useAppDispatch();
	const selectedIntrinsicArmorPerkOrAttributeIds = useAppSelector(
		selectSelectedIntrinsicArmorPerkOrAttributeIds
	);
	const handleChange = (
		index: number,
		value: IIntrinsicArmorPerkOrAttribute
	) => {
		const res = [
			...selectedIntrinsicArmorPerkOrAttributeIds,
		] as EIntrinsicArmorPerkOrAttributeId[];
		res[index] = value.id;
		dispatch(setSelectedIntrinsicArmorPerkOrAttributeIds(res));
	};
	return (
		<>
			<Box>
				{[0, 1, 2, 3].map((x) => {
					return (
						<IntrinsicArmorPerkOrAttributeDropdown
							key={x}
							valueId={selectedIntrinsicArmorPerkOrAttributeIds[x]}
							onChange={(value: IIntrinsicArmorPerkOrAttribute) => {
								handleChange(x, value);
							}}
						/>
					);
				})}
			</Box>
		</>
	);
}

export default IntrinsicArmorPerkOrAttributeSelector;
