import {
	DestinyClassIdList,
	DestinyClassIdToDestinySubclasses,
} from '@dlb/types/DestinyClass';
import { DestinySubclassIdToDestinySubclass } from '@dlb/types/DestinySubclass';
import { SuperAbilityIdToDestinySuperAbility } from '@dlb/types/SuperAbility';
import { ElementIdToElement } from '@dlb/types/Element';
import {
	EDestinyClassId,
	EDestinySubclassId,
	ESuperAbilityId,
} from '@dlb/types/IdEnums';

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
			DestinyClassIdToDestinySubclasses.get(destinyClassId);
		destinySubclassIds.forEach((destinySubclassId) => {
			const { superAbilityIdList, name: destinySubclassName } =
				DestinySubclassIdToDestinySubclass.get(destinySubclassId);
			superAbilityIdList.forEach((superAbilityId) => {
				const {
					icon,
					name: superAbilityName,
					elementId,
				} = SuperAbilityIdToDestinySuperAbility.get(superAbilityId);
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
