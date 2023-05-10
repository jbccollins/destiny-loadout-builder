import {
	ArmorStatIdList,
	getArmorStatModSpitFromArmorStatId,
} from '@dlb/types/ArmorStat';
import { StatModCombo } from './getStatModCombosFromDesiredStats';
import { getMod } from '@dlb/types/Mod';
import { isEqual } from 'lodash';

// Filter out mod combos that have the same costs but different mods
export const filterRedundantStatModCombos = (
	combos: StatModCombo[]
): StatModCombo[] => {
	const _combos = [...combos];
	for (let i = 0; i < _combos.length; i++) {
		for (let j = i; j < _combos.length; j++) {
			if (i === j) {
				continue;
			}
			const comboA = _combos[i];
			const comboB = _combos[j];
			// Map costs to counts
			const comboACostMapping: Record<number, number> = {};
			const comboBCostMapping: Record<number, number> = {};
			let comboANumArtifice = 0;
			let comboBNumArtifice = 0;

			let redundant = false;
			for (let k = 0; k < ArmorStatIdList.length; k++) {
				const majorMinorSplit = getArmorStatModSpitFromArmorStatId(
					ArmorStatIdList[k]
				);
				const majorCost = getMod(majorMinorSplit.major).cost;
				const minorCost = getMod(majorMinorSplit.minor).cost;
				if (comboA[ArmorStatIdList[k]]) {
					const { numMajorMods, numMinorMods, numArtificeMods } =
						comboA[ArmorStatIdList[k]];
					comboACostMapping[majorCost] =
						(comboACostMapping[majorCost] || 0) + numMajorMods;
					comboACostMapping[minorCost] =
						(comboACostMapping[minorCost] || 0) + numMinorMods;
					comboANumArtifice += numArtificeMods;
				}
				if (comboB[ArmorStatIdList[k]]) {
					const { numMajorMods, numMinorMods, numArtificeMods } =
						comboB[ArmorStatIdList[k]];
					comboBCostMapping[majorCost] =
						(comboBCostMapping[majorCost] || 0) + numMajorMods;
					comboBCostMapping[minorCost] =
						(comboBCostMapping[minorCost] || 0) + numMinorMods;
					comboBNumArtifice += numArtificeMods;
				}
			}
			if (
				comboANumArtifice <= comboBNumArtifice &&
				isEqual(comboACostMapping, comboBCostMapping)
			) {
				redundant = true;
			}

			if (redundant) {
				console.log('>>>>>> filtered redundant combo');
				_combos.splice(j, 1);
				j--;
			}
		}
	}
	console.log(
		`Removed ${combos.length - _combos.length} redundant combos out of ${
			combos.length
		} total combos`
	);
	return _combos;
};
