import { IIcon, IIdentifiableName } from './globals';
import { EDestinyClassId } from './IdEnums';

/********* [STORED] Each character the user has. Up to three of these will exist. *********/
export type Characters = Character[];

export interface Character extends IIdentifiableName, IIcon {
	// background image
	background: string;
	// TODO: Change this to be something other than
	destinyClassId: EDestinyClassId;
	// e.g "Exo Male"
	genderRace: string;
	// I think this is a thumbnail for the emblem. May be useful for mobile views?
}
