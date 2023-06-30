import CompactIconAutocompleteDropdown from '@dlb/components/CompactIconAutocompleteDropdown';
import IconAutocompleteDropdown from '@dlb/components/IconAutocompleteDropdown';
import { EModId } from '@dlb/generated/mod/EModId';
import { getStat } from '@dlb/types/ArmorStat';
import { IMod } from '@dlb/types/generation';
import { MISSING_ICON, StatBonusStat } from '@dlb/types/globals';
import { EDestinyClassId } from '@dlb/types/IdEnums';
import { getMod } from '@dlb/types/Mod';
import { Avatar, Box, Chip } from '@mui/material';

const placeholderOption: IMod = {
	name: 'None Selected...',
	id: null,
	icon: MISSING_ICON,
	description: '',
	hash: 1234,
	cost: 0,
	isArtifactMod: false,
	modCategoryId: null,
	modSocketCategoryId: null,
	armorSlotId: null,
	armorSocketIndex: 0,
	elementOverlayIcon: null,
	similarModsAllowed: true,
	bonuses: [],
	raidAndNightmareModTypeId: null,
};

const getOptionStat = (
	stat: StatBonusStat,
	selectedDestinyClass: EDestinyClassId
) => getStat(stat, selectedDestinyClass);

const getExtraContent = (
	option: IMod,
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
	getGroupBy,
	getGroupBySort,
	getTitle,
	index,
	first,
	last,
	availableMods,
	selectedDestinyClass,
	isModDisabled,
	idPrefix,
	textFieldClassName,
	compact,
	disabled,
}: {
	selectedMods: EModId[];
	availableMods: EModId[];
	handleChange: (armorSlotModId: EModId, index: number) => void;
	getLabel: (option: IMod) => string;
	getDescription: (option: IMod) => string;
	getGroupBy: (option: IMod) => string;
	getGroupBySort: (optionA: IMod, optionB: IMod) => number;
	getCost: (option: IMod) => number;
	getTitle?: () => string;
	index: number;
	first?: boolean;
	last?: boolean;
	selectedDestinyClass: EDestinyClassId;
	isModDisabled: (mod: IMod) => boolean;
	idPrefix: string;
	textFieldClassName: string;
	compact: boolean;
	disabled?: boolean;
}) => {
	const selectedMod = getMod(selectedMods[index]);
	const options: IMod[] = [
		{ ...placeholderOption, bonuses: null },
		...availableMods
			.map((id: EModId) => {
				const mod = getMod(id);
				return {
					...mod,
					bonuses: mod.bonuses,
					// TODO: This name thing is fucking dumb but it's to prevent duplicate keys.
					// Since the Autocomplete in it's infintite wisdom uses the name as a key.
					// TODO: This probably won't necessary in Lightfall when artifice mods
					// are automatically active instead of socketed
					name: mod.name + (mod.isArtifactMod ? ' (Artifact)' : ''),
					disabled: isModDisabled(mod),
				};
			})
			// TODO: Sort this so that the general mods always appear at the top right after no option
			.sort(getGroupBySort),
	];
	const Dropdown = compact
		? CompactIconAutocompleteDropdown
		: IconAutocompleteDropdown;
	return (
		<Dropdown
			showPopupIcon={last ? true : false}
			id={`mod-selector-${idPrefix}-${index}`}
			title={getTitle ? getTitle() : ''}
			// TODO: Memoize these options
			options={options}
			value={selectedMod || placeholderOption}
			onChange={(mod: IMod) => handleChange(mod.id as EModId, index)}
			getId={(option: IMod) => option.hash.toString()}
			// TODO: Find a way to put the "General" group at the bottom
			getGroupBy={getGroupBy}
			getCost={getCost}
			getLabel={getLabel}
			getDescription={getDescription}
			getExtraContent={(option: IMod) =>
				getExtraContent(option, selectedDestinyClass)
			}
			textFieldClassName={`${textFieldClassName} ${
				first ? 'first' : last ? 'last' : ''
			}`}
			disabled={disabled}
		/>
	);
};

export default ModSelector;
