import { StatList } from '@dlb/types/Armor';
import { EArmorStatId, EDestinyClassId } from '@dlb/types/IdEnums';
import { isEmpty, isEqual, xor } from 'lodash';

export const getDefaultDesiredArmorStats = () => {
	return {
		[EArmorStatId.Mobility]: 0,
		[EArmorStatId.Resilience]: 0,
		[EArmorStatId.Recovery]: 0,
		[EArmorStatId.Discipline]: 0,
		[EArmorStatId.Intellect]: 0,
		[EArmorStatId.Strength]: 0,
	};
};

export const getDefaultStatList = (): StatList => [0, 0, 0, 0, 0, 0];

export const getDefaultDestinyClassId = () => EDestinyClassId.Warlock;

// export function arraysContainTheSameValues(
// 	arr1: string[],
// 	arr2: string[]
// ): boolean {
// 	const sortedArr1 = arr1.sort((a, b) => a.localeCompare(b));
// 	const sortedArr2 = arr2.sort((a, b) => a.localeCompare(b));
// 	return isEqual(sortedArr1, sortedArr2);
// }
