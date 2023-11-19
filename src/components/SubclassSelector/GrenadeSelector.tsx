"use client";

import IconDropdown from '@dlb/components/IconDropdown';
import { EGrenadeId } from '@dlb/generated/grenade/EGrenadeId';
import { selectSelectedDestinyClass } from '@dlb/redux/features/selectedDestinyClass/selectedDestinyClassSlice';
import { selectSelectedDestinySubclass } from '@dlb/redux/features/selectedDestinySubclass/selectedDestinySubclassSlice';
import {
	selectSelectedGrenade,
	setSelectedGrenade,
} from '@dlb/redux/features/selectedGrenade/selectedGrenadeSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import {
	getGrenade,
	getGrenadeIdListByDestinySubclassId,
} from '@dlb/types/Grenade';
import { styled } from '@mui/material';
const Container = styled('div')(({ theme }) => ({
	padding: theme.spacing(1),
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
	description: string;
};

function GrenadeSelector() {
	const selectedGrenade = useAppSelector(selectSelectedGrenade);
	const selectedDestinyClass = useAppSelector(selectSelectedDestinyClass);
	const selectedDestinySubclass = useAppSelector(selectSelectedDestinySubclass);
	const destinySubclassId = selectedDestinySubclass[selectedDestinyClass];
	const dispatch = useAppDispatch();

	const getLabel = (option: Option) => option.label;
	const getDescription = (option: Option) => option.description;

	const handleChange = (grenadeId: EGrenadeId) => {
		dispatch(
			setSelectedGrenade({
				...selectedGrenade,
				[destinySubclassId]: grenadeId,
			})
		);
	};

	// TODO: Memoize these options
	const options: Option[] = getGrenadeIdListByDestinySubclassId(
		destinySubclassId
	).map((grenadeId) => {
		const { name, id, icon, description } = getGrenade(grenadeId);
		return {
			label: name,
			icon,
			id,
			description,
		};
	});

	return (
		<>
			<Container>
				<IconDropdownContainer>
					<IconDropdown
						disabled={!destinySubclassId}
						allowNoSelection
						options={options}
						getLabel={getLabel}
						getDescription={getDescription}
						value={selectedGrenade[destinySubclassId] || ''}
						onChange={handleChange}
						title="Grenade"
					/>
				</IconDropdownContainer>
			</Container>
		</>
	);
}

export default GrenadeSelector;
