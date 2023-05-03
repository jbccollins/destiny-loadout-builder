import { EDestinyClassId } from '@dlb/types/IdEnums';
import { styled } from '@mui/material';
import {
	selectSelectedDestinyClass,
	setSelectedDestinyClass,
} from '@dlb/redux/features/selectedDestinyClass/selectedDestinyClassSlice';
import { selectValidDestinyClassIds } from '@dlb/redux/features/validDestinyClassIds/validDestinyClassIdsSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import IconDropdown from './IconDropdown';
import {
	DestinyClassIdList,
	DestinyClassIdToDestinyClass,
} from '@dlb/types/DestinyClass';
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
	const selectedDestinyClass = useAppSelector(selectSelectedDestinyClass);
	const validDestinyClassIds = useAppSelector(selectValidDestinyClassIds);
	const dispatch = useAppDispatch();

	const getLabel = (option: Option) => option.label;

	const handleChange = (destinyClass: EDestinyClassId) => {
		if (selectedDestinyClass && selectedDestinyClass === destinyClass) {
			// Don't trigger a redux dirty
			return;
		}
		dispatch(setSelectedDestinyClass(destinyClass));
	};

	const options = useMemo(() => {
		return DestinyClassIdList.map((destinyClassId) => {
			const { name, id, icon } =
				DestinyClassIdToDestinyClass.get(destinyClassId);
			return {
				label: name,
				icon: icon,
				id: id,
				disabled: !validDestinyClassIds.includes(destinyClassId),
			};
		});
	}, [validDestinyClassIds]);

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
