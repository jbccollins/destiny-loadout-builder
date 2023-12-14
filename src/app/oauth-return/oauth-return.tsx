'use client';
import { getAccessTokenFromCode } from '@dlb/dim/bungie-api/oauth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import OauthReturnContent from './oauth-return-content';

function OauthReturn() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const code = searchParams.get('code');

	useEffect(() => {
		(async () => {
			try {
				if (code) {
					await getAccessTokenFromCode(code as string);
					router.push('/');
				} else {
					// TODO: Better error handling
					// alert('No code found in url params');
					console.warn('No code found in url params, retrying...');
				}
			} catch (e) {
				// TODO redirect only on the right kind of error
				// Test by deleting 'authorization' from localStorage
				// router.push('/login');
				// console.error(e);
			}
		})();

		return () => {
			// this now gets called when the component unmounts
		};
	}, [code, router]);

	return <OauthReturnContent />;
}

export default OauthReturn;
