import { ReactNode } from 'react';
import '@dlb/styles/globals.css';
import { Analytics } from '@vercel/analytics/react';
import { Metadata } from 'next';
import ClientProviders from '@dlb/providers/ClientProviders';

export const metadata: Metadata = {
	title: {
		default: 'Destiny Loadout Builder',
		template: '%s | DLB',
	},
	description: 'building optimized loadouts!',
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<body>
				<ClientProviders>{children}</ClientProviders>
				<Analytics />
			</body>
		</html>
	);
}
