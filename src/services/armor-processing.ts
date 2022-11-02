import { ArmorStatOrder, DesiredArmorStats } from './data';

export type ArmorItem = {
	id: number;
	// Mobility, Resilience, Recovery, Discipline, Intellect, Strength
	stats: [number, number, number, number, number, number];
};
// Helmets, Gauntlets, Chest Armors, Leg Armors
export type ArmorItems = [ArmorItem[], ArmorItem[], ArmorItem[], ArmorItem[]];

// Four armor ids [Helmet, Gauntlet, Chest, Leg]
export type ProcessArmorOutput = [number, number, number, number][];

export type ProcessArmorParams = {
	desiredArmorStats: DesiredArmorStats;
	armorItems: ArmorItems;
};

export const processArmor = ({
	desiredArmorStats,
	armorItems
}: ProcessArmorParams): ProcessArmorOutput => {
	const [helmets, gauntlets, chestArmors, legArmors] = armorItems;
	const output: ProcessArmorOutput = [];
	helmets.forEach((helmet) => {
		gauntlets.forEach((gauntlet) => {
			chestArmors.forEach((chestArmor) => {
				legArmors.forEach((legArmor) => {
					ArmorStatOrder.forEach((stat, i) => {
						if (
							desiredArmorStats[stat] <
							helmet[i] + gauntlet[i] + chestArmor[i] + legArmor[i]
						) {
							output.push([helmet.id, gauntlet.id, chestArmor.id, legArmor.id]);
						}
					});
				});
			});
		});
	});
	return output;
};
