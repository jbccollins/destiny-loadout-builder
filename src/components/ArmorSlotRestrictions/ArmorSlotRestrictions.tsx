import BungieImage from '@dlb/dim/dim-ui/BungieImage';
import { ArmorSlots, EArmorSlot, EDestinyClass } from '@dlb/services/data';
import {
	Box,
	styled,
	Card,
	capitalize,
	Typography,
	SxProps,
	Theme
} from '@mui/material';
import {
	selectSelectedCharacterClass,
	setSelectedCharacterClass
} from '@dlb/redux/features/selectedCharacterClass/selectedCharacterClassSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { useCallback, useEffect, useMemo } from 'react';
import { selectCharacters } from '@dlb/redux/features/characters/charactersSlice';
import IconDropdown from '../IconDropdown';
import {
	ArmorSlotRestrictionGroup,
	selectSelectedArmorSlotRestrictions,
	setSelectedArmorSlotRestrictions
} from '@dlb/redux/features/selectedArmorSlotRestrictions/selectedArmorSlotRestrictionsSlice';
import ElementalAffinityDropdown from './ElementalAffinityDropdown';
import ExtraModSlotDropdown from './ExtraModSlotRestrictions';
import StatModCostDropdown from './StatModCostDropdown';
const Container = styled('div')(({ theme }) => ({
	padding: theme.spacing(1)
	// paddingRight: 0
}));

const Row = styled('div')(({ theme }) => ({
	display: 'flex'
}));
const OffsetWrapper = styled('div')(({ theme }) => ({
	marginLeft: '-1px'
}));

function ArmorSlotRestrictions() {
	const selectedArmorSlotRestrictions = useAppSelector(
		selectSelectedArmorSlotRestrictions
	);

	const dispatch = useAppDispatch();

	const handleChange = (
		value: string | number,
		armorSlot: EArmorSlot,
		restrictionType: keyof ArmorSlotRestrictionGroup
	) => {
		const newSelectedArmorSlotRestrictions = {
			...selectedArmorSlotRestrictions,
			[armorSlot]: {
				...selectedArmorSlotRestrictions[armorSlot],
				[restrictionType]: value
			}
		};
		// newSelectedArmorSlotRestrictions[armorSlot][restrictionType] = value;
		console.log(value);
		dispatch(
			setSelectedArmorSlotRestrictions(newSelectedArmorSlotRestrictions)
		);
	};

	// TODO: Let's filter out the available extra mod slots. Some people don't have artifice armor for example
	// This would need to change every time the selected character class changes
	return (
		<Container>
			{ArmorSlots.map((armorSlot) => {
				return (
					<Row
						key={armorSlot}
						sx={{ marginTop: armorSlot === EArmorSlot.Head ? '' : '-1px' }}
					>
						<ElementalAffinityDropdown
							title={armorSlot === EArmorSlot.Head ? 'Affinity' : ''}
							selectComponentStyle={{
								borderTopLeftRadius: armorSlot === EArmorSlot.Head ? '' : 0,
								borderBottomLeftRadius: armorSlot === EArmorSlot.Leg ? '' : 0
							}}
							value={selectedArmorSlotRestrictions[armorSlot].elementalAffinity}
							onChange={(value: string) =>
								handleChange(value, armorSlot, 'elementalAffinity')
							}
						/>
						<OffsetWrapper>
							<ExtraModSlotDropdown
								title={armorSlot === EArmorSlot.Head ? 'Mod Slot' : ''}
								value={selectedArmorSlotRestrictions[armorSlot].extraModSlot}
								onChange={(value: string) =>
									handleChange(value, armorSlot, 'extraModSlot')
								}
							/>
						</OffsetWrapper>
						<OffsetWrapper>
							<StatModCostDropdown
								selectComponentStyle={{
									borderTopRightRadius: armorSlot === EArmorSlot.Head ? '' : 0,
									borderBottomRightRadius: armorSlot === EArmorSlot.Leg ? '' : 0
								}}
								title={armorSlot === EArmorSlot.Head ? 'Cost' : ''}
								value={selectedArmorSlotRestrictions[armorSlot].maxStatModCost}
								onChange={(value: number) =>
									handleChange(value, armorSlot, 'maxStatModCost')
								}
							/>
						</OffsetWrapper>
					</Row>
				);
			})}
		</Container>
	);
}

export default ArmorSlotRestrictions;
