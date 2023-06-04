// No masterworked legendary piece of armor has a single stat above 32
// TODO: Can we dynamically set this per slot? Like not every user
// is going to have six heads with 30 in each of the stats. So can we create a mapping
// before processing. e.g.: {head: {mob: 28, res: 27, rec: 30, ...}, arm: {mob: 29, ...}}.
// We can even "override" this with the max stats for a specific exotic when one is chosen.
// I *think* it's impossible to have a short circuit before chest if we keep this at 30.
// But it *should* be possible once we make this dynamic. We *could* also check to see
// if there even are any masterworked items in a slot (relevant mostly for the exotic chosen)

import { StatList } from '@dlb/types/Armor';

// and if there aren't then this is just 30. Probably not needed once done dynamically anyway tho
export const MAX_SINGLE_STAT_VALUE = 32;

export const ARTIFICE = 'Artifice';

export const EXTRA_MASTERWORK_STAT_LIST: StatList = [2, 2, 2, 2, 2, 2];
