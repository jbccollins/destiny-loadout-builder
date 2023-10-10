import { EModId } from '@dlb/generated/mod/EModId';
import { ArmorStatAndRaidModComboPlacement } from '@dlb/services/processArmor/getModCombos';
import { ArmorItem, AvailableExoticArmorItem } from '@dlb/types/Armor';
import { EMPTY_SOCKET_TEXT, MISSING_ICON } from '@dlb/types/globals';
import { ArmorSlotIdToModIdListMapping, getMod } from '@dlb/types/Mod';
import { Box } from '@mui/material';
import { useMemo } from 'react';
import CustomTooltip from '../CustomTooltip';
import ModPlacement from '../ModPlacement';
import { Socket } from '../Socket';

type ModDetailsProps = {
	artificeModIdList: EModId[];
	armorSlotMods: ArmorSlotIdToModIdListMapping;
	raidModIdList: EModId[];
	armorItems: ArmorItem[];
	modPlacement: ArmorStatAndRaidModComboPlacement;
	exoticArmorItem: AvailableExoticArmorItem;
	armorStatModIdList: EModId[];
};
export default function ModDetails(props: ModDetailsProps) {
	const { artificeModIdList, raidModIdList, armorStatModIdList } = props;

	const _raidModIdList = useMemo(() => {
		return raidModIdList.filter((modId) => modId != null);
	}, [raidModIdList]);

	return (
		<Box>
			<Box sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>
				Armor Slot Mods
			</Box>
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
			{armorStatModIdList.length > 0 && (
				<Box sx={{ marginTop: '8px' }}>
					<Box
						sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}
					>
						Armor Stat Mods
					</Box>
					<Box sx={{ display: 'flex', gap: '4px' }}>
						{armorStatModIdList.map((modId, i) => {
							const mod = getMod(modId) || { name: null, icon: null };
							return (
								<Box key={i}>
									<CustomTooltip title={mod.name || EMPTY_SOCKET_TEXT}>
										<Box className="armor-stat-mod-socket">
											<Socket getIcon={() => mod.icon || MISSING_ICON} />
										</Box>
									</CustomTooltip>
								</Box>
							);
						})}
					</Box>
				</Box>
			)}
			{artificeModIdList.length > 0 && (
				<Box sx={{ marginTop: '8px' }}>
					<Box
						sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}
					>
						Artifice Mods
					</Box>
					<Box sx={{ display: 'flex', gap: '4px' }}>
						{artificeModIdList.map((modId, i) => {
							const mod = getMod(modId) || { name: null, icon: null };
							return (
								<Box key={i}>
									<CustomTooltip title={mod.name || EMPTY_SOCKET_TEXT}>
										<Box className="artifice-mod-socket">
											<Socket getIcon={() => mod.icon || MISSING_ICON} />
										</Box>
									</CustomTooltip>
								</Box>
							);
						})}
					</Box>
				</Box>
			)}
			{_raidModIdList.length > 0 && (
				<Box sx={{ marginTop: '8px' }}>
					<Box
						sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}
					>
						Raid Mods
					</Box>
					<Box sx={{ display: 'flex', gap: '4px' }}>
						{_raidModIdList.map((modId, i) => {
							const mod = getMod(modId) || { name: null, icon: null };
							return (
								<Box key={i}>
									<CustomTooltip title={mod.name || EMPTY_SOCKET_TEXT}>
										<Box className="raid-mod-socket">
											<Socket getIcon={() => mod.icon || MISSING_ICON} />
										</Box>
									</CustomTooltip>
								</Box>
							);
						})}
					</Box>
				</Box>
			)}
		</Box>
	);
}
