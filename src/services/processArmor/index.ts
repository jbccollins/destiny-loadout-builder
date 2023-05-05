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
	getTotalModCost,
	getTotalStatTiers,
	getWastedStats,
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
import { isEqual } from 'lodash';

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

		if (
			isEqual(armorIdList, [
				'6917529773926529265',
				'6917529879772704500',
				'6917529821422130796',
				'6917529812616117576',
			])
		) {
			console.log('_processArmorBaseCase');
		}

		const modCombos = getModCombos({
			sumOfSeenStats: finalSumOfSeenStats,
			desiredArmorStats,
			potentialRaidModArmorSlotPlacements,
			armorSlotMods,
			raidMods,
			destinyClassId,
			specialSeenArmorSlotItems: finalSpecialSeenArmorSlotItems,
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

		const totalArmorStatMapping = sumArmorStatMappings([
			getArmorStatMappingFromStatList(finalSumOfSeenStats),
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
			},
		});
	});
	// console.log('>>>>>> Base Case output:', output);
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
	});
};

export type ProcessedArmorItemMetadata = {
	totalModCost: number;
	totalStatTiers: number;
	wastedStats: number;
	totalArmorStatMapping: ArmorStatMapping;
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
}: DoProcessArmorParams): ProcessArmorOutput => {
	if (desiredArmorStats.Resilience > 0 && desiredArmorStats.Recovery > 0) {
		debugger;
	}
	// Add in the class item
	const extraSumOfSeenStats = getExtraSumOfSeenStats(
		fragmentArmorStatMapping,
		modArmorStatMapping
	);
	let sumOfSeenStats = [...extraSumOfSeenStats];
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
	};

	const processedArmor: ProcessArmorOutput = processArmor(processArmorParams);
	return processedArmor;
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

const getArmorStatMappingFromArmorStatAndRaidModComboPlacement = (
	placement: ArmorStatAndRaidModComboPlacement
): ArmorStatMapping => {
	const armorStatMapping: ArmorStatMapping = getDefaultArmorStatMapping();
	ArmorSlotWithClassItemIdList.forEach((armorSlot) => {
		const modId = placement[armorSlot].armorStatModId;
		if (!modId) {
			return;
		}
		const mod = getMod(modId);
		const armorStatId = mod.bonuses[0].stat as EArmorStatId;
		armorStatMapping[armorStatId] += mod.bonuses[0].value;
	});
	return armorStatMapping;
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
