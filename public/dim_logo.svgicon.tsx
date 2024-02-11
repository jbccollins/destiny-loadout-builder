import { SvgIcon, SvgIconProps } from '@mui/material';

export const DimIcon = (
	props: SvgIconProps & { isBetaIconStyle?: boolean }
) => {
	const { isBetaIconStyle, ...rest } = props;

	// if beta icon style is true, return the beta icon
	// filter: hue-rotate(160deg) brightness(107%);
	const restSx = rest.sx || {};

	return (
		<SvgIcon
			{...rest}
			sx={{
				...restSx,
				filter: isBetaIconStyle
					? 'hue-rotate(160deg) brightness(107%)'
					: undefined,
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 320 320"
				// viewBox="0 0 932.2 332"
				// width="50px"
				// height="20px"
			>
				{/* <g fill="red">
					<path d="M379.5 62.2v42.7h170.7V233h-128v-85.4h-42.7v128.1h213.4V62.2zM899.3 62.3 827 129l-72.9-66.7H721v213.3h42.4V124.5l63.6 58.4 62.8-58.2v150.9h42.4V62.3zM635.5 62.4h42.8v213.3h-42.8z" />
				</g> */}
				<path
					fill="#f37423"
					d="m128.843 165.938 32.173-32.173 32.173 32.173-32.173 32.174z"
				/>
				<path
					fill="#f37423"
					d="m161 5-32.2 32.2L257.7 166 161 262.6 64.4 166l64.4-64.4-32.2-32.2L0 166l161 161 161.1-161z"
				/>
			</svg>
		</SvgIcon>
	);
};
