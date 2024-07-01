import { EModId } from '@dlb/generated/mod/EModId';
import { DimLoadoutWithId } from '@dlb/redux/features/dimLoadouts/dimLoadoutsSlice';
import {
	InGameLoadoutsDefinitions,
	InGameLoadoutsWithIdMapping,
} from '@dlb/redux/features/inGameLoadouts/inGameLoadoutsSlice';
import {
	AnalyzableLoadout,
	AnalyzableLoadoutBreakdown,
} from '@dlb/types/AnalyzableLoadout';
import {
	Armor,
	AvailableExoticArmor,
	DestinyClassToAllClassItemMetadataMapping,
} from '@dlb/types/Armor';
import { Characters } from '@dlb/types/Character';
import { EMasterworkAssumption } from '@dlb/types/IdEnums';
import { extractDimLoadouts, extractInGameLoadouts } from './loadoutExtraction';
import { flattenArmor, isEditableLoadout } from './utils';

type BuildAnalyzableLoadoutsBreakdownParams = {
	characters: Characters;
	inGameLoadoutsWithId: InGameLoadoutsWithIdMapping;
	inGameLoadoutsDefinitions: InGameLoadoutsDefinitions;
	dimLoadouts: DimLoadoutWithId[];
	armor: Armor;
	allClassItemMetadata: DestinyClassToAllClassItemMetadataMapping;
	masterworkAssumption: EMasterworkAssumption;
	availableExoticArmor: AvailableExoticArmor;
	buggedAlternateSeasonModIdList: EModId[];
};
export const buildAnalyzableLoadoutsBreakdown = (
	params: BuildAnalyzableLoadoutsBreakdownParams
): AnalyzableLoadoutBreakdown => {
	const {
		dimLoadouts,
		inGameLoadoutsWithId,
		armor,
		allClassItemMetadata,
		masterworkAssumption,
		availableExoticArmor,
		characters,
		inGameLoadoutsDefinitions,
		buggedAlternateSeasonModIdList,
	} = params;
	const hasDimLoadouts = dimLoadouts && dimLoadouts.length > 0;
	const armorItems = flattenArmor(armor, allClassItemMetadata);
	const analyzableDimLoadouts = hasDimLoadouts
		? extractDimLoadouts({
			armorItems,
			dimLoadouts,
			masterworkAssumption,
			availableExoticArmor,
			buggedAlternateSeasonModIdList,
		})
		: [];
	const analyzableInGameLoadouts = extractInGameLoadouts({
		armorItems,
		inGameLoadoutsWithId,
		masterworkAssumption,
		characters,
		inGameLoadoutsDefinitions,
	});
	const validLoadouts: Record<string, AnalyzableLoadout> = {};
	const invalidLoadouts: Record<string, AnalyzableLoadout> = {};

	[...analyzableInGameLoadouts, ...analyzableDimLoadouts].forEach((x) => {
		if (isEditableLoadout(x)) {
			validLoadouts[x.dlbGeneratedId] = x;
		} else {
			invalidLoadouts[x.dlbGeneratedId] = x;
		}
	});
	return {
		validLoadouts,
		invalidLoadouts,
	};
};
