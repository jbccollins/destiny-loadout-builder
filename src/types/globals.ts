/*
This exists as a template for creating new identifiable objects to be used
throughout the project. I was doing this a lot and needed a standard to follow
since things were getting quite confusing.
*/
import { EArmorStatId } from './IdEnums';

// Check Animals.ts for a simple example of how these get used

/*
Rules:
1. All enums are string enums
2. All identifiers are enums
3. All identifiers have a corresonding exported const list of values
4. All identifiers have a corresponding type
5. All such types have id and name fields, they must iplement IIdentifiable
6. All such ids and types have a corresponding unexported mapping
7. All such ids and types have a corresponding exported getter
*/

export interface IIdentifiableName {
	id: string; // Unique identifier
	name: string; // Display name
}

export interface IIcon {
	icon: string;
}

export interface IHash {
	hash: number;
}

export interface IBonuses {
	bonuses: StatBonus[];
}

// Way to store the mapping of an id enum to an identifiable item
export type EnumDictionary<T extends string | symbol | number, U> = {
	[K in T]: U;
};

// Getter for an unexported EnumDictionary object
export type Mapping<T extends string | symbol | number, U> = {
	get: (key: T) => U;
	// set?: (key: T, value: U) => void,
};

// export type MappingList<T extends string | symbol | number, U> = Mapping<
// 	T,
// 	U
// > & {
// 	append: (key: T, value: U) => void;
// };

// Hacky way to ensure that a list contains all the values in an enum
// Useful for when we care about order and don't want to use Object.values() on the enum
// Won't result in a compile time error but will throw a really obvious
// runtime error.
// TODO: Get rid of this and figure out a better way. Maybe the satisfies
// operator can be useful here? idk.
export function ValidateEnumList<T extends string | symbol | number>(
	expectedList: T[],
	list: T[]
): T[] {
	if (expectedList.length !== list.length) {
		throw new Error(
			`Lists do not have the same length. Expected: ${expectedList}. Got: ${list}`
		);
	}

	const match = expectedList.every((element) => list.includes(element));

	if (!match) {
		throw new Error(
			`Lists have different values. Expected: ${expectedList}. Got: ${list}`
		);
	}

	return list;
}

export type ClassAbilityStat = 'ClassAbilityStat';

export type StatBonusStat = EArmorStatId | ClassAbilityStat;
// | ((destinyClassId: EDestinyClassId) => EArmorStatId);

// Commonly used between CombatStyleMod and Fragment
// TODO: Maybe there's a better place for this than the globals file
export type StatBonus = {
	stat: StatBonusStat;
	value: number;
};

export const MISSING_ICON =
	'https://www.bungie.net/img/misc/missing_icon_d2.png';

export function copyToClipboard(text: string) {
	navigator.clipboard.writeText(text);
}
