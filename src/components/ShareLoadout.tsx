'use client';

import { selectDesiredArmorStats } from '@dlb/redux/features/desiredArmorStats/desiredArmorStatsSlice';
import { selectSelectedArmorSlotMods } from '@dlb/redux/features/selectedArmorSlotMods/selectedArmorSlotModsSlice';
import { selectSelectedAspects } from '@dlb/redux/features/selectedAspects/selectedAspectsSlice';
import { selectSelectedClassAbility } from '@dlb/redux/features/selectedClassAbility/selectedClassAbilitySlice';
import { selectSelectedDestinyClass } from '@dlb/redux/features/selectedDestinyClass/selectedDestinyClassSlice';
import { selectSelectedDestinySubclass } from '@dlb/redux/features/selectedDestinySubclass/selectedDestinySubclassSlice';
import { selectSelectedExoticArmor } from '@dlb/redux/features/selectedExoticArmor/selectedExoticArmorSlice';
import { selectSelectedFragments } from '@dlb/redux/features/selectedFragments/selectedFragmentsSlice';
import { selectSelectedGrenade } from '@dlb/redux/features/selectedGrenade/selectedGrenadeSlice';
import { selectSelectedJump } from '@dlb/redux/features/selectedJump/selectedJumpSlice';
import { selectSelectedMelee } from '@dlb/redux/features/selectedMelee/selectedMeleeSlice';
import { selectSelectedRaidMods } from '@dlb/redux/features/selectedRaidMods/selectedRaidModsSlice';
import { selectSelectedSuperAbility } from '@dlb/redux/features/selectedSuperAbility/selectedSuperAbilitySlice';
import {
	selectSharedLoadoutConfigStatPriorityOrder,
	setSharedLoadoutConfigStatPriorityOrder,
} from '@dlb/redux/features/sharedLoadoutConfigStatPriorityOrder/sharedLoadoutConfigStatPriorityOrderSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import generateDlbLink, {
	getDlbLoadoutConfiguration,
} from '@dlb/services/links/generateDlbLoadoutLink';
import { ArmorStatIdList, getArmorStat } from '@dlb/types/ArmorStat';
import { EArmorStatId } from '@dlb/types/IdEnums';
import { copyToClipboard } from '@dlb/utils/copy-to-clipboard';
import { Help } from '@mui/icons-material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ShareIcon from '@mui/icons-material/Share';
import {
	Box,
	Button,
	Collapse,
	IconButton,
	Slide,
	SlideProps,
	Snackbar,
	styled,
} from '@mui/material';
import { useState } from 'react';
import CustomTooltip from './CustomTooltip';
import { SortableList, SortableOption } from './SortableList/SortableList';

const AdvanceShareSortableOptions: SortableOption[] = ArmorStatIdList.map(
	(x) => ({
		id: x,
		label: getArmorStat(x).name,
		icon: getArmorStat(x).icon,
	})
);

const AdvancedShareOptions = () => {
	const sharedLoadoutConfigStatPriorityOrder = useAppSelector(
		selectSharedLoadoutConfigStatPriorityOrder
	);
	const dispatch = useAppDispatch();

	const handleChange = (items: SortableOption[]) => {
		dispatch(
			setSharedLoadoutConfigStatPriorityOrder(
				items.map((x) => getArmorStat(x.id as EArmorStatId).index)
			)
		);
	};
	const items = sharedLoadoutConfigStatPriorityOrder.map((index) => ({
		...AdvanceShareSortableOptions.find(
			(x) => getArmorStat(x.id as EArmorStatId).index === index
		),
	}));
	return (
		<>
			<Box sx={{ marginTop: '8px' }}>
				<Box sx={{ display: 'flex' }}>
					<Box sx={{ marginRight: '8px', fontWeight: 'bold' }}>
						Shared Stat Priority Order
					</Box>
					<CustomTooltip
						title="If the user who receives your shared loadout link is unable to
						achieve the desired stat tiers, the stats will be prioritized in the
						order below. So if you have a loadout with tier 10 in Recovery, and
						Discipline, but you think that achieving tier 10 Discipline is more
						important than tier 10 Recovery, you can drag Discipline above
						Recovery."
					>
						<Help />
					</CustomTooltip>
				</Box>
				<Box></Box>
			</Box>
			<Box sx={{ position: 'relative', width: '100%' }}>
				<Box
					sx={{
						position: 'absolute',
						overflowX: 'hidden',
						overflowY: 'hidden',
						width: 'calc(100% + 80px)',
						top: '0px',
						left: '0px',
						marginLeft: '-40px',
						paddingLeft: '40px',
						paddingRight: '40px',
						paddingTop: '16px',
						paddingBottom: '64px',
					}}
				>
					<SortableList items={items} onChange={handleChange} />
				</Box>
			</Box>
		</>
	);
};

