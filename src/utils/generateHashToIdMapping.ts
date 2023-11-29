import { EnumDictionary } from '@dlb/types/globals';

type Hashable = {
	hash: number;
};
export default function generateHashToIdMapping<
	E extends string,
	H extends Hashable
>(mapping: Partial<EnumDictionary<E, H>>): Record<number, E> {
	const hashToIdMapping: Record<number, E> = {};
	for (const [id, item] of Object.entries(mapping)) {
		hashToIdMapping[(item as H).hash] = id as E;
	}
	return hashToIdMapping;
}
