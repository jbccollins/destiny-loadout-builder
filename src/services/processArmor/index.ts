import { EModId } from '@dlb/generated/mod/EModId';
import {
	StrictArmorItems,
	ArmorMetadataItem,
	AvailableExoticArmorItem,
	StatList,
	ArmorIdList,
	ArmorItems,
	ArmorGroup,
	ISelectedExoticArmor,
} from '@dlb/types/Armor';
import {
	ArmorStatIdList,
	ArmorStatMapping,
	getArmorStatMappingFromMods,
	getDefaultArmorStatMapping,
	sumArmorStatMappings,
} from '@dlb/types/ArmorStat';
import {
	EMasterworkAssumption,
	EDestinyClassId,
	EExtraSocketModCategoryId,
	EDimLoadoutsFilterId,
	EGearTierId,
	EArmorStatId,
	EArmorSlotId,
} from '@dlb/types/IdEnums';
import {
	PotentialRaidModArmorSlotPlacement,
	ArmorSlotIdToModIdListMapping,
	getMod,
} from '@dlb/types/Mod';
import {
	getArmorStatMappingFromArtificeModIdList,
	getArmorStatMappingFromStatList,
	getExtraSumOfSeenStats,
	getNextValues,
	getSeenArmorSlotItemsFromClassItems,
	getStatListFromArmorStatMapping,
	getTotalModCost,
	getTotalStatTiers,
	getWastedStats,
	sumStatLists,
} from './utils';
import { SeenArmorSlotItems } from './seenArmorSlotItems';
import {
	ArmorStatAndRaidModComboPlacement,
	getModCombos,
} from './getModCombos';
import { Loadout } from '@destinyitemmanager/dim-api-types';
import {
	ArmorSlotIdList,
	ArmorSlotWithClassItemIdList,
} from '@dlb/types/ArmorSlot';
import { isEqual, max } from 'lodash';

const _processArmorRecursiveCase = ({
	desiredArmorStats,
	armorItems,
	sumOfSeenStats,
	seenArmorIds,
	masterworkAssumption,
	potentialRaidModArmorSlotPlacements,
	armorSlotMods,
	raidMods,
	destinyClassId,
	armorMetadataItem,
	specialSeenArmorSlotItems,
	selectedExotic,
	reservedArmorSlotEnergy,
}: ProcessArmorParams): ProcessArmorOutput => {
	const [armorSlotItems, ...rest] = armorItems;
	const output: ProcessArmorOutput[] = [];
	armorSlotItems.forEach((armorSlotItem) => {
		const {
			nextSumOfSeenStats,
			nextSeenArmorSlotItems: nextSpecialSeenArmorSlotItems,
		} = getNextValues({
			numArmorItems: rest.length,
			seenArmorSlotItems: specialSeenArmorSlotItems,
			sumOfSeenStats,
			armorSlotItem,
			masterworkAssumption,
		});

		output.push(
			processArmor({
				desiredArmorStats,
				armorItems: rest,
				sumOfSeenStats: nextSumOfSeenStats,
				seenArmorIds: [...seenArmorIds, armorSlotItem.id],
				masterworkAssumption,
				potentialRaidModArmorSlotPlacements,
				armorSlotMods,
				raidMods,
				destinyClassId,
				armorMetadataItem,
				specialSeenArmorSlotItems: nextSpecialSeenArmorSlotItems,
				selectedExotic,
				reservedArmorSlotEnergy,
			})
		);
	});
	// TODO: Can we find a way to not have to do this flattening?
	return output.flat(1);
};

