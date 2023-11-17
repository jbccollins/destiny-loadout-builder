'use client';

import {
	ArmorStatIdList,
	ArmorStatMapping,
	getArmorStat,
} from '@dlb/types/ArmorStat';
import { Box, styled } from '@mui/material';
import GenericTierRow from './GenericTierRow';

type StatTiersProps = {
	armorStatMapping: ArmorStatMapping;
};

const Container = styled(Box)(({ theme }) => ({
	//paddingLeft: theme.spacing(1),
	marginBottom: theme.spacing(2),
	display: 'flex',
	flexDirection: 'column',
	// borderLeft: `1px solid rgb(128, 128, 128)`,
}));

let tiers = [...Array(11).keys()].map((t) => t * 10);
tiers = tiers.slice(1); // Delete the "0" tier

function StatTiers({ armorStatMapping }: StatTiersProps) {
	return (
		<Container>
			{ArmorStatIdList.map((armorStatId) => (
				<GenericTierRow
					key={armorStatId}
					prefixImageSrc={getArmorStat(armorStatId).icon}
					showPrefixImage
					showValue
					tiers={tiers}
					value={armorStatMapping[armorStatId]}
					tierContainerWidth="280px"
				/>
			))}
		</Container>
	);
}

export default StatTiers;
