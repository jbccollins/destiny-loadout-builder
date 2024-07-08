import { Loadout } from '@destinyitemmanager/dim-api-types';
import { EModId } from '@dlb/generated/mod/EModId';
import {
	ArmorSlotEnergyMapping,
	getDefaultArmorSlotEnergyMapping,
} from '@dlb/redux/features/reservedArmorSlotEnergy/reservedArmorSlotEnergySlice';
import {
	AllClassItemMetadata,
	ArmorGroup,
	ArmorIdList,
	ArmorItems,
	ISelectedExoticArmor,
	StatList,
	StrictArmorItems,
	getDefaultAllClassItemMetadata,
} from '@dlb/types/Armor';
import {
	ArmorSlotIdList,
	ArmorSlotWithClassItemIdList,
} from '@dlb/types/ArmorSlot';
import {
	ArmorStatIdList,
	ArmorStatMapping,
	getArmorStatMappingFromMods,
	getDefaultArmorStatMapping,
	sumArmorStatMappings,
} from '@dlb/types/ArmorStat';
import {
	EArmorSlotId,
	EDestinyClassId,
	EDimLoadoutsFilterId,
	EExoticArtificeAssumption,
	EGearTierId,
	EInGameLoadoutsFilterId,
	EIntrinsicArmorPerkOrAttributeId,
	EMasterworkAssumption,
} from '@dlb/types/IdEnums';
import {
	ArmorSlotIdToModIdListMapping,
	PotentialRaidModArmorSlotPlacement,
} from '@dlb/types/Mod';
import { cloneDeep } from 'lodash';
import { EXTRA_MASTERWORK_STAT_LIST } from './constants';
import {
	ArmorStatAndRaidModComboPlacement,
	getModCombos,
} from './getModCombos';
import {
	SeenArmorSlotItems,
	getDefaultSeenArmorSlotItems,
} from './seenArmorSlotItems';
import {
	RequiredClassItemMetadataKey,
	RequiredClassItemMetadataKeyList,
	getArmorStatMappingFromArtificeModIdList,
	getArmorStatMappingFromStatList,
	getExtraSumOfSeenStats,
	getNextValues,
	getNumUniqueArmorStatMods,
	getStatListFromArmorStatMapping,
	getTotalModCost,
	getTotalStatTiers,
	getWastedStats,
	sumModCosts,
	sumStatLists
} from './utils';