const _processArmorBaseCase = ({
	desiredArmorStats,
	armorItems,
	sumOfSeenStats,
	seenArmorIds,
	masterworkAssumption,
	potentialRaidModArmorSlotPlacements,
	armorSlotMods,
	raidMods,
	destinyClassId,
	armorMetadataItem,
	specialSeenArmorSlotItems,
	selectedExotic,
	reservedArmorSlotEnergy,
}: ProcessArmorParams): ProcessArmorOutput => {
	const [armorSlotItems] = armorItems;
	const output: ProcessArmorOutput = [];
	armorSlotItems.forEach((armorSlotItem) => {
		const {
			nextSumOfSeenStats: finalSumOfSeenStats,
			nextSeenArmorSlotItems: finalSpecialSeenArmorSlotItems,
		} = getNextValues({
			numArmorItems: 0,
			seenArmorSlotItems: specialSeenArmorSlotItems,
			sumOfSeenStats,
			armorSlotItem,
			masterworkAssumption,
		});
		const armorIdList = [...seenArmorIds, armorSlotItem.id] as ArmorIdList;

		const modCombos = getModCombos({
			sumOfSeenStats: finalSumOfSeenStats,
			desiredArmorStats,
			potentialRaidModArmorSlotPlacements,
			armorSlotMods,
			raidMods,
			destinyClassId,
			specialSeenArmorSlotItems: finalSpecialSeenArmorSlotItems,
			reservedArmorSlotEnergy,
		});

		if (modCombos === null) {
			return;
		}
		// TODO: Change this based on what the user prioritizes
		const placement = modCombos.lowestCostPlacement;

		const requiredArmorStatModIdList = placement
			? getModIdListFromArmorStatAndRaidModComboPlacement(placement.placement)
			: [];

		const requiredArtificeModIdList = placement
			? placement.artificeModIdList
			: [];

		const baseArmorStatMapping =
			getArmorStatMappingFromStatList(finalSumOfSeenStats);
		const totalArmorStatMapping = sumArmorStatMappings([
			baseArmorStatMapping,
			getArmorStatMappingFromMods(requiredArmorStatModIdList, destinyClassId),
			getArmorStatMappingFromArtificeModIdList(requiredArtificeModIdList),
		]);
		output.push({
			armorIdList,
			armorStatModIdList: requiredArmorStatModIdList,
			artificeModIdList: requiredArtificeModIdList,
			requiredClassItemExtraModSocketCategoryId:
				modCombos.requiredClassItemExtraModSocketCategoryId,
			maximumSingleStatValues: modCombos.maximumSingleStatValues,
			metadata: {
				totalModCost: getTotalModCost(requiredArmorStatModIdList),
				totalStatTiers: getTotalStatTiers(totalArmorStatMapping),
				wastedStats: getWastedStats(totalArmorStatMapping),
				totalArmorStatMapping,
				baseArmorStatMapping,
				seenArmorSlotItems: finalSpecialSeenArmorSlotItems,
			},
		});
	});
	return output;
};

type ProcessArmorParams = {
	desiredArmorStats: ArmorStatMapping;
	armorItems: ArmorItems[];
	sumOfSeenStats: StatList;
	seenArmorIds: string[];
	masterworkAssumption: EMasterworkAssumption;
	potentialRaidModArmorSlotPlacements: PotentialRaidModArmorSlotPlacement[];
	armorSlotMods: ArmorSlotIdToModIdListMapping;
	raidMods: EModId[];
	destinyClassId: EDestinyClassId;
	armorMetadataItem: ArmorMetadataItem;
	specialSeenArmorSlotItems: SeenArmorSlotItems;
	selectedExotic: AvailableExoticArmorItem;
	reservedArmorSlotEnergy: Record<EArmorSlotId, number>;
};

const processArmor = ({
	desiredArmorStats,
	armorItems,
	sumOfSeenStats,
	seenArmorIds,
	masterworkAssumption,
	potentialRaidModArmorSlotPlacements,
	armorSlotMods,
	raidMods,
	destinyClassId,
	armorMetadataItem,
	specialSeenArmorSlotItems,
	selectedExotic,
	reservedArmorSlotEnergy,
}: ProcessArmorParams): ProcessArmorOutput => {
	const func =
		armorItems.length === 1
			? _processArmorBaseCase
			: _processArmorRecursiveCase;
	return func({
		desiredArmorStats,
		armorItems,
		sumOfSeenStats,
		seenArmorIds,
		masterworkAssumption,
		potentialRaidModArmorSlotPlacements,
		armorSlotMods,
		raidMods,
		destinyClassId,
		armorMetadataItem,
		specialSeenArmorSlotItems,
		selectedExotic,
		reservedArmorSlotEnergy,
	});
};

