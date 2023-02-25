import { Box, Button, styled } from '@mui/material';

const Container = styled(Box)(({ theme }) => ({
	//paddingLeft: theme.spacing(1),
	marginBottom: theme.spacing(2),
	// borderLeft: `1px solid rgb(128, 128, 128)`,
}));

const Title = styled(Box)(({ theme }) => ({
	marginBottom: theme.spacing(1),
	paddingLeft: theme.spacing(1),
	fontSize: theme.typography.h6.fontSize,
	fontWeight: theme.typography.h6.fontWeight,
	display: 'flex',
}));

type SelectionControlGroupProps = {
	children: React.ReactNode;
	title: React.ReactNode;
	clearHandler?: () => void;
};

function SelectionControlGroup({
	children,
	title,
	clearHandler,
}: SelectionControlGroupProps) {
	return (
		<Container>
			<Title>
				<Box sx={{ flex: 1 }}>{title}</Box>
				{clearHandler && (
					<Button size="small" variant="outlined" onClick={clearHandler}>
						Clear
					</Button>
				)}
			</Title>
			{children}
		</Container>
	);
}

export default SelectionControlGroup;
