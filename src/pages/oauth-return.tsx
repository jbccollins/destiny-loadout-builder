import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getAccessTokenFromCode } from '../bungie-api/oauth';

function OauthReturn() {
	const router = useRouter();
	const { code } = router.query;

	useEffect(() => {
		if (code) {
			getAccessTokenFromCode(code as string);
			router.push('/welcome');
		} else {
			// TODO: Better error handling
			console.warn('No code found in url params');
		}
	}, [code, router, router.query]);
	// TODO: Maybe add like a loading spinner here or something
	return <div>OauthReturn</div>;
}

export default OauthReturn;
