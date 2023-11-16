'use client';

import { Box } from '@mui/material';

export default function LoadoutCriteria() {
	return (
		<Box>
			<ul>
				<li>
					It must include some combination of armor, mods or subclass options
				</li>
				<li>It must NOT contain five legendary armor pieces</li>
				<li>
					{`It must be for a specific subclass (DIM Loadouts can be made for "Any Class")`}
				</li>
			</ul>
		</Box>
	);
}