export type ProcessedArmorItemMetadata = {
	totalModCost: number;
	totalStatTiers: number;
	wastedStats: number;
	totalArmorStatMapping: ArmorStatMapping;
	baseArmorStatMapping: ArmorStatMapping;
	seenArmorSlotItems: SeenArmorSlotItems;
};

type ProcessArmorOutputItem = {
	armorIdList: ArmorIdList;
	armorStatModIdList: EModId[];
	artificeModIdList: EModId[];
	requiredClassItemExtraModSocketCategoryId: EExtraSocketModCategoryId;
	maximumSingleStatValues: Record<EArmorStatId, number>;
	// Anything that the user can sort the results by should be pre-calculated right here
	metadata: ProcessedArmorItemMetadata;
};
export type ProcessArmorOutput = ProcessArmorOutputItem[];

export type DoProcessArmorOutput = {
	items: ProcessArmorOutputItem[];
	maxPossibleDesiredStatTiers: ArmorStatMapping;
};
export type DoProcessArmorParams = {
	desiredArmorStats: ArmorStatMapping;
	armorItems: StrictArmorItems;
	masterworkAssumption: EMasterworkAssumption;
	fragmentArmorStatMapping: ArmorStatMapping;
	modArmorStatMapping: ArmorStatMapping;
	potentialRaidModArmorSlotPlacements: PotentialRaidModArmorSlotPlacement[];
	armorSlotMods: ArmorSlotIdToModIdListMapping;
	raidMods: EModId[];
	destinyClassId: EDestinyClassId;
	armorMetadataItem: ArmorMetadataItem;
	selectedExotic: AvailableExoticArmorItem;
	reservedArmorSlotEnergy: Record<EArmorSlotId, number>;
};
/**
 * @param {ArmorItems2} armorItems - [heads, arms, chests, legs]
 * @returns {ProcessArmorOutput} All the combinations of armor ids that meet the required specs
 * @description This function expects that every combination of [heads, arms, chests, legs]
 * is valid.
 */
export const doProcessArmor = ({
	desiredArmorStats,
	armorItems,
	masterworkAssumption,
	fragmentArmorStatMapping,
	modArmorStatMapping,
	potentialRaidModArmorSlotPlacements,
	armorSlotMods,
	raidMods,
	destinyClassId,
	armorMetadataItem,
	selectedExotic,
	reservedArmorSlotEnergy,
}: DoProcessArmorParams): DoProcessArmorOutput => {
	// Add in the class item
	const extraSumOfSeenStats = getExtraSumOfSeenStats(
		fragmentArmorStatMapping,
		modArmorStatMapping
	);
	let sumOfSeenStats = [...extraSumOfSeenStats];
	// TODO: This logic won't work well with the logic that checks
	// for the necessary class item mod socket category. If we have
	// an unmasterworked raid class item that we need then this will assume
	// that the class item is masterworked which is no bueno.
	if (
		armorMetadataItem.classItem.hasMasterworkedLegendaryClassItem ||
		(masterworkAssumption !== EMasterworkAssumption.None &&
			armorMetadataItem.classItem.hasLegendaryClassItem)
	) {
		sumOfSeenStats = sumOfSeenStats.map((x) => x + 2);
	}

	const seenArmorSlotItems =
		getSeenArmorSlotItemsFromClassItems(armorMetadataItem);
	const processArmorParams: ProcessArmorParams = {
		masterworkAssumption,
		desiredArmorStats,
		armorItems,
		sumOfSeenStats: sumOfSeenStats as StatList,
		seenArmorIds: [],
		potentialRaidModArmorSlotPlacements,
		armorSlotMods,
		raidMods,
		destinyClassId,
		armorMetadataItem,
		specialSeenArmorSlotItems: seenArmorSlotItems,
		selectedExotic,
		reservedArmorSlotEnergy,
	};

	const processedArmor: ProcessArmorOutput = processArmor(processArmorParams);

	const maxPossibleDesiredStatTiers = getMaxPossibleDesiredStatTiers({
		processedArmor,
		processArmorParams,
	});
	return { items: processedArmor, maxPossibleDesiredStatTiers };
};

