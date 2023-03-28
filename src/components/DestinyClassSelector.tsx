import { EDestinyClassId } from '@dlb/types/IdEnums';
import { styled } from '@mui/material';
import {
	selectSelectedDestinyClass,
	setSelectedDestinyClass,
} from '@dlb/redux/features/selectedDestinyClass/selectedDestinyClassSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import IconDropdown from './IconDropdown';
import {
	DestinyClassIdList,
	DestinyClassIdToDestinyClass,
} from '@dlb/types/DestinyClass';
import { selectAvailableExoticArmor } from '@dlb/redux/features/availableExoticArmor/availableExoticArmorSlice';
import { ArmorSlotIdList } from '@dlb/types/ArmorSlot';
import { useMemo } from 'react';
const Container = styled('div')(({ theme }) => ({
	// padding: theme.spacing(1),
	// paddingRight: 0
}));

const IconDropdownContainer = styled('div')(({ theme }) => ({
	//
}));

type Option = {
	label: string;
	id: string;
	disabled?: boolean;
	icon: string;
};

function DestinyClassSelector() {
	const availableExoticArmor = useAppSelector(selectAvailableExoticArmor);
	const selectedDestinyClass = useAppSelector(selectSelectedDestinyClass);
	const dispatch = useAppDispatch();

	const getLabel = (option: Option) => option.label;

	const handleChange = (destinyClass: EDestinyClassId) => {
		if (selectedDestinyClass && selectedDestinyClass === destinyClass) {
			// Don't trigger a redux dirty
			return;
		}
		dispatch(setSelectedDestinyClass(destinyClass));
	};

	// This will be used to disable any classes that have no exotic armor.
	// TOOD: Also disable classes that don't have enough legendary/rare armor
	// to make a full loadout
	// TODO: What happens if the user has no exotic for any class?
	const hasExoticArmor: Record<EDestinyClassId, boolean> = useMemo(() => {
		console.log('>>>>>>>>>>> [Memo] hasExoticArmor calcuated <<<<<<<<<<<');
		const res: Record<EDestinyClassId, boolean> = {
			[EDestinyClassId.Hunter]: false,
			[EDestinyClassId.Warlock]: false,
			[EDestinyClassId.Titan]: false,
		};
		if (availableExoticArmor) {
			DestinyClassIdList.forEach((destinyClassId) => {
				ArmorSlotIdList.forEach((armorSlotId) => {
					if (availableExoticArmor[destinyClassId][armorSlotId].length > 0) {
						res[destinyClassId] = true;
					}
				});
			});
		}
		return res;
	}, [availableExoticArmor]);

	const options = useMemo(() => {
		return DestinyClassIdList.map((destinyClassId) => {
			const { name, id, icon } =
				DestinyClassIdToDestinyClass.get(destinyClassId);
			return {
				label: name,
				icon: icon,
				id: id,
				disabled: !hasExoticArmor[destinyClassId],
			};
		});
	}, [hasExoticArmor]);

	return (
		<>
			<Container>
				<IconDropdownContainer>
					<IconDropdown
						hideSelectedOptionText={true}
						selectComponentProps={{
							sx: {
								maxWidth: 100,
								borderTopRightRadius: 0,
								borderBottomRightRadius: 0,
							},
						}}
						options={options}
						getLabel={getLabel}
						value={selectedDestinyClass || ''}
						onChange={handleChange}
						title="Class"
					/>
				</IconDropdownContainer>
			</Container>
		</>
	);
}

export default DestinyClassSelector;
