import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import {
	Avatar,
	Box,
	Chip,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	styled,
} from '@mui/material';
import BungieImage from '@dlb/dim/dim-ui/BungieImage';
import { getFragment } from '@dlb/types/Fragment';
import { EFragmentId } from '@dlb/types/IdEnums';
import { getArmorStat, IArmorStat } from '@dlb/types/ArmorStat';
import { StatBonus, StatBonusStat } from '@dlb/types/globals';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const Container = styled(Box)(({ theme }) => ({
	//color: theme.palette.primary.main,
	padding: theme.spacing(1),
	// display: 'flex',
	// justifyContent: 'left',
}));

const MenuItemContent = styled('div')(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	flexWrap: 'nowrap',
}));

const MenuItemRow = styled('div')(({ theme }) => ({
	flex: 1,
	display: 'flex',
	alignItems: 'center',
	flexWrap: 'nowrap',
	// textTransform: 'capitalize'
}));

const MenuItemText = styled('div')(({ theme }) => ({
	marginLeft: theme.spacing(1),
	whiteSpace: 'initial',
	// textTransform: 'capitalize'
}));

const Tag = styled(Box)(({ theme }) => ({
	padding: theme.spacing(1),
	display: 'flex',
	justifyContent: 'left',
	alignItems: 'center',
}));

const StyledSelect = styled(Select)(({ theme }) => ({
	color: theme.palette.secondary.main,
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			// maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

interface IOption {
	name: string;
	id: string;
	icon: string;
	description: string;
	bonuses?: StatBonus[];
}

type IIconMultiSelectDropdownProps = {
	options: string[];
	value: string[];
	onChange: (value: string[]) => void;
	// getName: (value: IIconMultiSelectDropdownOption) => string
	title: string;
	id: string;
	getOptionValue: (id: string) => IOption;
	getOptionStat: (stat: StatBonusStat) => IArmorStat;
};

export default function IconMultiSelectDropdown({
	options,
	value,
	onChange,
	title,
	id,
	getOptionValue,
	getOptionStat,
}: IIconMultiSelectDropdownProps) {
	const handleChange = (event: SelectChangeEvent<string[]>) => {
		const {
			target: { value },
		} = event;
		// On autofill we get a stringified value.
		// typeof value === 'string' ? value.split(',') : value,
		onChange(value as string[]);
	};

	return (
		<FormControl fullWidth>
			<InputLabel id={title}>{title}</InputLabel>
			<Select
				MenuProps={MenuProps}
				multiple
				value={value}
				id={id}
				title={title}
				label={title}
				labelId={title}
				onChange={handleChange}
				renderValue={(options) =>
					options.map((id) => {
						const optionValue = getOptionValue(id);
						return (
							<Tag
								//onClick={(e) => onDelete(e)}
								key={optionValue.id}
							>
								<BungieImage src={optionValue.icon} width={'40px'} />
								<MenuItemText>{optionValue.name}</MenuItemText>
							</Tag>
						);
					})
				}
				style={{ width: '100%' }}
			>
				{options.map((id) => {
					const optionValue = getOptionValue(id);
					return (
						<MenuItem
							key={optionValue.id}
							value={optionValue.id}
							//style={getStyles(name, personName, theme)}
						>
							<MenuItemContent>
								<MenuItemRow>
									<Checkbox
										icon={icon}
										checkedIcon={checkedIcon}
										style={{ marginRight: 8 }}
										checked={value.indexOf(id) > -1}
									/>
									<BungieImage width={40} height={40} src={optionValue.icon} />
									<MenuItemText>{optionValue.name}</MenuItemText>
								</MenuItemRow>
								<MenuItemRow style={{ paddingTop: 8 }}>
									<MenuItemText>{optionValue.description}</MenuItemText>
								</MenuItemRow>
								{optionValue.bonuses && optionValue.bonuses.length > 0 && (
									<MenuItemRow style={{ paddingTop: 8 }}>
										<MenuItemText>Bonuses:</MenuItemText>
										{optionValue.bonuses.map(({ stat, value }) => {
											const { icon: statIcon, id: statId } =
												getOptionStat(stat);
											return (
												<Chip
													style={{ marginLeft: '8px' }}
													key={statId}
													avatar={<Avatar alt={'stat-icon'} src={statIcon} />}
													label={value > 0 ? `+${value}` : value}
												/>
											);
										})}
									</MenuItemRow>
								)}
							</MenuItemContent>
						</MenuItem>
					);
				})}
			</Select>
		</FormControl>
	);
}
