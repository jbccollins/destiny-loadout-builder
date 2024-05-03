import { getSharedLoadout } from '@dlb/dim/dim-api/dim-api';
import useApplyAnalyzableLoadout from '@dlb/hooks/useApplyAnalyzableLoadout';
import { selectAllClassItemMetadata } from '@dlb/redux/features/allClassItemMetadata/allClassItemMetadataSlice';
import { selectArmor } from '@dlb/redux/features/armor/armorSlice';
import { selectAvailableExoticArmor } from '@dlb/redux/features/availableExoticArmor/availableExoticArmorSlice';
import { DimLoadoutWithId } from '@dlb/redux/features/dimLoadouts/dimLoadoutsSlice';
import { useAppSelector } from '@dlb/redux/hooks';
import { extractDimLoadout } from '@dlb/services/loadoutAnalyzer/loadoutExtraction';
import { flattenArmor } from '@dlb/services/loadoutAnalyzer/utils';
import { AnalyzableLoadout } from '@dlb/types/AnalyzableLoadout';
import { EMasterworkAssumption } from '@dlb/types/IdEnums';
import DownloadIcon from '@mui/icons-material/Download';
import LoadingButton from '@mui/lab/LoadingButton';
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	TextField,
} from '@mui/material';
import { DimIcon } from '@public/dim_logo.svgicon';
import { useMemo, useState } from 'react';
import CustomTooltip from './CustomTooltip';

export default function DimImportDialog() {
	const [open, setOpen] = useState(false);
	const [importing, setImporting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [url, setUrl] = useState('');

	const applyLoadout = useApplyAnalyzableLoadout();

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const armor = useAppSelector(selectArmor);
	const allClassItemMetadata = useAppSelector(selectAllClassItemMetadata);
	const availableExoticArmor = useAppSelector(selectAvailableExoticArmor);

	const armorItems = useMemo(() => {
		return flattenArmor(armor, allClassItemMetadata);
	}, [armor, allClassItemMetadata]);

	//e.g: https://dim.gg/mufyc6i/GP-Solar-Celestial
	const handleImport = async (): Promise<AnalyzableLoadout> => {
		console.log('>>>>> handleImport', url);
		setImporting(true);
		setError(null);

		// does the url look like dim.gg/shareId
		const urlParts = url.split('/');
		if (urlParts.length < 4 || urlParts[2] !== 'dim.gg') {
			setError(
				'Invalid DIM share URL. DIM share urls look something like: https://dim.gg/mufyc6i/GP-Solar-Celestial'
			);
			setImporting(false);
			return;
		}
		const shareId = urlParts[3];
		try {
			const dimLoadout = await getSharedLoadout(shareId);
			const dimLoadoutWithId: DimLoadoutWithId = {
				...dimLoadout,
				dlbGeneratedId: '',
			};

			const loadout = extractDimLoadout({
				dimLoadout: dimLoadoutWithId,
				armorItems,
				masterworkAssumption: EMasterworkAssumption.All,
				availableExoticArmor,
			});
			applyLoadout(loadout, false);
			setImporting(false);
			setError(null);
			setOpen(false);
			console.log('>>>>> imported', loadout);
			return loadout;
		} catch (e) {
			setError('There was a problem fetching the DIM loadout');
			setImporting(false);
			return;
		}
	};

	return (
		<>
			<CustomTooltip title="Import Loadout from DIM">
				<Button
					startIcon={<DimIcon sx={{ marginTop: '-2px' }} />}
					endIcon={<DownloadIcon />}
					variant="outlined"
					color="primary"
					onClick={handleOpen}
				/>
			</CustomTooltip>

			<Dialog open={open} onClose={handleClose} fullWidth>
				<DialogTitle>Import DIM Loadout</DialogTitle>
				<DialogContent>
					<Box sx={{ paddingTop: '8px' }}>
						<TextField
							label="Paste DIM Share URL"
							fullWidth
							onChange={(e) => setUrl(e.target.value)}
						/>
						{error && (
							<DialogContentText color="error">{error}</DialogContentText>
						)}
					</Box>
				</DialogContent>
				<DialogActions>
					<LoadingButton
						loading={importing}
						variant="contained"
						onClick={handleImport}
					>
						Import
					</LoadingButton>
					<Button
						variant="contained"
						color="secondary"
						disabled={importing}
						onClick={handleClose}
					>
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
