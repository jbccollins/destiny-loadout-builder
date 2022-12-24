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
	['.armor-slot-mod-selector-text-field-0 fieldset']: {
		borderBottomLeftRadius: '0px',
		borderBottomRightRadius: '0px',
	},
	['.armor-slot-mod-selector-text-field-1 fieldset']: {
		borderTopLeftRadius: '0px',
		borderTopRightRadius: '0px',
		marginTop: '-1px',
	},
}));

const ExtraIconWrapper = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'withMarginTop',
})<{ withMarginTop?: boolean }>(({ theme, withMarginTop }) => ({
	position: 'absolute',
	top: '0px',
	marginTop: withMarginTop ? '6px' : '0px',
}));

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
						return (
							<Box
								component="li"
								sx={{
									'& > img': { mr: 2, flexShrink: 0 },
									position: 'relative',
								}}
								{...props}
								// This does not fix the unique key issue
								// key={getId(option)}
							>
								{/* <Box sx={{ position: 'relative' }}> */}
								<BungieImage
									width="40"
									src={option.icon}
									alt={getLabel(option)}
								/>
								{option.elementOverlayIcon && (
									<ExtraIconWrapper withMarginTop>
										<BungieImage
											width="40"
											src={option.elementOverlayIcon}
											alt={`${getLabel(option)}-element-overlay`}
										/>
									</ExtraIconWrapper>
								)}
								{/* </Box> */}
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
								{getExtraContent && getExtraContent(option)}
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
												marginTop: '7.5px',
												marginBottom: '1.5px',
												marginLeft: '5px',
											}}
										>
											<BungieImage width={40} height={40} src={value.icon} />
											{value.elementOverlayIcon && (
												<ExtraIconWrapper>
													<BungieImage
														width="40"
														src={value.elementOverlayIcon}
														alt={`${getLabel(value)}-element-overlay`}
													/>
												</ExtraIconWrapper>
											)}
										</Box>
									),
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
