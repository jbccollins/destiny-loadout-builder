import {
	DestinyClassIdList,
	getDestinySubclassIdListByDestinyClassId,
} from '@dlb/types/DestinyClass';
import { getDestinySubclass } from '@dlb/types/DestinySubclass';
import { getSuperAbility } from '@dlb/types/SuperAbility';
import { ElementIdToElement } from '@dlb/types/Element';
import { EDestinyClassId, EDestinySubclassId } from '@dlb/types/IdEnums';
import { ESuperAbilityId } from '@dlb/generated/superAbility/ESuperAbilityId';

export type DestinySubclassAndSuperAbilityOption = {
	superAbilityId: ESuperAbilityId;
	destinySubclassId: EDestinySubclassId;
	superAbilityName: string;
	destinySubclassName: string;
	icon: string;
	elementName: string;
};

// This is the list of subclass and super ability options grouped by class.
const options = (() => {
	const opts: {
		[EDestinyClassId.Titan]: DestinySubclassAndSuperAbilityOption[];
		[EDestinyClassId.Hunter]: DestinySubclassAndSuperAbilityOption[];
		[EDestinyClassId.Warlock]: DestinySubclassAndSuperAbilityOption[];
	} = {
		[EDestinyClassId.Titan]: [],
		[EDestinyClassId.Hunter]: [],
		[EDestinyClassId.Warlock]: [],
	};
	DestinyClassIdList.forEach((destinyClassId) => {
		const destinySubclassIds =
			getDestinySubclassIdListByDestinyClassId(destinyClassId);
		destinySubclassIds.forEach((destinySubclassId) => {
			const { superAbilityIdList, name: destinySubclassName } =
				getDestinySubclass(destinySubclassId);
			superAbilityIdList.forEach((superAbilityId) => {
				const {
					icon,
					name: superAbilityName,
					elementId,
				} = getSuperAbility(superAbilityId);
				const { name: elementName } = ElementIdToElement.get(elementId);
				opts[destinyClassId].push({
					superAbilityId,
					destinySubclassId,
					superAbilityName,
					destinySubclassName,
					icon,
					elementName,
				});
			});
		});
		opts[destinyClassId].sort((a, b) =>
			(a.elementName + a.superAbilityName).localeCompare(
				b.elementName + b.superAbilityName
			)
		);
	});
	return opts;
})();

export default options;
