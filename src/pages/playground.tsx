import type { NextPage } from 'next';
import Head from 'next/head';
import {
	Box,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Autocomplete,
	styled,
	TextField,
	Tab,
	Tabs,
	Typography,
	Avatar,
} from '@mui/material';
import { useState } from 'react';
import BungieImage from '@dlb/dim/dim-ui/BungieImage';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

const Container = styled(Box)(({ theme }) => ({
	color: theme.palette.primary.main,
	display: 'flex',
	flexDirection: 'column',
}));

const DestinyClassAndExoticContainer = styled(Box)(({ theme }) => ({
	color: theme.palette.primary.main,
	padding: theme.spacing(4),
	display: 'flex',
	justifyContent: 'left',
	['.icon-dropdown-select']: {
		['.icon-dropdown-menu-item-text']: {
			display: 'none',
		},
	},
	['.exotic-selector-text-field fieldset']: {
		borderTopLeftRadius: '0px',
		borderBottomLeftRadius: '0px',
		borderLeftColor: 'transparent',
	},
}));

const SubclassSelectorContainer = styled(Box)(({ theme }) => ({
	padding: theme.spacing(4),
	flexBasis: '100%',
}));

const SelectContainer = styled(Box)(({ theme }) => ({}));

const MenuItemContent = styled('div')(({ theme }) => ({
	display: 'flex',
	// justifyContent: 'center',
	alignItems: 'center',
}));

const MenuItemText = styled('div')(({ theme }) => ({
	// position: 'absolute'
	marginLeft: theme.spacing(1),
	textTransform: 'capitalize',
}));

const SmallAvatar = styled(Avatar)(({ theme }) => ({
	width: 22,
	height: 22,
	border: `2px solid ${theme.palette.background.paper}`,
}));
type DestinyClassOption = {
	icon: string;
	name: string;
};

const destinyClassOptions: DestinyClassOption[] = [
	{
		icon: 'https://www.bungie.net/common/destiny2_content/icons/66289d9dce869bca5aa53beb88edf15c.jpg',
		name: 'warlock',
	},
	{
		icon: 'https://bungie.net//common/destiny2_content/icons/dded5f2f4730ea8515e71dbb36111393.jpg',
		name: 'titan',
	},
	{
		icon: 'https://www.bungie.net/common/destiny2_content/icons/f3207249663fd5f4297656e73f942a42.jpg',
		name: 'hunter',
	},
];

const exoticOptions: DestinyClassOption[] = [
	{
		icon: 'https://bungie.net//common/destiny2_content/icons/dded5f2f4730ea8515e71dbb36111393.jpg',
		name: 'Heart of Inmost Light',
	},
	{
		icon: 'https://www.bungie.net/common/destiny2_content/icons/67f7bbf158f84c33802b178e463b7037.jpg',
		name: 'Crest of Alpha Lupi',
	},
	{
		icon: 'https://www.bungie.net/common/destiny2_content/icons/78874c268891725a68bdcc35432fec9e.jpg',
		name: 'Point Contact Cannon Brace',
	},
];

const DestinyClassSelector = () => {
	const [value, setValue] = useState('warlock');

	const handleChange = (value: string) => {
		setValue(value);
	};
	return (
		<FormControl fullWidth>
			<InputLabel id="icon-dropdown-select-label">Class</InputLabel>
			<Select
				sx={{
					maxWidth: 100,
					borderTopRightRadius: 0,
					borderBottomRightRadius: 0,
				}}
				labelId="icon-dropdown-select-label"
				id="icon-dropdown-select"
				className="icon-dropdown-select"
				value={value}
				label="Class"
				onChange={(e) => {
					handleChange(e.target.value as string);
				}}
			>
				{destinyClassOptions.map((x) => {
					return (
						<MenuItem key={x.name} value={x.name}>
							<MenuItemContent>
								<BungieImage width={40} height={40} src={x.icon} />
								<MenuItemText className="icon-dropdown-menu-item-text">
									{x.name}
								</MenuItemText>
							</MenuItemContent>
						</MenuItem>
					);
				})}
			</Select>
		</FormControl>
	);
};