const Container = styled('div')(({ theme }) => ({
	padding: theme.spacing(1),
	width: '100%',
	display: 'flex',
	justifyContent: 'center',
}));

const ShareLoadout = () => {
	const [toastOpen, setToastOpen] = useState(false);
	const [advancedOptionsOpen, setAdvancedOptionsOpen] = useState(false);
	const desiredArmorStats = useAppSelector(selectDesiredArmorStats);

	const selectedDestinyClass = useAppSelector(selectSelectedDestinyClass);
	const selectedFragments = useAppSelector(selectSelectedFragments);
	const selectedDestinySubclass = useAppSelector(selectSelectedDestinySubclass);
	const selectedArmorSlotMods = useAppSelector(selectSelectedArmorSlotMods);
	const selectedRaidMods = useAppSelector(selectSelectedRaidMods);

	const selectedExoticArmor = useAppSelector(selectSelectedExoticArmor);
	const selectedJump = useAppSelector(selectSelectedJump);
	const selectedMelee = useAppSelector(selectSelectedMelee);
	const selectedGrenade = useAppSelector(selectSelectedGrenade);
	const selectedClassAbility = useAppSelector(selectSelectedClassAbility);
	const selectedSuperAbility = useAppSelector(selectSelectedSuperAbility);
	const selectedAspects = useAppSelector(selectSelectedAspects);
	const sharedLoadoutConfigStatPriorityOrder = useAppSelector(
		selectSharedLoadoutConfigStatPriorityOrder
	);

	const configuration = getDlbLoadoutConfiguration({
		desiredArmorStats,
		selectedDestinyClass,
		selectedFragments,
		selectedDestinySubclass,
		selectedArmorSlotMods,
		selectedRaidMods,
		selectedExoticArmor,
		selectedJump,
		selectedMelee,
		selectedGrenade,
		selectedClassAbility,
		selectedSuperAbility,
		selectedAspects,
		sharedLoadoutConfigStatPriorityOrder,
	});
	const handleClick = async () => {
		const dlbLink = `${generateDlbLink(configuration)}`;
		await copyToClipboard({
			value: dlbLink,
		});
		setToastOpen(true);
	};

	function SlideTransition(props: SlideProps) {
		return <Slide {...props} direction="up" />;
	}

	const handleClose = (
		event: React.SyntheticEvent | Event,
		reason?: string
	) => {
		if (reason === 'clickaway') {
			return;
		}

		setToastOpen(false);
	};
	return (
		<Container>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<Button
					variant="contained"
					startIcon={<ShareIcon />}
					onClick={handleClick}
					sx={{ width: '300px' }}
				>
					Share Loadout Configuration
				</Button>
				<Snackbar
					open={toastOpen}
					autoHideDuration={3000}
					onClose={handleClose}
					message="Loadout URL copied to clipboard!"
					anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
					TransitionComponent={SlideTransition}
					ContentProps={{
						sx: {
							display: 'block',
							textAlign: 'center',
						},
					}}
				/>
				<Box
					onClick={() => setAdvancedOptionsOpen(!advancedOptionsOpen)}
					sx={{
						cursor: 'pointer',
						marginTop: '16px',
						// position: "absolute",
						// left: "50%",
						// transform: "translate(-50%, 0)",
					}}
				>
					Show Advanced Share Options
					<IconButton aria-label="expand row" size="small">
						{advancedOptionsOpen ? (
							<KeyboardArrowUpIcon />
						) : (
							<KeyboardArrowDownIcon />
						)}
					</IconButton>
				</Box>
				<Box>
					<Collapse in={advancedOptionsOpen} timeout="auto" unmountOnExit>
						<AdvancedShareOptions />
					</Collapse>
				</Box>
			</Box>
		</Container>
	);
};

export default ShareLoadout;
