import BungieImage from '@dlb/dim/dim-ui/BungieImage';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Box } from '@mui/material';

export type SortableItemProps = {
	id: string;
	label: string;
	icon: string;
};

export function SortableItem(props: SortableItemProps) {
	const { id, label, icon } = props;
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		cursor: 'move',
		border: '1px dashed rgba(255, 255, 255, 0.4)',
		background: 'rgb(50, 50, 50)',
		padding: '8px',
		paddingRight: '4px',
		marginBottom: '6px',
		display: 'flex',
		justifyContent: 'space-between',
		touchAction: 'none',
	};

	return (
		<Box
			// onClick={() => {
			// 	console.log('click');
			// }}
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
		>
			<Box sx={{ display: 'flex' }}>
				<BungieImage src={icon} width={26} height={26} />
				<Box sx={{ marginLeft: '8px' }}>{label}</Box>
			</Box>
			<DragIndicatorIcon />
		</Box>
	);
}
