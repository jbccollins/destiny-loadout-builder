"use client";

import {
	DndContext,
	KeyboardSensor,
	PointerSensor,
	closestCenter,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import {
	SortableContext,
	arrayMove,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { cloneDeep } from 'lodash';
import { SortableItem } from './SortableItem';

export type SortableOption = {
	id: string;
	label: string;
	icon: string;
};

export type SortableListProps = {
	items: SortableOption[];
	onChange: (items: SortableOption[]) => void;
};

export const SortableList = (props: SortableListProps) => {
	const { items, onChange } = props;
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
		>
			<SortableContext items={items} strategy={verticalListSortingStrategy}>
				{items.map(({ id, label, icon }) => (
					<SortableItem key={id} id={id} label={label} icon={icon} />
				))}
			</SortableContext>
		</DndContext>
	);

	function handleDragEnd(event) {
		const { active, over } = event;

		if (active.id !== over.id) {
			let newItems = cloneDeep(items);
			const oldIndex = newItems.map((x) => x.id).indexOf(active.id);
			const newIndex = newItems.map((x) => x.id).indexOf(over.id);
			newItems = arrayMove(newItems, oldIndex, newIndex);
			onChange(newItems);
		}
	}
};
