import {
	IIcon,
	IIdentifiableName,
	EnumDictionary,
	ValidateEnumList,
	Mapping,
} from './globals';
import { EAnimalId } from './IdEnums';

// Convenience export for iterating over ids
// Order matters here. Do not use Object.values
export const AnimalIdList = ValidateEnumList(Object.values(EAnimalId), [
	EAnimalId.Cat,
	EAnimalId.Dog,
	EAnimalId.Lion,
]);

// If order doesn't matter you can safely use Object.values()
// export const AnimalIdList = Object.values(EAnimalId)

export interface IAnimal extends IIdentifiableName, IIcon {
	isPet: boolean;
}

const AnimalIdToAnimalMapping: EnumDictionary<EAnimalId, IAnimal> = {
	[EAnimalId.Dog]: {
		id: EAnimalId.Dog,
		icon: 'dogicon.png',
		isPet: true,
		name: 'Dog',
	},
	[EAnimalId.Cat]: {
		id: EAnimalId.Cat,
		icon: 'caticon.png',
		isPet: true,
		name: 'Cat',
	},
	[EAnimalId.Lion]: {
		id: EAnimalId.Lion,
		icon: 'lionicon.png',
		isPet: true,
		name: 'Lion',
	},
};

export const AnimalIdToAnimal: Mapping<EAnimalId, IAnimal> = {
	get: (key: EAnimalId) => AnimalIdToAnimalMapping[key],
};
