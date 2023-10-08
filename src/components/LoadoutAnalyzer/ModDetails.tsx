import { EModId } from '@dlb/generated/mod/EModId';
import { ArmorStatAndRaidModComboPlacement } from '@dlb/services/processArmor/getModCombos';
import { ArmorItem, AvailableExoticArmorItem } from '@dlb/types/Armor';
import { ArmorSlotIdToModIdListMapping } from '@dlb/types/Mod';
import ModPlacement from '../ModPlacement';

type ModDetailsProps = {
	artificeModIdList: EModId[];
	armorSlotMods: ArmorSlotIdToModIdListMapping;
	raidModIdList: EModId[];
	armorItems: ArmorItem[];
	modPlacement: ArmorStatAndRaidModComboPlacement;
	exoticArmorItem: AvailableExoticArmorItem;
};
export default function ModDetails(props: ModDetailsProps) {
	return (
		<ModPlacement
			exoticArmorItem={props.exoticArmorItem}
			modPlacement={props.modPlacement}
			artificeModIdList={props.artificeModIdList}
			armorItems={props.armorItems}
			classItem={null}
			armorSlotMods={props.armorSlotMods}
			onlyShowArmorSlotMods
			withArmorItemIcons
		/>
	);
}
