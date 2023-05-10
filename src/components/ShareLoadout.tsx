import {
	Button,
	IconButton,
	Slide,
	SlideProps,
	Snackbar,
	styled,
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import { EFragmentId } from '@dlb/generated/fragment/EFragmentId';
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
import { selectSelectedMasterworkAssumption } from '@dlb/redux/features/selectedMasterworkAssumption/selectedMasterworkAssumptionSlice';
import { selectSelectedMelee } from '@dlb/redux/features/selectedMelee/selectedMeleeSlice';
import { selectSelectedRaidMods } from '@dlb/redux/features/selectedRaidMods/selectedRaidModsSlice';
import { selectSelectedSuperAbility } from '@dlb/redux/features/selectedSuperAbility/selectedSuperAbilitySlice';
import { useAppSelector } from '@dlb/redux/hooks';
import {
	ArmorStatMapping,
	getArmorStatMappingFromFragments,
} from '@dlb/types/ArmorStat';
import { getDestinySubclass } from '@dlb/types/DestinySubclass';
import { getFragment } from '@dlb/types/Fragment';
import { EElementId } from '@dlb/types/IdEnums';
import generateDlbLink from '@dlb/services/links/generateDlbLoadoutLink';
import { copyToClipboard } from '@dlb/utils/copy-to-clipboard';
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
	const exoticArmor = selectedExoticArmor[selectedDestinyClass];
	const selectedJump = useAppSelector(selectSelectedJump);
	const selectedMelee = useAppSelector(selectSelectedMelee);
	const selectedGrenade = useAppSelector(selectSelectedGrenade);
	const selectedClassAbility = useAppSelector(selectSelectedClassAbility);
	const selectedSuperAbility = useAppSelector(selectSelectedSuperAbility);
	const selectedAspects = useAppSelector(selectSelectedAspects);
	const destinySubclassId = selectedDestinySubclass[selectedDestinyClass];

	let elementId: EElementId = EElementId.Any;
	if (destinySubclassId) {
		elementId = getDestinySubclass(destinySubclassId).elementId;
	}
	const aspectIds = destinySubclassId ? selectedAspects[destinySubclassId] : [];

	// TODO: Having to do this cast sucks
	const fragmentIds =
		elementId !== EElementId.Any
			? (selectedFragments[elementId] as EFragmentId[])
			: [];

	// const { elementId } = getDestinySubclass(destinySubclassId);
	// const aspectIds = selectedAspects[destinySubclassId];

	// TODO: Having to do this cast sucks
	// const fragmentIds = selectedFragments[elementId] as EFragmentId[];

	const fragmentArmorStatMappings: Partial<
		Record<EFragmentId, ArmorStatMapping>
	> = {};
	fragmentIds.forEach((id) => {
		const { bonuses } = getFragment(id);
		if (bonuses.length > 0) {
			fragmentArmorStatMappings[id] = getArmorStatMappingFromFragments(
				[id],
				selectedDestinyClass
			);
		}
	});
	const handleClick = async () => {
		const dlbLink = `${generateDlbLink({
			raidModIdList: selectedRaidMods,
			armorSlotMods: selectedArmorSlotMods,
			fragmentIdList: fragmentIds,
			aspectIdList: aspectIds,
			exoticArmor: exoticArmor,
			destinySubclassId,
			destinyClassId: selectedDestinyClass,
			jumpId: selectedJump[destinySubclassId],
			meleeId: selectedMelee[destinySubclassId],
			superAbilityId: selectedSuperAbility[destinySubclassId],
			classAbilityId: selectedClassAbility[destinySubclassId],
			grenadeId: selectedGrenade[elementId],
			desiredArmorStats,
		})}`;
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
