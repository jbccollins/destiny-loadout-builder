import { EModId } from '@dlb/generated/mod/EModId';
import { cloneDeep } from 'lodash';
import { ArmorSlotWithClassItemIdList } from './ArmorSlot';
import { EArmorSlotId } from './IdEnums';
import {
	ArmorSlotIdToArmorSlotModIdListMapping,
	ArmorSlotIdToModIdListMapping,
	getMod,
} from './Mod';

export enum EModViolationSeverity {
	Invalid = 'Invalid',
	Dangerous = 'Dangerous',
	Warning = 'Warning',
}

export type ModViolation = {
	severity: EModViolationSeverity;
	text: string;
};

// {
// 	head: {
// 		0: {
// 			HCTargeting: ModViolation[]
// 		}
// 	}
// }

const similarModsViolation: ModViolation = {
	severity: EModViolationSeverity.Invalid,
	text: 'Similar mod already applied',
};

export type ArmorSlotModViolations = Record<
	EArmorSlotId,
	Record<number, Partial<Record<EModId, ModViolation[]>>>
>;

const DefaultArmorSlotModViolations: ArmorSlotModViolations = {
	[EArmorSlotId.Head]: {},
	[EArmorSlotId.Arm]: {},
	[EArmorSlotId.Chest]: {},
	[EArmorSlotId.Leg]: {},
	[EArmorSlotId.ClassItem]: {},
};

export const getDefaultArmorSlotModViolations = (): ArmorSlotModViolations =>
	cloneDeep(DefaultArmorSlotModViolations);

export const getArmorSlotModViolations = (
	armorSlotMods: ArmorSlotIdToModIdListMapping
): ArmorSlotModViolations => {
	const violations: ArmorSlotModViolations = getDefaultArmorSlotModViolations();
	ArmorSlotWithClassItemIdList.forEach((armorSlotId) => {
		const slotIndices = armorSlotMods[armorSlotId].map((_, i) => i);
		for (let i = 0; i < armorSlotMods[armorSlotId].length; i++) {
			const modId = armorSlotMods[armorSlotId][i];
			if (modId === null) {
				continue;
			}
			const otherSlotIndices = [...slotIndices].filter((x) => x !== i);
			const armorSlotModIds =
				ArmorSlotIdToArmorSlotModIdListMapping[armorSlotId];
			const mod = getMod(modId);
			if (!mod.similarModsAllowed) {
				console.log('>>> indices', i, otherSlotIndices, slotIndices);
				armorSlotModIds.forEach((otherModId) => {
					if (otherModId === modId) {
						console.log('>>> VIOLATION');
						// TODO: Expand this to actually similar mods, not just equal mods
						otherSlotIndices.forEach((index) => {
							if (!violations[armorSlotId][index]) {
								violations[armorSlotId][index] = {};
							}
							violations[armorSlotId][index][otherModId] = [
								similarModsViolation,
							];
						});
					}
				});
			}
		}
	});

	return violations;
};
