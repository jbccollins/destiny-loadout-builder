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
import { useAppSelector } from '@dlb/redux/hooks';
import generateDlbLink, {
	getDlbLoadoutConfiguration,
} from '@dlb/services/links/generateDlbLoadoutLink';
import { copyToClipboard } from '@dlb/utils/copy-to-clipboard';
import ShareIcon from '@mui/icons-material/Share';
import { Button, Slide, SlideProps, Snackbar, styled } from '@mui/material';
import { useState } from 'react';

const Container = styled('div')(({ theme }) => ({
	padding: theme.spacing(1),
	width: '100%',
	display: 'flex',
	justifyContent: 'center',
}));

const ShareLoadout = () => {
	const [open, setOpen] = useState(false);
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
	});
	const handleClick = async () => {
		const dlbLink = `${generateDlbLink(configuration)}`;
		await copyToClipboard({
			value: dlbLink,
		});
		setOpen(true);
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

		setOpen(false);
	};
	return (
		<Container>
			{/* <IconButton aria-label="share" onClick={handleClick}>
				<ShareIcon /> Share Loadout
			</IconButton> */}
			<Button
				variant="contained"
				startIcon={<ShareIcon />}
				onClick={handleClick}
			>
				Share Loadout Configuration
			</Button>
			<Snackbar
				open={open}
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
		</Container>
	);
};

export default ShareLoadout;
