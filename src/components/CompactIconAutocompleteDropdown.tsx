"use client";

import {
	Autocomplete,
	Box,
	FormControl,
	Popper,
	TextField,
	styled,
	useTheme,
} from "@mui/material";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import DecoratedBungieIcon from "./DecoratedBungieIcon";
import IconAutocompleteDropdown from "./IconAutocompleteDropdown";

const StyledPopper = styled(Popper)({
	display: "none",
});

const Container = styled("div", {
	shouldForwardProp: (prop) => prop !== "open",
})<{ open: boolean }>(({ theme, open }) => ({
	color: theme.palette.secondary.main,
	[".armor-slot-mod-selector-text-field"]: {
		["fieldset"]: {
			marginLeft: "-1px",
			borderRadius: "0px",
			borderColor: open ? "white" : "",
			borderWidth: open ? "2px" : "",
		},
		["&.first fieldset"]: {
			marginLeft: 0,
			borderTopLeftRadius: "inherit",
			borderBottomLeftRadius: "inherit",
		},
		["&.last fieldset"]: {
			borderTopRightRadius: "inherit",
			borderBottomRightRadius: "inherit",
		},
	},

	[".outer-text-field input"]: {
		maxWidth: "0px !important",
		minWidth: "0px !important",
		padding: "0px !important",
	},
	[".outer-text-field > div"]: {
		cursor: "pointer",
	},
}));

const ExtraContentWrapper = styled(Box)(({ theme }) => ({}));

interface IIconAutocompleteDropdownOption {
	icon: string;
	elementOverlayIcon?: string;
	disabled?: boolean;
	name: string;
}

type CompactIconAutocompleteDropdown = {
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
	id: string;
	showPopupIcon: boolean;
};

function CompactIconAutocompleteDropdown(
	props: CompactIconAutocompleteDropdown
) {
	const {
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
		id,
		showPopupIcon,
	} = props;
	const theme = useTheme();
	const [open, setOpen] = useState(false);

	// All this "isMobile" hackyness is to prevent the virtual keyboard
	// from opening on mobile devices
	const handleOpen = () => {
		setOpen(true);
		if (!isMobile) {
			setTimeout(() => {
				const input = document.getElementById(id) as HTMLInputElement;
				input.focus();
				input.select();
			}, 1);
		}
	};
	const handleClose = (close: boolean) => {
		if (close && !isMobile) {
			setOpen(false);
		} else if (isMobile) {
			setOpen(false);
		}
	};

	useEffect(() => {
		if (isMobile) {
			const textField = document.getElementsByClassName(textFieldClassName ?? "")[0];
			if (textField) {
				const input = textField.querySelector("input");
				if (input) {
					input.disabled = true;
				}
			}
		}
	}, [textFieldClassName]);

	return (
		<Box>
			{open && (
				<Box
					className="dropdown-wrapper"
					sx={{
						background: "rgb(19, 19, 19)", // TODO: Fix this color
						position: "absolute",
						top: `calc(100% - ${theme.spacing(1)})`,
						width: "100%",
						zIndex: "300",
						left: "0px",
						marginTop: "-2px",
					}}
				>
					<IconAutocompleteDropdown
						isControlled
						isOpen={open}
						onClose={() => handleClose(true)}
						showIcon={false}
						{...props}
					/>
				</Box>
			)}
			<Container open={open}>
				<FormControl fullWidth sx={{ cursor: "pointer !important" }}>
					<Autocomplete
						// forcePopupIcon={false}
						// forcePopupIcon={showPopupIcon ? true : false}
						PopperComponent={StyledPopper}
						open={open}
						onOpen={handleOpen}
						onClose={() => handleClose(false)}
						onFocus={handleOpen}
						id={`${id}-compact`}
						options={options}
						autoHighlight
						value={value}
						disableClearable
						sx={{ maxHeight: "80vh" }}
						groupBy={(option) => getGroupBy(option)}
						onChange={(_, value) => {
							onChange(value as IIconAutocompleteDropdownOption);
						}}
						getOptionDisabled={(option) => !!option.disabled}
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
										"& > img": { mr: 2, flexShrink: 0 },
										flexWrap: "wrap",
									}}
									{...props}
								>
									<Box sx={{ display: "flex", flexWrap: "nowrap" }}>
										<DecoratedBungieIcon
											getCost={getCost ? () => getCost(option) : undefined}
											icon={option.icon}
											elementOverlayIcon={option.elementOverlayIcon}
											getAltText={() => getLabel(option)}
										/>
										<div
											style={{
												paddingTop: "8px",
												paddingLeft: "6px",
												whiteSpace: "nowrap",
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
									className={`${textFieldClassName} outer-text-field`}
									label={title}
									{...params}
									InputProps={{
										...params.InputProps,
										startAdornment: (
											<Box
												sx={{
													position: "relative",
													marginTop: "3px",
													marginBottom: "2px",
													marginLeft: "5px",
													paddingRight: "6px",
													// cursor: "pointer",
												}}
											>
												<DecoratedBungieIcon
													getCost={getCost ? () => getCost(value) : undefined}
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
										autoComplete: "new-password", // disable autocomplete and autofill
									}}
								/>
							);
						}}
					/>
				</FormControl>
			</Container>
		</Box>
	);
}

export default CompactIconAutocompleteDropdown;
