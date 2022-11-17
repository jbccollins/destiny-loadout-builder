import { styled } from '@mui/material';

import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';

import {
	ArmorSlotRestrictionGroup,
	selectSelectedArmorSlotRestrictions,
	setSelectedArmorSlotRestrictions,
} from '@dlb/redux/features/selectedArmorSlotRestrictions/selectedArmorSlotRestrictionsSlice';
import ElementalAffinityDropdown, {
	ElementalAffinityOption,
} from '@dlb/components/ElementalAffinityDropdown';
import ExtraModSlotDropdown from './ExtraModSlotRestrictions';
import StatModCostDropdown from './StatModCostDropdown';
import { EArmorSlotId } from '@dlb/types/IdEnums';
import { ArmorSlotIdList } from '@dlb/types/ArmorSlot';
import { ElementIdList, ElementIdToElement } from '@dlb/types/Element';
const Container = styled('div')(({ theme }) => ({
	padding: theme.spacing(1),
	// paddingRight: 0
}));

const Row = styled('div')(({ theme }) => ({
	display: 'flex',
}));
const OffsetWrapper = styled('div')(({ theme }) => ({
	marginLeft: '-1px',
}));

const elementalAffinityOptions: ElementalAffinityOption[] = ElementIdList.map(
	(elementId) => {
		const { name, icon } = ElementIdToElement.get(elementId);
		return {
			label: name,
			id: elementId,
			icon: icon,
		};
	}
);

function ArmorSlotRestrictions() {
	const selectedArmorSlotRestrictions = useAppSelector(
		selectSelectedArmorSlotRestrictions
	);

	const dispatch = useAppDispatch();

	const handleChange = (
		value: string | number,
		armorSlot: EArmorSlotId,
		restrictionType: keyof ArmorSlotRestrictionGroup
	) => {
		const newSelectedArmorSlotRestrictions = {
			...selectedArmorSlotRestrictions,
			[armorSlot]: {
				...selectedArmorSlotRestrictions[armorSlot],
				[restrictionType]: value,
			},
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
			{ArmorSlotIdList.map((armorSlot) => {
				return (
					<Row
						key={armorSlot}
						sx={{ marginTop: armorSlot === EArmorSlotId.Head ? '' : '-1px' }}
					>
						<ElementalAffinityDropdown
							title={armorSlot === EArmorSlotId.Head ? 'Affinity' : ''}
							selectComponentStyle={{
								borderTopLeftRadius: armorSlot === EArmorSlotId.Head ? '' : 0,
								borderBottomLeftRadius: armorSlot === EArmorSlotId.Leg ? '' : 0,
							}}
							value={selectedArmorSlotRestrictions[armorSlot].element}
							onChange={(value: string) =>
								handleChange(value, armorSlot, 'element')
							}
							options={elementalAffinityOptions}
						/>
						<OffsetWrapper>
							<ExtraModSlotDropdown
								title={armorSlot === EArmorSlotId.Head ? 'Mod Slot' : ''}
								value={selectedArmorSlotRestrictions[armorSlot].extraModSlot}
								onChange={(value: string) =>
									handleChange(value, armorSlot, 'extraModSlot')
								}
							/>
						</OffsetWrapper>
						<OffsetWrapper>
							<StatModCostDropdown
								selectComponentStyle={{
									borderTopRightRadius:
										armorSlot === EArmorSlotId.Head ? '' : 0,
									borderBottomRightRadius:
										armorSlot === EArmorSlotId.Leg ? '' : 0,
								}}
								title={armorSlot === EArmorSlotId.Head ? 'Cost' : ''}
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