const ExoticSelector = () => {
	const [value, setValue] = useState(exoticOptions[0]);

	const handleChange = (value: DestinyClassOption) => {
		setValue(value);
	};
	return (
		<FormControl fullWidth>
			<Autocomplete
				id="country-select-demo"
				sx={{ width: 400 }}
				options={exoticOptions}
				autoHighlight
				value={value}
				disableClearable
				onChange={(_, value) => {
					handleChange(value as DestinyClassOption);
				}}
				isOptionEqualToValue={(option, value) => {
					return option.name == value.name && option.icon == value.icon;
				}}
				getOptionLabel={(option) => (option as DestinyClassOption).name}
				renderOption={(props, option, { inputValue }) => {
					const matches = match(option.name, inputValue, { insideWords: true });
					const parts = parse(option.name, matches);
					return (
						<Box
							component="li"
							sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
							{...props}
						>
							<BungieImage width="20" src={option.icon} alt="asdf" />
							<div>
								{parts.map((part, index) => (
									<span
										key={index}
										style={{
											fontWeight: part.highlight ? 700 : 400,
										}}
									>
										{part.text}
									</span>
								))}
							</div>
						</Box>
					);
				}}
				renderInput={(params) => {
					return (
						// <div>
						<TextField
							className="exotic-selector-text-field"
							label="Exotic"
							//labelId="icon-dropdown-select-label-2"
							{...params}
							InputProps={{
								...params.InputProps,
								startAdornment: (
									<Box
										sx={{
											marginTop: '7.5px',
											marginBottom: '1.5px',
											marginLeft: '5px',
										}}
									>
										<BungieImage width={40} height={40} src={value.icon} />
									</Box>
								),
								autoComplete: 'new-password', // disable autocomplete and autofill
							}}
						/>
						// </div>
					);
				}}
			/>
		</FormControl>
	);
};

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

function SubclassSelector() {
	const [value, setValue] = useState(0);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	return (
		<Box sx={{ width: '100%' }}>
			<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<Tabs
					value={value}
					onChange={handleChange}
					aria-label="basic tabs example"
				>
					<Tab
						label="Arc"
						{...a11yProps(1)}
						iconPosition="start"
						icon={
							<SmallAvatar
								variant="rounded"
								alt="test SmallAvatar"
								src="https://www.bungie.net/common/destiny2_content/icons/67f7bbf158f84c33802b178e463b7037.jpg"
							/>
						}
					/>
					<Tab
						label="Solar"
						{...a11yProps(2)}
						iconPosition="start"
						icon={
							<SmallAvatar
								variant="rounded"
								alt="test SmallAvatar"
								src="https://www.bungie.net/common/destiny2_content/icons/67f7bbf158f84c33802b178e463b7037.jpg"
							/>
						}
					/>
					<Tab
						label="Void"
						{...a11yProps(3)}
						iconPosition="start"
						icon={
							<SmallAvatar
								variant="rounded"
								alt="test SmallAvatar"
								src="https://www.bungie.net/common/destiny2_content/icons/67f7bbf158f84c33802b178e463b7037.jpg"
							/>
						}
					/>
					<Tab
						label="Stasis"
						{...a11yProps(4)}
						iconPosition="start"
						icon={
							<SmallAvatar
								variant="rounded"
								alt="test SmallAvatar"
								src="https://www.bungie.net/common/destiny2_content/icons/67f7bbf158f84c33802b178e463b7037.jpg"
							/>
						}
					/>
					<Tab
						label="Strand"
						{...a11yProps(5)}
						iconPosition="start"
						icon={
							<SmallAvatar
								variant="rounded"
								alt="test SmallAvatar"
								src="https://www.bungie.net/common/destiny2_content/icons/67f7bbf158f84c33802b178e463b7037.jpg"
							/>
						}
					/>
				</Tabs>
			</Box>
			<TabPanel value={value} index={0}>
				Item One
			</TabPanel>
			<TabPanel value={value} index={1}>
				Item Two
			</TabPanel>
			<TabPanel value={value} index={2}>
				Item Three
			</TabPanel>
			<TabPanel value={value} index={3}>
				Item Four
			</TabPanel>
			<TabPanel value={value} index={4}>
				Item Five
			</TabPanel>
		</Box>
	);
}

const Home: NextPage = () => {
	return (
		<>
			<Head>
				<title>Destiny Loadout Builder</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<Container>
				<DestinyClassAndExoticContainer>
					<SelectContainer>
						<DestinyClassSelector />
					</SelectContainer>
					<SelectContainer>
						<ExoticSelector />
					</SelectContainer>
				</DestinyClassAndExoticContainer>
				<SubclassSelectorContainer>
					<ExoticSelector />
				</SubclassSelectorContainer>
				<SubclassSelectorContainer>
					<SubclassSelector />
				</SubclassSelectorContainer>
			</Container>
		</>
	);
};

export default Home;
