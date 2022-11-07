import { BucketHashes } from '@dlb/dim/data/d2/generated-enums';
import { D2Categories } from '@dlb/dim/destiny2/d2-bucket-categories';
import BungieImage from '@dlb/dim/dim-ui/BungieImage';
import { DimItem } from '@dlb/dim/inventory/item-types';
import { DimStore } from '@dlb/dim/inventory/store-types';
import { SelectedExoticArmor } from '@dlb/services/armor-processing';
import {
	Armor,
	ArmorSlots,
	AvailableExoticArmorGroup,
	AvailableExoticArmorItem,
	DestinyClassNames
} from '@dlb/services/data';
import { Box, styled, Card } from '@mui/material';

type ExoticSelectorProps = Readonly<{
	items: AvailableExoticArmorGroup;
}>;
const Container = styled(Card)(({ theme }) => ({
	color: theme.palette.secondary.main,
	padding: theme.spacing(3)
}));

function Bucket(props: ExoticSelectorProps) {
	return (
		<>
			<Container>
				{ArmorSlots.map((armorSlot) => {
					return (
						<div key={armorSlot}>
							<div>
								{props.items[armorSlot].map(
									(item: AvailableExoticArmorItem) => {
										return <BungieImage key={item.hash} src={item.icon} />;
									}
								)}
							</div>
						</div>
					);
				})}
			</Container>
		</>
	);
}

export default Bucket;
