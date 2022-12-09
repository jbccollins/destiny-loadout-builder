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
		dispatch(
			setSelectedArmorSlotRestrictions(newSelectedArmorSlotRestrictions)
		);
	};

	/*
  TODO: Rethink this section
	I think it makes sense to have four dropdowns
	1. Max StatMod Cost
	2. ArmorSlotMod Dropdown 1 (stuff like Bomber, scavenger etc) // Be careful about not allowing both slots to contain the same mod if multiple copies of the mod have no effect
	3. ArmorSlotMod Dropdown 2
	4. Special Mod Type (Perhaps this would be better as showing the actual special mods but I don't think so)

	Combat Style mods will be their own MultiSelect dropdown. We don't want to force
	Combat Style mods onto a specific slot of armor since they are slot agnostic
	and that has the potential to lead to less than optimal stat distributions
	
	We can always know if a combat style mod will be able to fit on any of the armor pieces based on
	total energy cost of all selected mods and elemental affinity.
	(TODO: this might be a bit tricky to figure out since we have three "unknowns" at processing time:
	1. Which StatMod are we going to need
	2. Which slot with the afformentioned StatMods go in?
	3. Which slot will each combat style mod go in

	// Maybe we can get away with the sorting method of lowest to highest described in
	// StatModCostDropdown.tsx. Applying that logic to total armor energy cost instead of
	// to the required mods
	)
 */

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
						{/* <ElementalAffinityDropdown
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
						/> */}
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
