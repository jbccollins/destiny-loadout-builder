import BungieImage from '@dlb/dim/dim-ui/BungieImage';
import { DimItem } from '@dlb/dim/inventory/item-types';
import { DimStore } from '@dlb/dim/inventory/store-types';
import { StructuredStoreData } from '@dlb/services/data';
import { Box, styled, Card } from '@mui/material';

type BucketProps = Readonly<{
	items: StructuredStoreData;
}>;
const Container = styled(Card)(({ theme }) => ({
	color: theme.palette.secondary.main,
	padding: theme.spacing(3)
}));

function Bucket(props: BucketProps) {
	return (
		<>
			<Container>
				{props.items.map((classType) => {
					return (
						<div key={classType.classType}>
							<div>{classType.classType}</div>
							{classType.helmet.map((i) => (
								<BungieImage key={i.id} src={i.icon} />
							))}
						</div>
					);
				})}
			</Container>
		</>
	);
}

export default Bucket;
