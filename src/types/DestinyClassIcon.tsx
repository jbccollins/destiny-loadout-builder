import hunter_icon from '@public/class_hunter_outline.png';
import titan_icon from '@public/class_titan_outline.png';
import warlock_icon from '@public/class_warlock_outline.png';
import { EDestinyClassId } from './IdEnums';

export const CLASS_ICONS = {
	[EDestinyClassId.Hunter]: hunter_icon,
	[EDestinyClassId.Titan]: titan_icon,
	[EDestinyClassId.Warlock]: warlock_icon,
};

export function getDestinyClassIcon(destinyClassId: EDestinyClassId) {
	return CLASS_ICONS[destinyClassId];
}
