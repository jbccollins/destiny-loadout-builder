import BungieImage from '@dlb/dim/dim-ui/BungieImage';
import { DimItem } from '@dlb/dim/inventory/item-types';
import { DimStore } from '@dlb/dim/inventory/store-types';
import { Box, styled, Card } from '@mui/material';

type BucketProps = Readonly<{
	items: DimItem[];
}>;
const Container = styled(Card)(({ theme }) => ({
	color: theme.palette.secondary.main,
	padding: theme.spacing(3)
}));

function Bucket(props: BucketProps) {
	// props.store.items.forEach((item) => {
	// 	if (item.id == '0') {
	// 		console.log(item);
	// 	}
	// });
	return (
		<>
			<Container>
				{props.items.map((item) => {
					return item.index == '0' ? (
						false
					) : (
						<BungieImage key={item.index} src={item.icon} />
					);
				})}
			</Container>
		</>
	);
}

export default Bucket;
