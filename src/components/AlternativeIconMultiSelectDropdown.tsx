import BungieImage from '@dlb/dim/dim-ui/BungieImage';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { Box, styled } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const Tag = styled(Box)(({ theme }) => ({
	padding: theme.spacing(1),
	display: 'flex',
	justifyContent: 'left',
}));

export interface IIconMultiSelectDropdownOption {
	icon: string;
	name: string;
	id: string;
}

type IIconMultiSelectDropdownProps = {
	options: IIconMultiSelectDropdownOption[];
	value: IIconMultiSelectDropdownOption[];
	onChange: (value: IIconMultiSelectDropdownOption) => void;
	getGroupBy: (value: IIconMultiSelectDropdownOption) => string;
	getLabel: (value: IIconMultiSelectDropdownOption) => string;
	getId: (value: IIconMultiSelectDropdownOption) => string;
	// getName: (value: IIconMultiSelectDropdownOption) => string
	title: string;
	id: string;
};

export default function IconMultiSelectDropdown({
	options,
	value,
	onChange,
	getGroupBy,
	getLabel,
	getId,
	title,
	id,
}: IIconMultiSelectDropdownProps) {
	return (
		<Autocomplete
			multiple
			value={value}
			id={id}
			options={options}
			disableCloseOnSelect
			isOptionEqualToValue={(option, value) => {
				return getId(option) === getId(value);
			}}
			groupBy={(option) => getGroupBy(option)}
			onChange={(_, value) => {
				onChange(value as unknown as IIconMultiSelectDropdownOption);
			}}
			getOptionLabel={(option) =>
				getLabel(option as IIconMultiSelectDropdownOption)
			}
			renderTags={(tagValue, getTagProps) =>
				tagValue.map((option, index) => {
					const { onDelete, key, className, tabIndex } = getTagProps({
						index,
					});

					return (
						<Tag
							onClick={(e) => onDelete(e)}
							key={key}
							className={className}
							tabIndex={tabIndex}
						>
							<BungieImage src={option.icon} width={40} height={40} />
							<div>{getLabel(option as IIconMultiSelectDropdownOption)}</div>
						</Tag>
						// <Chip
						// 	avatar={<Avatar alt={option.name} src={option.icon} />}
						// 	label={getLabel(option as IIconMultiSelectDropdownOption)}
						// 	{...getTagProps({ index })}
						// 	//disabled={fixedOptions.indexOf(option) !== -1}
						// />
					);
				})
			}
			renderOption={(props, option, { selected }) => (
				<li {...props}>
					<Checkbox
						icon={icon}
						checkedIcon={checkedIcon}
						style={{ marginRight: 8 }}
						checked={selected}
					/>
					{getLabel(option as IIconMultiSelectDropdownOption)}
				</li>
			)}
			style={{ width: '100%' }}
			renderInput={(params) => (
				<TextField {...params} label={title} placeholder="Fragments" />
			)}
		/>
	);
}

// const options = FragmentIdList.map((id) => getFragment(id));

// const FragmentSelector = () => {
// 	const [value, setValue] = React.useState<any>([options[0]]);

// 	const handleChange = (fragments: IFragment) => {
// 		setValue(fragments);
// 	};

// 	return (
// 		<Container>
// 			<IconMultiSelectDropdown
// 				options={options}
// 				value={value}
// 				onChange={handleChange}
// 				getId={(option: IFragment) => option.id}
// 				getGroupBy={
// 					(option: IFragment) => '' // ArmorSlotIdToArmorSlot.get(option.armorSlot).name
// 				}
// 				getLabel={(option: IFragment) => option.name}
// 				title={'Fragments'}
// 				id={'fragment-selector'}
// 			/>
// 		</Container>
// 	);
// };
