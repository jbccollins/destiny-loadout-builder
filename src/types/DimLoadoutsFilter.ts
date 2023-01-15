import { EnumDictionary, IIdentifiableName } from './globals';
import { EDimLoadoutsFilterId } from './IdEnums';

export const DimLoadoutsFilterIdList = Object.values(EDimLoadoutsFilterId);

export interface IDimLoadoutsFilter extends IIdentifiableName {
	description: string;
}

const DimLoadoutsFilterIdToDimLoadoutsFilterMapping: EnumDictionary<
	EDimLoadoutsFilterId,
	IDimLoadoutsFilter
> = {
	[EDimLoadoutsFilterId.All]: {
		id: EDimLoadoutsFilterId.All,
		name: 'All',
		description: 'Consider all items in DIM loadouts',
	},
	[EDimLoadoutsFilterId.None]: {
		id: EDimLoadoutsFilterId.None,
		name: 'None',
		description: 'Exclude all items in DIM loadouts',
	},
};

export const getDimLoadoutsFilter = (
	id: EDimLoadoutsFilterId
): IDimLoadoutsFilter => DimLoadoutsFilterIdToDimLoadoutsFilterMapping[id];
