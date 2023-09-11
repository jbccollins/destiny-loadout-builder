import { Box, Link } from '@mui/material';
import Image, { StaticImageData } from 'next/image';

const SocialIcon = (props: {
	linkUrl: string;
	iconUrl: StaticImageData;
	text: string;
}) => {
	const { linkUrl, iconUrl, text } = props;
	return (
		<Link href={linkUrl} target="_blank" sx={{ marginBottom: '8px' }}>
			<Box sx={{ display: 'flex' }}>
				<Image
					src={iconUrl}
					alt="me"
					height="40"
					width="50"
					objectFit="contain"
					objectPosition="left"
				/>
				<Box
					sx={{
						fontSize: '20px',
						marginLeft: '8px',
						marginTop: '4px',
						fontWeight: 'bold',
					}}
				>
					{text}
				</Box>
			</Box>
		</Link>
	);
};

export default SocialIcon;
