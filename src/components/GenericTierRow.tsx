import BungieImage from '@dlb/dim/dim-ui/BungieImage';
import styled from '@emotion/styled';
import { Box } from '@mui/material';

type GenericTierRowProps = {
	tiers: number[];
	value: number;
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

const TierBlock = styled(Box, {
	shouldForwardProp: (prop) =>
		![
			'filled',
			'first',
			'last',
			'borderWidth',
			'backgroundColor',
			'withLastBorder',
			'height',
		].includes(prop as string),
})<{
	filled?: boolean;
	first: boolean;
	last: boolean;
	borderWidth?: string;
	backgroundColor?: string;
	withLastBorder?: boolean;
	height?: string;
}>(
	({
		filled,
		first,
		last,
		borderWidth,
		backgroundColor,
		withLastBorder,
		height,
	}) => ({
		flex: '1 1 0px', //Ensure all the same width
		width: 0,
		// paddingLeft: '3px',
		// paddingRight: '3px',
		// paddingTop: '6px',
		// paddingBottom: '6px',
		textAlign: 'center',
		background: filled
			? 'white'
			: `${backgroundColor ? backgroundColor : 'black'}`,
		borderTop: '1px solid',
		borderBottom: '1px solid',
		borderLeft: first ? '1px solid' : '',
		borderRight: '1px solid',
		// borderRight: !last
		// 	? `${borderWidth ? borderWidth : '1px'} solid`
		// 	: last && withLastBorder
		// 	? `${borderWidth ? borderWidth : '1px'} solid`
		// 	: 'none',

		// borderLeft: !first
		// 	? '1px solid'
		// 	: first && withLastBorder
		// 	? '1px solid'
		// 	: 'none',

		borderColor: filled ? 'white' : 'rgb(128, 128, 128)',
		color: filled ? 'black' : '',
		borderRightColor: filled && !last ? 'black' : '',
		height: height ? height : 24,
		borderTopLeftRadius: first ? `4px` : '0px',
		borderBottomLeftRadius: first ? `4px` : '0px',
		borderTopRightRadius: last ? `4px` : '0px',
		borderBottomRightRadius: last ? `4px` : '0px',
	})
);

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
				<BungieImage src={prefixImageSrc} width={'24px'} height={'24px'} />
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
