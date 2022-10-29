import '@dlb/styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import {
	FatalTokenError,
	getActiveToken as getBungieToken
} from '../dim/bungie-api/authenticated-fetch';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }: AppProps) {
	// TODO: Find a better way to ensure that the user is always logged in
	// const router = useRouter();
	// useEffect(() => {
	// 	(async () => {
	// 		try {
	// 			const token = await getBungieToken();
	// 			console.log('getBungieToken', token);
	// 		} catch (e) {
	// 			if (e instanceof FatalTokenError) {
	// 				console.log('No token exists. Redirecting to login page.', e.message);
	// 				router.push('/login');
	// 			} else {
	// 				console.error('Unknown error when getting bungie token', e);
	// 			}
	// 		}
	// 	})();

	// 	console.log('APP USEEFFECT CALLED');
	// 	return () => {
	// 		// this now gets called when the component unmounts
	// 	};
	// }, []);

	return <Component {...pageProps} />;
}

export default MyApp;
