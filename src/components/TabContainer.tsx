'use client';

import BungieImage from '@dlb/dim/dim-ui/BungieImage';
import { SxProps } from '@mui/material';
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

export interface TabContainerItem {
	content: React.ReactNode;
	index: number;
	title: React.ReactNode;
	icon?: React.ReactElement | string;
}

interface TabContainerProps {
	tabs: TabContainerItem[];
	onChange: (value: number) => void;
	tabIndex: number;
	tabsWrapperSx?: SxProps;
	tabSx?: SxProps;
}

export default function TabContainer(props: TabContainerProps) {
	const { tabs, onChange, tabIndex, tabsWrapperSx, tabSx } = props;
	const _tabsWrapperSx = tabsWrapperSx || {};
	const _tabSx = tabSx || {};

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		onChange(newValue);
	};

	return (
		<Box sx={{ width: '100%' }}>
			<Box
				className="tabs-wrapper"
				sx={{ borderBottom: 1, borderColor: 'divider', ..._tabsWrapperSx }}
			>
				<Tabs value={tabIndex} onChange={handleChange} aria-label="tabs">
					{tabs.map(({ index, title, icon }) => {
						const _icon =
							typeof icon === 'string' ? (
								<BungieImage width={40} height={40} src={icon} />
							) : (
								icon
							);
						return (
							<Tab
								key={index}
								label={title}
								icon={_icon}
								iconPosition="top"
								sx={{
									fontSize: '12px',
									minWidth: '64px',
									..._tabSx,
								}}
								{...a11yProps(index)}
							/>
						);
					})}
				</Tabs>
			</Box>
			{tabs.map(({ content, index }) => (
				<TabPanel key={index} value={tabIndex} index={index}>
					{content}
				</TabPanel>
			))}
		</Box>
	);
}
