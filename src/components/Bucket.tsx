import BungieImage from '@dlb/dim/dim-ui/BungieImage';
import { DimItem } from '@dlb/dim/inventory/item-types';
import { DimStore } from '@dlb/dim/inventory/store-types';
import { Box, styled, Card } from '@mui/material';

type BucketProps = Readonly<{
	store: DimStore<DimItem>;
}>;
const Container = styled(Card)(({ theme }) => ({
	color: theme.palette.secondary.main,
	padding: theme.spacing(3)
}));

const Item = styled(Box)(({ theme }) => ({
	color: theme.palette.secondary.main,
	display: 'flex'
}));

function Bucket(props: BucketProps) {
	console.log('bucket', props);
	return (
		<>
			<Container>
				{props.store.items.map((item) => {
					return item.id == '0' ? (
						false
					) : (
						<BungieImage key={item.id} src={item.icon} />
					);
				})}
			</Container>
		</>
	);
}

export default Bucket;
