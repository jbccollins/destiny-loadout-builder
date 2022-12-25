import BungieImage from '@dlb/dim/dim-ui/BungieImage';

import {
	Box,
	styled,
	Autocomplete,
	FormControl,
	TextField,
	AutocompleteProps,
	SxProps,
} from '@mui/material';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import DecoratedBungieIcon from './DecoratedBungieIcon';

const Container = styled('div')(({ theme }) => ({
	color: theme.palette.secondary.main,
	width: '100%',
	// TODO: this is a bit clunky given that it's passed by the exotic selector. Find a better way.
	['.exotic-selector-text-field fieldset']: {
		borderTopLeftRadius: '0px',
		borderBottomLeftRadius: '0px',
		padding: theme.spacing(1),
		paddingRight: 0,
	},
	['.exotic-selector-text-field > div']: {
		height: '73px',
	},
	['.armor-slot-mod-selector-text-field fieldset']: {
		borderRadius: '0px',
		marginTop: '-1px',
	},
	['.armor-slot-mod-selector-text-field-first fieldset']: {
		borderBottomLeftRadius: '0px',
		borderBottomRightRadius: '0px',
	},
	['.armor-slot-mod-selector-text-field-last fieldset']: {
		borderTopLeftRadius: '0px',
		borderTopRightRadius: '0px',
		marginTop: '-1px',
	},
}));

const ExtraContentWrapper = styled(Box)(({ theme }) => ({}));

interface IIconAutocompleteDropdownOption {
	icon: string;
	elementOverlayIcon?: string;
	disabled?: boolean;
}

type IconAutocompleteDropdownProps = {
	options: IIconAutocompleteDropdownOption[];
	value: IIconAutocompleteDropdownOption;
	onChange: (value: IIconAutocompleteDropdownOption) => void;
	getGroupBy: (value: IIconAutocompleteDropdownOption) => string;
	getLabel: (value: IIconAutocompleteDropdownOption) => string;
	getDescription?: (value: IIconAutocompleteDropdownOption) => string;
	getId: (value: IIconAutocompleteDropdownOption) => string;
	getExtraContent?: (value: IIconAutocompleteDropdownOption) => React.ReactNode;
	getCost?: (value: IIconAutocompleteDropdownOption) => number;
	// getName: (value: IIconAutocompleteDropdownOption) => string
	title: string;
	textFieldClassName?: string;
};

function IconAutocompleteDropdown({
	options,
	value,
	onChange,
	getGroupBy,
	getLabel,
	getDescription,
	getCost,
	getExtraContent,
	getId,
	title,
	textFieldClassName,
}: IconAutocompleteDropdownProps) {
	return (
		<Container>
			<FormControl fullWidth>
				<Autocomplete
					id={title}
					options={options}
					// open={true}
					autoHighlight
					value={value}
					disableClearable
					sx={{ maxHeight: '80vh' }}
					groupBy={(option) => getGroupBy(option)}
					onChange={(_, value) => {
						onChange(value as IIconAutocompleteDropdownOption);
					}}
					getOptionDisabled={(option) => option.disabled}
					isOptionEqualToValue={(option, value) => {
						return getId(option) === getId(value);
					}}
					getOptionLabel={(option) =>
						getLabel(option as IIconAutocompleteDropdownOption)
					}
					renderOption={(props, option, { inputValue }) => {
						const matches = match(getLabel(option), inputValue, {
							insideWords: true,
						});
						const parts = parse(getLabel(option), matches);
						// console.log('>>>>>>>>>>> props', props);
						return (
							<Box
								component="li"
								sx={{
									'& > img': { mr: 2, flexShrink: 0 },
									flexWrap: 'wrap',
								}}
								{...props}
							>
								<Box sx={{ display: 'flex', flexWrap: 'nowrap' }}>
									<DecoratedBungieIcon
										getCost={getCost ? () => getCost(option) : null}
										icon={option.icon}
										elementOverlayIcon={option.elementOverlayIcon}
										getAltText={() => getLabel(option)}
									/>
									<div
										style={{
											paddingTop: '8px',
											paddingLeft: '6px',
											whiteSpace: 'nowrap',
										}}
									>
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
								{getExtraContent && (
									<ExtraContentWrapper className="icon-extra-content-wrapper">
										{getExtraContent(option)}
									</ExtraContentWrapper>
								)}
							</Box>
						);
					}}
					renderInput={(params) => {
						return (
							<TextField
								className={textFieldClassName}
								label={title}
								{...params}
								InputProps={{
									...params.InputProps,
									startAdornment: (
										<Box
											sx={{
												position: 'relative',
												marginTop: '3px',
												marginBottom: '2px',
												marginLeft: '5px',
											}}
										>
											<DecoratedBungieIcon
												getCost={getCost ? () => getCost(value) : null}
												icon={value.icon}
												elementOverlayIcon={value.elementOverlayIcon}
												getAltText={() => getLabel(value)}
											/>
										</Box>
									),
									// endAdornment: (
									// 	<Box>
									// 		{getExtraContent && (
									// 			<ExtraContentWrapper className="icon-extra-content-wrapper">
									// 				{getExtraContent(value)}
									// 			</ExtraContentWrapper>
									// 		)}
									// 	</Box>
									// ),
									autoComplete: 'new-password', // disable autocomplete and autofill
								}}
							/>
						);
					}}
				/>
			</FormControl>
		</Container>
	);
}

export default IconAutocompleteDropdown;
