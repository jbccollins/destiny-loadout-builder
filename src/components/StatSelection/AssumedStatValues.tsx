import CustomTooltip from '@dlb/components/CustomTooltip';
import BungieImage from '@dlb/dim/dim-ui/BungieImage';
import {
	selectSelectedAssumedStatValues,
	setSelectedAssumedStatValues,
} from '@dlb/redux/features/selectedAssumedStatValues/selectedAssumedStatValuesSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { ArmorStatIdList, getArmorStat } from '@dlb/types/ArmorStat';
import { EArmorStatId } from '@dlb/types/IdEnums';
import HelpIcon from '@mui/icons-material/Help';
import { Box, TextField, styled } from '@mui/material';

// Hide the number input spinner thingy
const StyledTextField = styled(TextField)`
	& input[type='number']::-webkit-inner-spin-button,
	& input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	& input[type='number'] {
		-moz-appearance: textfield;
	}
`;

export default function AssumedStatValues() {
	const assumedStatValues = useAppSelector(selectSelectedAssumedStatValues);
	const dispatch = useAppDispatch();

	const handleChange = (armorStatId: EArmorStatId, value: number) => {
		dispatch(
			setSelectedAssumedStatValues({
				...assumedStatValues,
				[armorStatId]: value,
			})
		);
	};
	return (
		<Box
			sx={{
				background: '#2b2b2b',
				padding: '8px',
			}}
		>
			<Box
				sx={{
					width: '100%',
					textAlign: 'center',
					marginBottom: '16px',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					gap: '4px',
				}}
			>
				<Box>Assume starting stat values:</Box>
				<CustomTooltip
					title={
						'Useful when making a build where you want to assume that a font mod is active or when assuming that a lightweight weapon will be equipped, etc...'
					}
				>
					<HelpIcon
						sx={{
							height: '20px',
							width: '20px',
						}}
					/>
				</CustomTooltip>
			</Box>
			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
				{ArmorStatIdList.map((armorStatId) => {
					const armorStat = getArmorStat(armorStatId);
					return (
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								gap: '4px',
								width: 'calc(33.33% - 13.33px)', // subtract two-thirds of the gap from the width
							}}
							key={armorStatId}
						>
							<BungieImage src={armorStat.icon} height={20} width={20} />
							<Box>
								<StyledTextField
									type="number"
									value={assumedStatValues[armorStatId]}
									// variant="outlined"
									variant="standard"
									inputProps={{
										maxLength: 3,
										step: '1',
									}}
									sx={{ width: '40px' }}
									onChange={(e) =>
										handleChange(
											armorStatId,
											Number(parseFloat(e.target.value).toFixed(1))
										)
									}
								/>
							</Box>
						</Box>
					);
				})}
			</Box>
		</Box>
	);
}
