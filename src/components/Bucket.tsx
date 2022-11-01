import { BucketHashes } from '@dlb/dim/data/d2/generated-enums';
import { D2Categories } from '@dlb/dim/destiny2/d2-bucket-categories';
import BungieImage from '@dlb/dim/dim-ui/BungieImage';
import { DimItem } from '@dlb/dim/inventory/item-types';
import { DimStore } from '@dlb/dim/inventory/store-types';
import { AllArmor, ValidDestinyClassesTypes } from '@dlb/services/data';
import { Box, styled, Card } from '@mui/material';

type BucketProps = Readonly<{
	items: AllArmor;
}>;
const Container = styled(Card)(({ theme }) => ({
	color: theme.palette.secondary.main,
	padding: theme.spacing(3)
}));

function Bucket(props: BucketProps) {
	// ValidDestinyClassesTypes.forEach((classType) => {
	// 	D2Categories.Armor.forEach((a) => {
	// 		console.log(props.items[classType][a]);
	// 	});
	// });

	return (
		<>
			<Container>
				{ValidDestinyClassesTypes.map((classType) => {
					return (
						<div key={classType}>
							{D2Categories.Armor.map((armorBucket) => {
								return (
									<div key={armorBucket}>
										{props.items[classType][armorBucket].map((item) => {
											return <BungieImage key={item.id} src={item.icon} />;
										})}
									</div>
								);
							})}
						</div>
					);
				})}
			</Container>
		</>
	);
}

export default Bucket;
