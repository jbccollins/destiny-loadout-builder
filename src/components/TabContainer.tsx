import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import * as React from 'react';

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
			{value === index && <Box sx={{ paddingTop: 2 }}>{children}</Box>}
		</div>
	);
}

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

interface TabContainerItem {
	content: React.ReactNode;
	index: number;
	title: React.ReactNode;
	icon?: React.ReactElement;
}

interface TabContainerProps {
	tabs: TabContainerItem[];
	onChange: (value: number) => void;
	tabIndex: number;
}

export default function BasicTabs(props: TabContainerProps) {
	const { tabs, onChange, tabIndex } = props;

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		onChange(newValue);
	};

	return (
		<Box sx={{ width: '100%' }}>
			<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<Tabs
					value={tabIndex}
					onChange={handleChange}
					aria-label="basic tabs example"
				>
					{tabs.map(({ index, title, icon }) => (
						<Tab
							key={index}
							// label={title}
							icon={icon}
							iconPosition="start"
							{...a11yProps(index)}
						/>
					))}
				</Tabs>
			</Box>
			{tabs.map(({ content, index }) => (
				<TabPanel key={index} value={tabIndex} index={index}>
					{content}
				</TabPanel>
			))}
			{/* <TabPanel value={value} index={0}>
				Item One
			</TabPanel>
			<TabPanel value={value} index={1}>
				Item Two
			</TabPanel>
			<TabPanel value={value} index={2}>
				Item Three
			</TabPanel> */}
		</Box>
	);
}
