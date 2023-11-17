'use client';

import {
	selectSelectedIntrinsicArmorPerkOrAttributeIds,
	setSelectedIntrinsicArmorPerkOrAttributeIds,
} from '@dlb/redux/features/selectedIntrinsicArmorPerkOrAttributeIds/selectedIntrinsicArmorPerkOrAttributeIdsSlice';
import { selectSelectedRaidMods } from '@dlb/redux/features/selectedRaidMods/selectedRaidModsSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { EIntrinsicArmorPerkOrAttributeId } from '@dlb/types/IdEnums';
import {
	IIntrinsicArmorPerkOrAttribute,
	getIntrinsicArmorPerkOrAttribute,
	intrinsicArmorPerkOrAttributeIdList,
} from '@dlb/types/IntrinsicArmorPerkOrAttribute';
import { MISSING_ICON } from '@dlb/types/globals';
import { Box } from '@mui/material';
import IconAutocompleteDropdown from './IconAutocompleteDropdown';

const placeholderOption: IIntrinsicArmorPerkOrAttribute = {
	name: 'None Selected...',
	id: null,
	icon: MISSING_ICON,
	description: '',
	armorSlotId: null,
	groupName: null,
	abbreviation: null,
};

const options = intrinsicArmorPerkOrAttributeIdList.map((x) =>
	getIntrinsicArmorPerkOrAttribute(x)
);

type IntrinsicArmorPerkOrAttributeDropdownProps = {
	valueId: EIntrinsicArmorPerkOrAttributeId;
	onChange: (value: IIntrinsicArmorPerkOrAttribute) => void;
	index: number;
	disabled?: boolean;
	otherIds: EIntrinsicArmorPerkOrAttributeId[];
};
function IntrinsicArmorPerkOrAttributeDropdown({
	valueId,
	onChange,
	index,
	disabled,
	otherIds,
}: IntrinsicArmorPerkOrAttributeDropdownProps) {
	const first = index === 0;
	const last = index === 3;
	let _options = options.map((x) => {
		const attribute = getIntrinsicArmorPerkOrAttribute(x.id);
		// Don't allow duplicates of the same attribute when it's
		// specific to an armor slot, e.g. GG class item and FotL mask
		if (otherIds.includes(x.id) && attribute.armorSlotId !== null) {
			return {
				...x,
				disabled: true,
			};
		}
		return x;
	});
	_options = [placeholderOption, ..._options];

	return (
		<>
			<Box sx={{ paddingLeft: '8px', paddingRight: '8px' }}>
				<IconAutocompleteDropdown
					options={_options as IIntrinsicArmorPerkOrAttribute[]}
					value={
						valueId
							? getIntrinsicArmorPerkOrAttribute(valueId)
							: placeholderOption
					}
					title={''}
					// value={selectedExoticArmor[selectedDestinyClass]}
					onChange={onChange}
					getId={(option: IIntrinsicArmorPerkOrAttribute) => option.id || ''}
					getGroupBy={(option: IIntrinsicArmorPerkOrAttribute) =>
						option.groupName || ''
					}
					getDescription={
						(option: IIntrinsicArmorPerkOrAttribute) => option.description || '' // Ensure string is returned
					}
					getLabel={(option: IIntrinsicArmorPerkOrAttribute) => option.name}
					textFieldClassName={`intrinsic-armor-perk-or-attribute-selector-text-field ${
						first ? 'first' : last ? 'last' : ''
					}`}
					disabled={disabled}
				/>
			</Box>
		</>
	);
}

function IntrinsicArmorPerkOrAttributeSelector() {
	const dispatch = useAppDispatch();
	const selectedIntrinsicArmorPerkOrAttributeIds = useAppSelector(
		selectSelectedIntrinsicArmorPerkOrAttributeIds
	);

	const selectedRaidMods = useAppSelector(selectSelectedRaidMods);
	const numSelectedRaidMods = selectedRaidMods.filter((x) => x !== null).length;
	const disabledIndices =
		numSelectedRaidMods > 0
			? selectedIntrinsicArmorPerkOrAttributeIds
					.map((x, i) => (x === null ? i : null))
					.filter((x) => x !== null)
					.slice(-1 * numSelectedRaidMods)
			: [];

	const handleChange = (
		index: number,
		value: IIntrinsicArmorPerkOrAttribute
	) => {
		const res = [
			...selectedIntrinsicArmorPerkOrAttributeIds,
		] as EIntrinsicArmorPerkOrAttributeId[];
		res[index] = value.id as EIntrinsicArmorPerkOrAttributeId;
		dispatch(setSelectedIntrinsicArmorPerkOrAttributeIds(res));
	};

	return (
		<>
			<Box>
				{selectedIntrinsicArmorPerkOrAttributeIds.map((x, i) => {
					return (
						<IntrinsicArmorPerkOrAttributeDropdown
							otherIds={selectedIntrinsicArmorPerkOrAttributeIds.filter(
								(_, j) => j !== i
							)}
							key={i}
							index={i}
							valueId={x}
							onChange={(value: IIntrinsicArmorPerkOrAttribute) => {
								handleChange(i, value);
							}}
							disabled={disabledIndices.includes(i)}
						/>
					);
				})}
			</Box>
		</>
	);
}

export default IntrinsicArmorPerkOrAttributeSelector;
