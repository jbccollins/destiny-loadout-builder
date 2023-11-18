'use client';

import BungieImage from '@dlb/dim/dim-ui/BungieImage';
import { IArmorStat } from '@dlb/types/ArmorStat';
import { getElement } from '@dlb/types/Element';
import { StatBonus, StatBonusStat } from '@dlb/types/globals';
import { EElementId } from '@dlb/types/IdEnums';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import {
	Avatar,
	Box,
	Chip,
	FormControl,
	MenuItem,
	Select,
	styled,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';

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
			// maxHeight: '70vh',
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
	elementId: EElementId;
}

type IIconMultiSelectDropdownProps = {
	options: IOption[];
	value: string[];
	onChange: (value: string[]) => void;
	// getName: (value: IIconMultiSelectDropdownOption) => string
	title: string;
	id: string;
	getOptionValue: (id: string) => IOption;
	getOptionStat: (stat: StatBonusStat) => IArmorStat;
	showElement?: boolean;
};

const PLACEHOLDER_OPTION = 'None Selected...';

export default function IconMultiSelectDropdown({
	options,
	value,
	onChange,
	title,
	id,
	getOptionValue,
	getOptionStat,
	showElement,
}: IIconMultiSelectDropdownProps) {
	const handleChange = (event: unknown, value: any) => {
		// On autofill we get a stringified value.
		// typeof value === 'string' ? value.split(',') : value,
		// onChange(value.filter(({ id }) => id != PLACEHOLDER_OPTION));
	};

	return (
		<FormControl fullWidth>
			{/* <InputLabel id={title}>{title}</InputLabel> */}

			{/* <Autocomplete
				multiple
				id="checkboxes-tags-demo"
				options={top100Films}
				disableCloseOnSelect
				onChange={handleChange}
				// getOptionLabel={(option) => option.title}
				renderOption={(props, option, { selected }) => (
					<li {...props}>
						<Checkbox
							icon={icon}
							checkedIcon={checkedIcon}
							style={{ marginRight: 8 }}
							checked={selected}
						/>
						{option.title}
					</li>
				)}
				style={{ width: 500 }}
				renderInput={(params) => (
					<TextField {...params} label="Checkboxes" placeholder="Favorites" />
				)}
			/> */}

			<Autocomplete
				multiple
				id={id}
				options={options}
				// value={[]}
				onChange={handleChange}
				disableCloseOnSelect
				getOptionLabel={(option) =>
					typeof option === 'string' ? option : option.name
				}
				renderOption={(props, option, { selected }) => {
					// <li {...props}>
					// 	<Checkbox
					// 		key={option.id}
					// 		icon={icon}
					// 		checkedIcon={checkedIcon}
					// 		style={{ marginRight: 8 }}
					// 		checked={selected}
					// 	/>
					// 	{option.name}
					// </li>

					return (
						<MenuItem
							key={option.id}
							value={option.id}
							//style={getStyles(name, personName, theme)}
						>
							<MenuItemContent>
								<MenuItemRow>
									<Checkbox
										icon={icon}
										checkedIcon={checkedIcon}
										style={{ marginRight: 8 }}
										checked={value.indexOf(id) > -1}
										//onChange={handleChange}
									/>
									<BungieImage width={40} height={40} src={option.icon} />
									<MenuItemText>{option.name}</MenuItemText>
									{showElement && (
										<BungieImage
											style={{ marginLeft: '6px' }}
											width={20}
											height={20}
											src={getElement(option.elementId).icon}
										/>
									)}
								</MenuItemRow>
								<MenuItemRow style={{ paddingTop: 8 }}>
									<MenuItemText>{option.description}</MenuItemText>
								</MenuItemRow>
								{option.bonuses && option.bonuses.length > 0 && (
									<MenuItemRow style={{ paddingTop: 8 }}>
										<MenuItemText>Bonuses:</MenuItemText>
										{option.bonuses.map(({ stat, value }) => {
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
				}}
				style={{ width: '100%' }}
				renderInput={(params) => (
					<TextField {...params} label="Checkboxes" placeholder="Favorites" />
				)}
			/>
		</FormControl>
	);
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
	{ title: 'The Shawshank Redemption', year: 1994 },
	{ title: 'The Godfather', year: 1972 },
	{ title: 'The Godfather: Part II', year: 1974 },
	{ title: 'The Dark Knight', year: 2008 },
	{ title: '12 Angry Men', year: 1957 },
	{ title: "Schindler's List", year: 1993 },
	{ title: 'Pulp Fiction', year: 1994 },
	{
		title: 'The Lord of the Rings: The Return of the King',
		year: 2003,
	},
	{ title: 'The Good, the Bad and the Ugly', year: 1966 },
	{ title: 'Fight Club', year: 1999 },
	{
		title: 'The Lord of the Rings: The Fellowship of the Ring',
		year: 2001,
	},
	{
		title: 'Star Wars: Episode V - The Empire Strikes Back',
		year: 1980,
	},
	{ title: 'Forrest Gump', year: 1994 },
	{ title: 'Inception', year: 2010 },
	{
		title: 'The Lord of the Rings: The Two Towers',
		year: 2002,
	},
	{ title: "One Flew Over the Cuckoo's Nest", year: 1975 },
	{ title: 'Goodfellas', year: 1990 },
	{ title: 'The Matrix', year: 1999 },
	{ title: 'Seven Samurai', year: 1954 },
	{
		title: 'Star Wars: Episode IV - A New Hope',
		year: 1977,
	},
	{ title: 'City of God', year: 2002 },
	{ title: 'Se7en', year: 1995 },
	{ title: 'The Silence of the Lambs', year: 1991 },
	{ title: "It's a Wonderful Life", year: 1946 },
	{ title: 'Life Is Beautiful', year: 1997 },
	{ title: 'The Usual Suspects', year: 1995 },
	{ title: 'Léon: The Professional', year: 1994 },
	{ title: 'Spirited Away', year: 2001 },
	{ title: 'Saving Private Ryan', year: 1998 },
	{ title: 'Once Upon a Time in the West', year: 1968 },
	{ title: 'American History X', year: 1998 },
	{ title: 'Interstellar', year: 2014 },
];
