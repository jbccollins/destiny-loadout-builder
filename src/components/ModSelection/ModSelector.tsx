import options from '@dlb/constants/DestinySubclassAndSuperAbilityOptions';
import { EModId } from '@dlb/generated/mod/EModId';
import { getArmorSlot } from '@dlb/types/ArmorSlot';
import { getStat } from '@dlb/types/ArmorStat';
import { IMod } from '@dlb/types/generation';
import { MISSING_ICON, StatBonus, StatBonusStat } from '@dlb/types/globals';
import { EArmorSlotId, EDestinyClassId, EElementId } from '@dlb/types/IdEnums';
import {
	getMod,
	ArmorSlotIdToArmorSlotModIdListMapping,
	getStatBonusesFromMod,
} from '@dlb/types/Mod';
import { getModCategory } from '@dlb/types/ModCategory';
import { Avatar, Box, Chip, Typography } from '@mui/material';
import { first, last } from 'lodash';
import { ReactNode } from 'react';
import IconAutocompleteDropdown from '../IconAutocompleteDropdown';

type Option = {
	name: string;
	id: string;
	disabled?: boolean;
	icon: string;
	description: string;
	extraIcons?: string[];
	cost: number;
	bonuses: StatBonus[] | null;
};

const placeholderOption: IMod = {
	name: 'None Selected...',
	id: null,
	icon: MISSING_ICON,
	description: '',
	hash: 1234,
	elementId: null,
	cost: 0,
	isArtifactMod: false,
	modCategoryId: null,
	modSocketCategoryId: null,
	armorSlotId: null,
	armorSocketIndex: 0,
	elementOverlayIcon: null,
};

const getOptionStat = (
	stat: StatBonusStat,
	selectedDestinyClass: EDestinyClassId
) => getStat(stat, selectedDestinyClass);

const getExtraContent = (
	option: Option,
	selectedDestinyClass: EDestinyClassId
) => {
	return (
		<Box
			sx={{ position: 'relative', paddingTop: '8px' }}
			className="extra-content-wrapper"
		>
			<Box
				className="description-wrapper"
				// sx={{
				// 	position: 'absolute',
				// 	top: '50%',
				// 	transform: 'translateY(-50%)',
				// 	width: '100%',
				// }}
			>
				{option.description}
			</Box>
			{option.bonuses && option.bonuses.length > 0 && (
				<Box
					sx={{ display: 'flex', paddingTop: '4px' }}
					className="bonuses-wrapper"
				>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							alignContent: 'center',
							flexDirection: 'column',
						}}
					>
						Bonuses:
					</Box>
					<Box>
						{option.bonuses.map(({ stat, value }) => {
							const { icon: statIcon, id: statId } = getOptionStat(
								stat,
								selectedDestinyClass
							);
							return (
								<Chip
									style={{ marginLeft: '8px' }}
									key={statId}
									avatar={<Avatar alt={'stat-icon'} src={statIcon} />}
									label={value > 0 ? `+${value}` : value}
								/>
							);
						})}
					</Box>
				</Box>
			)}
		</Box>
	);
};

const ModSelector = ({
	selectedMods,
	handleChange,
	getLabel,
	getDescription,
	getCost,
	index,
	first,
	last,
	availableMods,
	getTitle,
	selectedDestinyClass,
	enforceMatchingElementRule,
}: {
	selectedMods: EModId[];
	availableMods: EModId[];
	handleChange: (armorSlotModId: EModId, index: number) => void;
	getLabel: (option: Option) => string;
	getDescription: (option: Option) => string;
	getCost: (option: Option) => number;
	getTitle?: () => string;
	index: number;
	first?: boolean;
	last?: boolean;
	selectedDestinyClass: EDestinyClassId;
	enforceMatchingElementRule: boolean;
}) => {
	const selectedMod = getMod(selectedMods[index]);
	let otherSelectedModsElementId: EElementId = EElementId.Any;
	for (let i = 0; i < selectedMods.length; i++) {
		const modId = selectedMods[i];
		if (modId === null || i === index) {
			continue;
		}
		const elementId = getMod(modId).elementId;
		if (elementId !== EElementId.Any) {
			otherSelectedModsElementId = getMod(modId).elementId;
			break;
		}
	}
	const options: Option[] = [
		{ ...placeholderOption, bonuses: null },
		...availableMods
			.map((id: EModId) => {
				const mod = getMod(id);
				return {
					...mod,
					bonuses: getStatBonusesFromMod(id),
					// TODO: This name thing is fucking dumb but it's to prevent duplicate keys.
					// Since the Autocomplete in it's infintite wisdom uses the name as a key.
					name: mod.name + (mod.isArtifactMod ? ' (Artifact)' : ''),
					disabled:
						enforceMatchingElementRule &&
						!(mod.elementId === EElementId.Any) &&
						!(mod.elementId === otherSelectedModsElementId) &&
						!(otherSelectedModsElementId === EElementId.Any),
					//disabled: armorSlotModIds.indexOf(x.id as EModId) > -1,
				};
			})
			// TODO: Sort this so that the general mods always appear at the top right after no option
			.sort((optionA, optionB) =>
				`${getModCategory(optionA.modCategoryId).name}${
					optionA.name
				}`.localeCompare(
					`${getModCategory(optionB.modCategoryId).name}${optionB.name}`
				)
			),
	];
	return (
		<IconAutocompleteDropdown
			title={getTitle ? getTitle() : ''}
			// TODO: Memoize these options
			options={options}
			value={selectedMod || placeholderOption}
			//onChange={handleChange}
			onChange={(mod: IMod) => handleChange(mod.id as EModId, index)}
			getId={(option: IMod) => option.hash.toString()}
			getGroupBy={(option: IMod) => {
				return option.modCategoryId
					? getModCategory(option.modCategoryId).name
					: '';
			}}
			getCost={getCost}
			getLabel={getLabel}
			getDescription={getDescription}
			getExtraContent={(option: Option) =>
				getExtraContent(option, selectedDestinyClass)
			}
			textFieldClassName={`armor-slot-mod-selector-text-field${
				first ? '-first' : last ? '-last' : ''
			}`}
		/>
	);
};

export default ModSelector;
