import { selectAvailableExoticArmor } from '@dlb/redux/features/availableExoticArmor/availableExoticArmorSlice';
import { useAppSelector } from '@dlb/redux/hooks';
import { AvailableExoticArmorItem } from '@dlb/types/Armor';
import { DestinyClassIdList } from '@dlb/types/DestinyClass';
import { useMemo } from 'react';

export default function useFlatAvailableExoticArmor() {
	const availableExoticArmor = useAppSelector(selectAvailableExoticArmor);
	const flatAvailableExoticArmor: AvailableExoticArmorItem[] = useMemo(() => {
		let flatAvailableExoticArmor: AvailableExoticArmorItem[] = [];
		DestinyClassIdList.forEach((destinyClassId) => {
			Object.values(availableExoticArmor[destinyClassId]).forEach((x) => {
				flatAvailableExoticArmor = flatAvailableExoticArmor.concat(x);
			});
		});

		return flatAvailableExoticArmor;
	}, [availableExoticArmor]);
	return flatAvailableExoticArmor;
}