// Transform the shape of the application's armor to be processed.
// Filter out any armor items that will definitely not be used.
export const preProcessArmor = (
	armorGroup: ArmorGroup,
	selectedExoticArmor: ISelectedExoticArmor,
	dimLoadouts: Loadout[],
	dimLoadoutsFilterId: EDimLoadoutsFilterId,
	minimumGearTier: EGearTierId
): StrictArmorItems => {
	const excludedItemIds: Record<string, boolean> = {};
	if (dimLoadoutsFilterId === EDimLoadoutsFilterId.None) {
		dimLoadouts.forEach((loadout) =>
			loadout.equipped.forEach((equipped) => {
				excludedItemIds[equipped.id] = true;
			})
		);
	}

	const strictArmorItems: StrictArmorItems = [[], [], [], []];
	ArmorSlotIdList.forEach((armorSlot, i) => {
		if (armorSlot === selectedExoticArmor.armorSlot) {
			strictArmorItems[i] = Object.values(armorGroup[armorSlot].exotic).filter(
				(item) =>
					!excludedItemIds[item.id] && item.hash === selectedExoticArmor.hash
			);
			return;
		}
		strictArmorItems[i] = Object.values(armorGroup[armorSlot].nonExotic).filter(
			(item) => {
				// TODO: Write a better comparator for gear tiers
				if (
					item.gearTierId === EGearTierId.Uncommon ||
					item.gearTierId === EGearTierId.Common ||
					item.gearTierId === EGearTierId.Unknown
				) {
					return false;
				}
				// TODO: If the gear tier selector ever allows lower than blue this will need to be changed
				if (
					minimumGearTier === EGearTierId.Legendary &&
					item.gearTierId !== EGearTierId.Legendary
				) {
					return false;
				}
				return !excludedItemIds[item.id];
			}
		);
	});
	return strictArmorItems;
};

const getModIdListFromArmorStatAndRaidModComboPlacement = (
	placement: ArmorStatAndRaidModComboPlacement
): EModId[] => {
	const result: EModId[] = [];
	ArmorSlotWithClassItemIdList.forEach((armorSlot) => {
		const modId = placement[armorSlot].armorStatModId;
		if (!modId) {
			return;
		}
		result.push(modId);
	});
	return result;
};

// Iterate over the existing results to figure out what tiers we can achieve
type GetMaxPossibleDesiredStatTiers = {
	processedArmor: ProcessArmorOutput;
	processArmorParams: ProcessArmorParams;
};
export const getMaxPossibleDesiredStatTiers = ({
	processedArmor,
	processArmorParams,
}: GetMaxPossibleDesiredStatTiers): ArmorStatMapping => {
	const maximumStatTiers: ArmorStatMapping = getDefaultArmorStatMapping();
	if (processedArmor.length === 0) {
		return maximumStatTiers;
	}
	const { desiredArmorStats } = processArmorParams;

	ArmorStatIdList.forEach((armorStatId) => {
		for (let i = 10; i > 0; i--) {
			const desiredStat = i * 10;
			const _desiredArmorStats = {
				...desiredArmorStats,
				[armorStatId]: desiredStat,
			};
			let hasCombo = false;
			for (let j = 0; j < processedArmor.length; j++) {
				hasCombo =
					getModCombos({
						sumOfSeenStats: getStatListFromArmorStatMapping(
							processedArmor[j].metadata.baseArmorStatMapping
						),
						desiredArmorStats: _desiredArmorStats,
						potentialRaidModArmorSlotPlacements:
							processArmorParams.potentialRaidModArmorSlotPlacements,
						armorSlotMods: processArmorParams.armorSlotMods,
						raidMods: processArmorParams.raidMods,
						destinyClassId: processArmorParams.destinyClassId,
						specialSeenArmorSlotItems:
							processedArmor[j].metadata.seenArmorSlotItems,
						reservedArmorSlotEnergy: processArmorParams.reservedArmorSlotEnergy,
					}) !== null;
				if (hasCombo) {
					maximumStatTiers[armorStatId] = desiredStat;
					break;
				}
			}
			if (hasCombo) {
				break;
			}
		}
	});
	return maximumStatTiers;
};
