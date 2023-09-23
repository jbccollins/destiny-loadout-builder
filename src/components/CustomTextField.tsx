import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, TextField, TextFieldProps } from '@mui/material';

type CustomTextFieldProps = {
	label: string;
	onChange: (string) => void;
	value: string;
	textFieldProps: TextFieldProps;
};
export default function CustomTextField(props: CustomTextFieldProps) {
	const { label, onChange, value, textFieldProps } = props;

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		onChange(event.target.value);
	};

	return (
		<Box
			sx={{
				width: '100%',
				height: '100%',
				position: 'relative',
			}}
		>
			<TextField
				{...textFieldProps}
				label={label}
				onChange={handleChange}
				value={value}
			/>
			{value !== '' && (
				<IconButton
					onClick={() => onChange('')}
					sx={{
						position: 'absolute',
						right: 0,
						top: 0,
					}}
				>
					<CloseIcon />
				</IconButton>
			)}
		</Box>
	);
}
