import { EModId } from '@dlb/generated/mod/EModId';
import { ModIdToModMapping } from '@dlb/generated/mod/ModMapping';
import { IMod } from './generation';

export const getMod = (id: EModId): IMod => ModIdToModMapping[id];
