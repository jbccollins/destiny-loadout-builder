import { EModId } from '@dlb/generated/mod/EModId';
import { EDestinyClassId } from '@dlb/types/IdEnums';
import { MajorStatModIdList } from '@dlb/types/Mod';
import combinations from '@dlb/utils/combinations';
import { replaceMajorModsWithMinorMods } from './utils';
import { ExpandedStatModCombo } from './getAllStatModCombos'; // TODO: I think this is a circular import

const _extrapolateMajorModsIntoMinorMods = (
	armorStatModIdList: EModId[],
	destinyClassId: EDestinyClassId
): EModId[][] => {
	const result: EModId[][] = [];
	const unusedModSlots = 5 - armorStatModIdList.length;
	if (unusedModSlots === 0) {
		// There is no space to turn a major mod into two minor mods
		return;
	}
	// Since major mods can be swapped out for two minor mods we only have to care about
	// two cases. The case where there is only one unusedModSlot and the case where there
	// are more than one unusedModSlots. If there two - three unusedModSlots it's all the same
	// logic since no matter what, we can't convert three major mods into six minor mods.
	/*
	Logic: If there are x major mods => extrapolate to these combos
	1 => two minor
	2 => every unique major mod gets two minor mods; and if there are two+ unused mod slots add on the four minor mods 
	3 => every unique major mod gets a two minor mods; and if there are two+ unused mod slots every unique combination of two major mods gets two minor mods each 
	4 => every unique major mod gets a minor mod 
	*/
	const majorStatModIdList = armorStatModIdList.filter((x) =>
		MajorStatModIdList.includes(x)
	);
	if (majorStatModIdList.length === 0) {
		return;
	}
	const singleMajorStatModCombos = combinations(majorStatModIdList, 1);
	singleMajorStatModCombos.forEach((combo) => {
		const _armorStatModIdList = [...armorStatModIdList];
		replaceMajorModsWithMinorMods(_armorStatModIdList, combo, destinyClassId);
		result.push(_armorStatModIdList);
	});
	if (
		unusedModSlots > 1 &&
		majorStatModIdList.length > 1 &&
		majorStatModIdList.length < 4
	) {
		const duoMajorStatModCombos = combinations(majorStatModIdList, 2);
		duoMajorStatModCombos.forEach((combo) => {
			const _armorStatModIdList = [...armorStatModIdList];
			replaceMajorModsWithMinorMods(_armorStatModIdList, combo, destinyClassId);
			result.push(_armorStatModIdList);
		});
	}
	return result;
	// return uniqWith(result, isEqual);
};

// TODO: _extrapolateMajorModsIntoMinorMods can be combined into this function.
// Initially they were separate because I thought _extrapolateMajorModsIntoMinorMods
// would be recursive
export const getExtrapolatedStatModCombos = (
	statModComboList: ExpandedStatModCombo[],
	destinyClassId: EDestinyClassId
): ExpandedStatModCombo[] => {
	// The existing combos are valid and must be considered
	const results: ExpandedStatModCombo[] = [...statModComboList];
	// Any combo that has at least one open mod slot and at least
	// one major mod can be extrapolated
	statModComboList
		.filter(
			(statModCombo) =>
				statModCombo.armorStatModIdList.length < 5 &&
				statModCombo.armorStatModIdList.findIndex((x) =>
					MajorStatModIdList.includes(x)
				) >= 0
		)
		.forEach(({ armorStatModIdList, artificeModIdList }) => {
			const extrapolatedArmorStatModIdLists =
				_extrapolateMajorModsIntoMinorMods(armorStatModIdList, destinyClassId);
			extrapolatedArmorStatModIdLists.forEach(
				(extrapolatedArmorStatModIdList) => {
					results.push({
						armorStatModIdList: extrapolatedArmorStatModIdList,
						artificeModIdList,
					});
				}
			);
		});
	return results;
};
