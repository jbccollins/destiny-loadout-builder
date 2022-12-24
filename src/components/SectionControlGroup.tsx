import { Box, styled } from '@mui/material';

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
}));

type SelectionControlGroupProps = {
	children: React.ReactNode;
	title: React.ReactNode;
};

function SelectionControlGroup({
	children,
	title,
}: SelectionControlGroupProps) {
	return (
		<Container>
			<Title>{title}</Title>
			{children}
		</Container>
	);
}

export default SelectionControlGroup;
