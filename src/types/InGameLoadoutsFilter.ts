import { EnumDictionary, IIdentifiableName } from './globals';
import { EInGameLoadoutsFilterId } from './IdEnums';

export const InGameLoadoutsFilterIdList = Object.values(
	EInGameLoadoutsFilterId
);

export interface IInGameLoadoutsFilter extends IIdentifiableName {
	description: string;
}

const InGameLoadoutsFilterIdToInGameLoadoutsFilterMapping: EnumDictionary<
	EInGameLoadoutsFilterId,
	IInGameLoadoutsFilter
> = {
	[EInGameLoadoutsFilterId.All]: {
		id: EInGameLoadoutsFilterId.All,
		name: 'All',
		description: 'Consider all items in D2 loadouts',
	},
	[EInGameLoadoutsFilterId.None]: {
		id: EInGameLoadoutsFilterId.None,
		name: 'None',
		description: 'Exclude items in D2 loadouts',
	},
};

export const getInGameLoadoutsFilter = (
	id: EInGameLoadoutsFilterId
): IInGameLoadoutsFilter =>
	InGameLoadoutsFilterIdToInGameLoadoutsFilterMapping[id];