const _processArmorRecursiveCase = ({
	desiredArmorStats,
	armorItems,
	sumOfSeenStats,
	seenArmorIds,
	masterworkAssumption,
	exoticArtificeAssumption,
	useExoticClassItem,
	potentialRaidModArmorSlotPlacements,
	armorSlotMods,
	raidMods,
	intrinsicArmorPerkOrAttributeIds,
	destinyClassId,
	specialSeenArmorSlotItems,
	reservedArmorSlotEnergy,
	useZeroWastedStats,
	alwaysConsiderCollectionsRolls,
	allClassItemMetadata,
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
				exoticArtificeAssumption,
				useExoticClassItem,
				potentialRaidModArmorSlotPlacements,
				armorSlotMods,
				raidMods,
				intrinsicArmorPerkOrAttributeIds,
				destinyClassId,
				specialSeenArmorSlotItems: nextSpecialSeenArmorSlotItems,
				reservedArmorSlotEnergy,
				useZeroWastedStats,
				alwaysConsiderCollectionsRolls,
				allClassItemMetadata,
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
	exoticArtificeAssumption,
	useExoticClassItem,
	potentialRaidModArmorSlotPlacements,
	armorSlotMods,
	raidMods,
	intrinsicArmorPerkOrAttributeIds,
	destinyClassId,
	specialSeenArmorSlotItems,
	reservedArmorSlotEnergy,
	useZeroWastedStats,
	allClassItemMetadata,
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
		// // How to debug a specific armor combo
		// if (
		// 	isEqual(armorIdList, [
		// 		'6917529863666127626',
		// 		'6917529740344211114',
		// 		'6917529863973030380',
		// 		'6917529863876854947',
		// 	]) &&
		// 	desiredArmorStats[EArmorStatId.Resilience] === 100 &&
		// 	desiredArmorStats[EArmorStatId.Recovery] === 90 &&
		// 	desiredArmorStats[EArmorStatId.Discipline] === 80
		// ) {
		// 	console.log('>>>> Specific Combo');
		// }
		const modCombosList = getModCombos({
			sumOfSeenStats: finalSumOfSeenStats,
			desiredArmorStats,
			potentialRaidModArmorSlotPlacements,
			armorSlotMods,
			raidMods,
			destinyClassId,
			specialSeenArmorSlotItems: finalSpecialSeenArmorSlotItems,
			reservedArmorSlotEnergy,
			useZeroWastedStats,
			allClassItemMetadata,
			masterworkAssumption,
			exoticArtificeAssumption,
			useExoticClassItem,
			intrinsicArmorPerkOrAttributeIds,
		});
		// TODO: We should only have to check one or the other. This is messy
		if (modCombosList === null || modCombosList.length === 0) {
			return;
		}

		// Pick the lowest cost combo
		// TODO: Allow the user to decide the sort priority. Sometimes
		// the user may want to prioritize
		// something like "wasted stats", even if it costs more.
		const modCombos = modCombosList.sort((a, b) => {
			return (
				sumModCosts(
					getModIdListFromArmorStatAndRaidModComboPlacement(
						a.lowestCostPlacement.placement
					)
				) -
				sumModCosts(
					getModIdListFromArmorStatAndRaidModComboPlacement(
						b.lowestCostPlacement.placement
					)
				)
			);
		})[0];

		// TODO: Change this based on what the user prioritizes
		const placement = modCombos.lowestCostPlacement;

		let hasMasterworkedClassItem = false;

		if (allClassItemMetadata[modCombos.requiredClassItemMetadataKey]) {
			if (
				allClassItemMetadata[modCombos.requiredClassItemMetadataKey]
					?.hasMasterworkedVariant
			) {
				hasMasterworkedClassItem = true;
			}
		} else {
			hasMasterworkedClassItem =
				allClassItemMetadata.Legendary?.hasMasterworkedVariant;
		}

		const requiredArmorStatModIdList = placement
			? getModIdListFromArmorStatAndRaidModComboPlacement(placement.placement)
			: [];

		const requiredArtificeModIdList = placement
			? placement.artificeModIdList
			: [];

		const baseArmorStatMapping =
			getArmorStatMappingFromStatList(finalSumOfSeenStats);
		// const masterworkedStatList =
		// 	hasMasterworkedClassItem ||
		// 	masterworkAssumption === EMasterworkAssumption.Legendary ||
		// 	masterworkAssumption === EMasterworkAssumption.All
		// 		? getArmorStatMappingFromStatList(EXTRA_MASTERWORK_STAT_LIST)
		// 		: getDefaultArmorStatMapping();

		const totalArmorStatMapping = sumArmorStatMappings([
			// masterworkedStatList,
			baseArmorStatMapping,
			getArmorStatMappingFromMods(requiredArmorStatModIdList, destinyClassId),
			getArmorStatMappingFromArtificeModIdList(requiredArtificeModIdList),
		]);

		output.push({
			armorIdList,
			armorStatModIdList: requiredArmorStatModIdList,
			artificeModIdList: requiredArtificeModIdList,
			modPlacement: placement.placement,
			metadata: {
				totalModCost: getTotalModCost(requiredArmorStatModIdList),
				totalStatTiers: getTotalStatTiers(totalArmorStatMapping),
				wastedStats: getWastedStats(totalArmorStatMapping),
				numUniqueArmorStatMods: getNumUniqueArmorStatMods(requiredArmorStatModIdList),
				// numUniqueArmorStatMods: 0,
				totalArmorStatMapping,
				baseArmorStatMapping,
				seenArmorSlotItems: finalSpecialSeenArmorSlotItems,
				classItem: {
					requiredClassItemMetadataKey: modCombos.requiredClassItemMetadataKey,
					hasMasterworkedVariant: hasMasterworkedClassItem,
				},
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
	exoticArtificeAssumption: EExoticArtificeAssumption;
	useExoticClassItem: boolean;
	potentialRaidModArmorSlotPlacements: PotentialRaidModArmorSlotPlacement[];
	armorSlotMods: ArmorSlotIdToModIdListMapping;
	raidMods: EModId[];
	intrinsicArmorPerkOrAttributeIds: EIntrinsicArmorPerkOrAttributeId[];
	destinyClassId: EDestinyClassId;
	specialSeenArmorSlotItems: SeenArmorSlotItems;
	reservedArmorSlotEnergy: ArmorSlotEnergyMapping;
	useZeroWastedStats: boolean;
	alwaysConsiderCollectionsRolls: boolean;
	allClassItemMetadata: AllClassItemMetadata;
};

const processArmor = (params: ProcessArmorParams): ProcessArmorOutput => {
	const func =
		params.armorItems.length === 1
			? _processArmorBaseCase
			: _processArmorRecursiveCase;
	return func(params);
};

export type ProcessedArmorItemMetadataClassItem = {
	requiredClassItemMetadataKey: RequiredClassItemMetadataKey;
	hasMasterworkedVariant: boolean;
};

export const getDefaultProcessedArmorItemMetadataClassItem = () => ({
	requiredClassItemMetadataKey: null,
	hasMasterworkedVariant: false,
});

export type ProcessedArmorItemMetadata = {
	totalModCost: number;
	totalStatTiers: number;
	wastedStats: number;
	numUniqueArmorStatMods: number;
	totalArmorStatMapping: ArmorStatMapping;
	baseArmorStatMapping: ArmorStatMapping;
	seenArmorSlotItems: SeenArmorSlotItems;
	classItem: ProcessedArmorItemMetadataClassItem;
};

export type ProcessArmorOutputItem = {
	armorIdList: ArmorIdList;
	armorStatModIdList: EModId[];
	artificeModIdList: EModId[];
	modPlacement: ArmorStatAndRaidModComboPlacement;
	metadata: ProcessedArmorItemMetadata;
};
export type ProcessArmorOutput = ProcessArmorOutputItem[];

export type DoProcessArmorOutput = {
	items: ProcessArmorOutputItem[];
	totalItemCount: number;
	maxPossibleDesiredStatTiers: ArmorStatMapping;
	maxPossibleReservedArmorSlotEnergy: ArmorSlotEnergyMapping;
};
export type DoProcessArmorParams = {
	desiredArmorStats: ArmorStatMapping;
	armorItems: StrictArmorItems;
	masterworkAssumption: EMasterworkAssumption;
	exoticArtificeAssumption: EExoticArtificeAssumption;
	useExoticClassItem: boolean;
	fragmentArmorStatMapping: ArmorStatMapping;
	modArmorStatMapping: ArmorStatMapping;
	potentialRaidModArmorSlotPlacements: PotentialRaidModArmorSlotPlacement[];
	armorSlotMods: ArmorSlotIdToModIdListMapping;
	raidMods: EModId[];
	intrinsicArmorPerkOrAttributeIds: EIntrinsicArmorPerkOrAttributeId[];
	destinyClassId: EDestinyClassId;
	reservedArmorSlotEnergy: ArmorSlotEnergyMapping;
	useZeroWastedStats: boolean;
	useBonusResilience: boolean;
	selectedExoticArmorItem: ISelectedExoticArmor;
	alwaysConsiderCollectionsRolls: boolean;
	allClassItemMetadata: AllClassItemMetadata;
	assumedStatValuesStatMapping: ArmorStatMapping;
};
/**
 * @param {StrictArmorItems} armorItems - [heads, arms, chests, legs]
 * @returns {ProcessArmorOutput} All the combinations of armor ids that meet the required specs
 * @description This function expects that every combination of [heads, arms, chests, legs]
 * is valid.
 */
export const doProcessArmor = ({
	desiredArmorStats,
	armorItems,
	masterworkAssumption,
	exoticArtificeAssumption,
	useExoticClassItem,
	fragmentArmorStatMapping,
	modArmorStatMapping,
	potentialRaidModArmorSlotPlacements,
	armorSlotMods,
	raidMods,
	intrinsicArmorPerkOrAttributeIds,
	destinyClassId,
	reservedArmorSlotEnergy,
	useZeroWastedStats,
	useBonusResilience,
	selectedExoticArmorItem,
	alwaysConsiderCollectionsRolls,
	allClassItemMetadata,
	assumedStatValuesStatMapping,
}: DoProcessArmorParams): DoProcessArmorOutput => {
	// Bonus resil does not apply to exotic chest armor loadouts
	const _useBonusResilience =
		useBonusResilience &&
		selectedExoticArmorItem.armorSlot !== EArmorSlotId.Chest;
	const sumOfSeenStats = sumStatLists([
		getExtraSumOfSeenStats(
			[
				fragmentArmorStatMapping,
				modArmorStatMapping,
				assumedStatValuesStatMapping,
			],
			_useBonusResilience
		),
		// Assume every class item is masterworked
		EXTRA_MASTERWORK_STAT_LIST,
	]);

	const seenArmorSlotItems = getDefaultSeenArmorSlotItems();
	const processArmorParams: ProcessArmorParams = {
		masterworkAssumption,
		exoticArtificeAssumption,
		useExoticClassItem,
		desiredArmorStats,
		armorItems,
		sumOfSeenStats: sumOfSeenStats as StatList,
		seenArmorIds: [],
		potentialRaidModArmorSlotPlacements,
		armorSlotMods,
		raidMods,
		intrinsicArmorPerkOrAttributeIds,
		destinyClassId,
		specialSeenArmorSlotItems: seenArmorSlotItems,
		reservedArmorSlotEnergy,
		useZeroWastedStats,
		alwaysConsiderCollectionsRolls,
		allClassItemMetadata,
	};

	const processedArmor: ProcessArmorOutput = processArmor(
		processArmorParams
	).sort(
		(a, b) =>
			// Lowest cost
			a.metadata.totalModCost - b.metadata.totalModCost ||
			// Highest number of unique armor stat mods
			b.metadata.numUniqueArmorStatMods - a.metadata.numUniqueArmorStatMods ||
			// Highest stat tiers
			b.metadata.totalStatTiers - a.metadata.totalStatTiers ||
			// Lowest wasted stats
			a.metadata.wastedStats - b.metadata.wastedStats
	);

	const {
		maxReservedArmorSlotEnergy: maxPossibleReservedArmorSlotEnergy,
		maxStatTiers: maxPossibleDesiredStatTiers,
	} = getMaxPossibleMetadata({
		processedArmor,
		processArmorParams,
	});

	const totalItemCount = processedArmor.length;

	return {
		items: processedArmor,
		totalItemCount,
		maxPossibleDesiredStatTiers,
		maxPossibleReservedArmorSlotEnergy,
	};
};

// Pick the first 1k items. Keeps the storage in redux lower
// and speeds up the app
export const truncatedDoProcessArmor = (
	params: DoProcessArmorParams
): DoProcessArmorOutput => {
	const output = doProcessArmor(params);
	const { items } = output;
	const elemsToDelete = Math.max(items.length - 1000, 0);
	items.splice(items.length - elemsToDelete, elemsToDelete);
	return output;
};

export type GetMaxPossibleDesiredStatTiersParams = {
	processedArmor: ProcessArmorOutput;
	processArmorParams: ProcessArmorParams;
};

export const getMaxPossibleMetadata = ({
	processedArmor,
	processArmorParams,
}: GetMaxPossibleDesiredStatTiersParams): {
	maxReservedArmorSlotEnergy: ArmorSlotEnergyMapping;
	maxStatTiers: ArmorStatMapping;
} => {
	const maxReservedArmorSlotEnergy: ArmorSlotEnergyMapping =
		getDefaultArmorSlotEnergyMapping();
	const maxStatTiers: ArmorStatMapping = getDefaultArmorStatMapping();
	if (processedArmor.length === 0) {
		return { maxReservedArmorSlotEnergy, maxStatTiers };
	}

	const { desiredArmorStats } = processArmorParams;
	const { reservedArmorSlotEnergy } = processArmorParams;
	let processedArmorSlotCount = 0;
	let processedArmorStatCount = 0;

	const unprocessedArmorStatIds = [...ArmorStatIdList];
	const unprocessedArmorSlotIds = [...ArmorSlotWithClassItemIdList];

	// let totalIterations = 0;
	// let armorSlotIterations = 0;
	// let armorStatIterations = 0;
	for (let i = 10; i > 0; i--) {
		for (let j = 0; j < processedArmor.length; j++) {
			for (let k = 0; k < unprocessedArmorSlotIds.length; k++) {
				// totalIterations++;
				// armorSlotIterations++;
				const armorSlotId = unprocessedArmorSlotIds[k];
				const reservedArmorSlotEnergyValue = i;
				const _reservedArmorSlotEnergy = {
					...reservedArmorSlotEnergy,
					[armorSlotId]: reservedArmorSlotEnergyValue,
				};
				const combos = getModCombos({
					sumOfSeenStats: getStatListFromArmorStatMapping(
						processedArmor[j].metadata.baseArmorStatMapping
					),
					desiredArmorStats: processArmorParams.desiredArmorStats,
					potentialRaidModArmorSlotPlacements:
						processArmorParams.potentialRaidModArmorSlotPlacements,
					armorSlotMods: processArmorParams.armorSlotMods,
					raidMods: processArmorParams.raidMods,
					destinyClassId: processArmorParams.destinyClassId,
					specialSeenArmorSlotItems:
						processedArmor[j].metadata.seenArmorSlotItems,
					reservedArmorSlotEnergy: _reservedArmorSlotEnergy,
					useZeroWastedStats: processArmorParams.useZeroWastedStats,
					allClassItemMetadata: processArmorParams.allClassItemMetadata,
					masterworkAssumption: processArmorParams.masterworkAssumption,
					exoticArtificeAssumption: processArmorParams.exoticArtificeAssumption,
					useExoticClassItem: processArmorParams.useExoticClassItem,
					intrinsicArmorPerkOrAttributeIds:
						processArmorParams.intrinsicArmorPerkOrAttributeIds,
				});
				if (combos !== null) {
					maxReservedArmorSlotEnergy[armorSlotId] =
						reservedArmorSlotEnergyValue;
					processedArmorSlotCount++;
					unprocessedArmorSlotIds.splice(k, 1);
					k--;
				}
			}

			for (let k = 0; k < unprocessedArmorStatIds.length; k++) {
				// totalIterations++;
				// armorStatIterations++;
				const armorStatId = unprocessedArmorStatIds[k];
				const desiredStat = i * 10;
				const _desiredArmorStats = {
					...desiredArmorStats,
					[armorStatId]: desiredStat,
				};
				const combos = getModCombos({
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
					useZeroWastedStats: processArmorParams.useZeroWastedStats,
					allClassItemMetadata: processArmorParams.allClassItemMetadata,
					masterworkAssumption: processArmorParams.masterworkAssumption,
					exoticArtificeAssumption: processArmorParams.exoticArtificeAssumption,
					useExoticClassItem: processArmorParams.useExoticClassItem,
					intrinsicArmorPerkOrAttributeIds:
						processArmorParams.intrinsicArmorPerkOrAttributeIds,
				});
				if (combos !== null) {
					maxStatTiers[armorStatId] = desiredStat;
					processedArmorStatCount++;
					unprocessedArmorStatIds.splice(k, 1);
					k--;
				}
			}
		}

		// Done after finding a combo that works for every armor slot and every armor stat
		if (
			processedArmorSlotCount === ArmorSlotWithClassItemIdList.length &&
			processedArmorStatCount === ArmorStatIdList.length
		) {
			// console.log('>>> break', totalIterations);
			break;
		}
	}
	// console.log('>>> iterations', {
	// 	totalIterations,
	// 	armorSlotIterations,
	// 	armorStatIterations,
	// });
	return { maxReservedArmorSlotEnergy, maxStatTiers };
};

type PreProcessArmorParams = {
	armorGroup: ArmorGroup;
	selectedExoticArmor: ISelectedExoticArmor;
	dimLoadouts: Loadout[];
	dimLoadoutsFilterId: EDimLoadoutsFilterId;
	inGameLoadoutsFlatItemIdList: string[];
	inGameLoadoutsFilterId: EInGameLoadoutsFilterId;
	minimumGearTier: EGearTierId;
	allClassItemMetadata: AllClassItemMetadata;
	alwaysConsiderCollectionsRolls: boolean;
	useOnlyMasterworkedArmor: boolean;
	excludeLockedItems: boolean;
	exoticArtificeAssumption: EExoticArtificeAssumption;
	masterworkAssumption: EMasterworkAssumption;
};

// Transform the shape of the application's armor to be processed.
// Filter out any armor items that will definitely not be used.
export const preProcessArmor = ({
	armorGroup,
	selectedExoticArmor,
	dimLoadouts,
	dimLoadoutsFilterId,
	inGameLoadoutsFlatItemIdList,
	inGameLoadoutsFilterId,
	minimumGearTier,
	allClassItemMetadata,
	alwaysConsiderCollectionsRolls,
	useOnlyMasterworkedArmor,
	excludeLockedItems,
	exoticArtificeAssumption,
	masterworkAssumption,
}: PreProcessArmorParams): [StrictArmorItems, AllClassItemMetadata] => {
	const excludedItemIds: Record<string, boolean> = {};
	if (dimLoadoutsFilterId === EDimLoadoutsFilterId.None) {
		dimLoadouts.forEach((loadout) =>
			loadout.equipped.forEach((equipped) => {
				excludedItemIds[equipped.id] = true;
			})
		);
	}
	if (inGameLoadoutsFilterId === EInGameLoadoutsFilterId.None) {
		inGameLoadoutsFlatItemIdList.forEach((id) => {
			excludedItemIds[id] = true;
		});
	}

	const strictArmorItems: StrictArmorItems = [[], [], [], []];
	ArmorSlotIdList.forEach((armorSlot, i) => {
		if (armorSlot === selectedExoticArmor.armorSlot) {
			strictArmorItems[i] = Object.values(armorGroup[armorSlot].exotic).filter(
				(item) => {
					if (useOnlyMasterworkedArmor && !item.isMasterworked) {
						return false;
					}
					if (excludeLockedItems && item.isLocked) {
						return false;
					}
					return (
						!excludedItemIds[item.id] && item.hash === selectedExoticArmor.hash
					);
				}
			);
			// If we have more than one item in the exotic slot, that means we have at least
			// one roll that is not from collections. If the user prefers to not use collections
			// rolls, we filter out the collections rolls.
			if (!alwaysConsiderCollectionsRolls && strictArmorItems[i].length > 1) {
				strictArmorItems[i] = strictArmorItems[i].filter(
					(item) => !item.isCollectible
				);
			}

			if (exoticArtificeAssumption !== EExoticArtificeAssumption.None) {
				strictArmorItems[i] = strictArmorItems[i].map((item) => {
					const isMasterworked =
						item.isMasterworked ||
						masterworkAssumption === EMasterworkAssumption.All;
					const isArtifice =
						item.isArtifice ||
						exoticArtificeAssumption === EExoticArtificeAssumption.All ||
						(isMasterworked &&
							exoticArtificeAssumption ===
							EExoticArtificeAssumption.Masterworked);
					return {
						...item,
						isArtifice,
					};
				});
			}
			return;
		}
		strictArmorItems[i] = Object.values(armorGroup[armorSlot].nonExotic).filter(
			(item) => {
				if (useOnlyMasterworkedArmor && !item.isMasterworked) {
					return false;
				}
				if (excludeLockedItems && item.isLocked) {
					return false;
				}
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
	const _allClassItemMetadata = getDefaultAllClassItemMetadata();
	RequiredClassItemMetadataKeyList.forEach((requiredClassItemMetadataKey) => {
		_allClassItemMetadata[requiredClassItemMetadataKey] = cloneDeep(
			allClassItemMetadata[requiredClassItemMetadataKey]
		);

		_allClassItemMetadata[requiredClassItemMetadataKey].items =
			_allClassItemMetadata[requiredClassItemMetadataKey].items.filter(
				(item) =>
					!excludedItemIds[item.id] &&
					(excludeLockedItems ? !item.isLocked : true)
			);
		_allClassItemMetadata[requiredClassItemMetadataKey].hasMasterworkedVariant =
			_allClassItemMetadata[requiredClassItemMetadataKey].items.some(
				(item) => item.isMasterworked
			);
	});
	return [strictArmorItems, _allClassItemMetadata];
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
