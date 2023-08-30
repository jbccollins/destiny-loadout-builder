import NextHead from 'next/head';

export default function Head() {
	return (
		<NextHead>
			<title>Destiny Loadout Builder</title>
			<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			<meta
				name="description"
				content="Build optimized loadouts for the video game Destiny 2"
			/>
			<meta property="og:image" content="/image/logo-with-padding_16x9.png" />
			<meta
				property="og:description"
				content="Build optimized loadouts for the video game Destiny 2"
			/>
			<meta property="og:title" content="Destiny Loadout Builder" />
			<meta name="twitter:title" content="Destiny Loadout Builder" />
			<link rel="shortcut icon" href="/image/favicon.ico" />
			<link
				rel="apple-touch-icon"
				sizes="180x180"
				href="/image/apple-touch-icon.png"
			/>
			<link
				rel="icon"
				type="image/png"
				sizes="32x32"
				href="/images/favicon-32x32.png"
			/>
			<link
				rel="icon"
				type="image/png"
				sizes="16x16"
				href="/images/favicon-16x16.png"
			/>
		</NextHead>
	);
}
