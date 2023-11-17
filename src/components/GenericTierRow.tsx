'use client';

import BungieImage from '@dlb/dim/dim-ui/BungieImage';
import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { TierBlock } from './TierBlock';

type GenericTierRowProps = {
	tiers: number[] | string[];
	value: number | string;
	prefixImageSrc: string;
	showPrefixImage: boolean;
	showValue: boolean;
	tierBlockBorderWidth?: string;
	tierBlockBackgroundColor?: string;
	tierContainerWidth?: string;
	tierBlockHeight?: string;
};
const TierContainer = styled(Box, {
	shouldForwardProp: (prop) => !['width'].includes(prop as string),
})<{
	width?: string;
}>(({ width }) => ({
	display: 'flex',
	flexDirection: 'row',
	paddingLeft: width ? '6px' : '0px',
	width: width ? width : '100%',
}));

const GenericTierRowContainer = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'row',
	paddingBottom: '2px',
}));

function GenericTierRow({
	tiers,
	value,
	prefixImageSrc,
	showPrefixImage,
	showValue,
	tierBlockBorderWidth,
	tierBlockBackgroundColor,
	tierContainerWidth,
	tierBlockHeight,
}: GenericTierRowProps) {
	return (
		<GenericTierRowContainer>
			{showPrefixImage && (
				<BungieImage src={prefixImageSrc} width={24} height={24} />
			)}
			<TierContainer width={tierContainerWidth}>
				{tiers.map((t, i) => {
					return (
						<TierBlock
							first={i === 0}
							last={i === tiers.length - 1}
							filled={t <= value}
							key={t}
							borderWidth={tierBlockBorderWidth}
							backgroundColor={tierBlockBackgroundColor}
							withLastBorder={showValue}
							height={tierBlockHeight}
						/>
					);
				})}
			</TierContainer>

			{showValue && (
				<Box
					sx={{
						lineHeight: '24px',
						paddingLeft: '6px',
						flex: 1,
						textAlign: 'left',
					}}
				>
					{value}
				</Box>
			)}
		</GenericTierRowContainer>
	);
}

export default GenericTierRow;
