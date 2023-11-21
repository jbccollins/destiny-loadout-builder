'use client';
import { Suspense } from 'react';
import OauthReturn from './oauth-return';
import OauthReturnContent from './oauth-return-content';

// This weird setup exists to solve
// "Entire page /oauth-return deopted into client-side rendering"
// https://nextjs.org/docs/messages/deopted-into-client-rendering
export default function OauthReturnPage() {
	return (
		<Suspense fallback={<OauthReturnContent />}>
			<OauthReturn />
		</Suspense>
	);
}
