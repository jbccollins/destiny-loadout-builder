import { AnalyzableLoadout } from '@dlb/types/AnalyzableLoadout';
import {
	AllClassItemMetadata,
	Armor,
	AvailableExoticArmor,
	DestinyClassToAllClassItemMetadataMapping,
	StrictArmorItems,
} from '@dlb/types/Armor';
import {
	EDimLoadoutsFilterId,
	EExoticArtificeAssumption,
	EGearTierId,
	EInGameLoadoutsFilterId,
	EMasterworkAssumption,
} from '@dlb/types/IdEnums';
import { preProcessArmor } from '../../processArmor';
import { findAvailableExoticArmorItem } from './utils';

type GeneratePreProcessedArmorParams = {
	armor: Armor;
	loadout: AnalyzableLoadout;
	allClassItemMetadata: DestinyClassToAllClassItemMetadataMapping;
	availableExoticArmor: AvailableExoticArmor;
	exoticArtificeAssumption: EExoticArtificeAssumption;
	masterworkAssumption: EMasterworkAssumption;
};
type GeneratePreProcessedArmorOutput = {
	preProcessedArmor: StrictArmorItems;
	allClassItemMetadata: AllClassItemMetadata;
};
export const generatePreProcessedArmor = (
	params: GeneratePreProcessedArmorParams
): GeneratePreProcessedArmorOutput => {
	const {
		armor,
		loadout,
		allClassItemMetadata,
		availableExoticArmor,
		exoticArtificeAssumption,
		masterworkAssumption
	} = params;
	const selectedExoticArmor = findAvailableExoticArmorItem(
		loadout.exoticHash,
		loadout.destinyClassId,
		availableExoticArmor
	);

	const destinyClassId = loadout.destinyClassId;
	const [preProcessedArmor, _allClassItemMetadata] = preProcessArmor({
		armorGroup: armor[destinyClassId],
		selectedExoticArmor: selectedExoticArmor,
		dimLoadouts: [],
		dimLoadoutsFilterId: EDimLoadoutsFilterId.All,
		inGameLoadoutsFlatItemIdList: [],
		inGameLoadoutsFilterId: EInGameLoadoutsFilterId.All,
		minimumGearTier: EGearTierId.Legendary,
		allClassItemMetadata: allClassItemMetadata[destinyClassId],
		alwaysConsiderCollectionsRolls: false,
		useOnlyMasterworkedArmor: false,
		excludeLockedItems: false,
		exoticArtificeAssumption,
		masterworkAssumption
	});
	return {
		preProcessedArmor,
		allClassItemMetadata: _allClassItemMetadata,
	};
};
