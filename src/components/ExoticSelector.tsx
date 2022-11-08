import BungieImage from '@dlb/dim/dim-ui/BungieImage';

import {
	ArmorSlots,
	AvailableExoticArmorItem,
	DestinyClasses,
	EDestinyClass
} from '@dlb/services/data';
import { Box, styled, Card } from '@mui/material';

import {
	selectSelectedExoticArmor,
	setSelectedExoticArmor
} from '@dlb/redux/features/selectedExoticArmor/selectedExoticArmorSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { selectSelectedCharacterClass } from '@dlb/redux/features/selectedCharacterClass/selectedCharacterClassSlice';
import { useCallback, useEffect, useState } from 'react';

import { selectAvailableExoticArmor } from '@dlb/redux/features/availableExoticArmor/availableExoticArmorSlice';

const Container = styled(Card)(({ theme }) => ({
	color: theme.palette.secondary.main,
	padding: theme.spacing(3)
}));

const Count = styled(Box)(({ theme }) => ({
	color: theme.palette.secondary.main,
	background: `black`,
	position: 'absolute',
	bottom: '0px', // theme.spacing(1),
	left: '0px',
	borderTopRightRadius: '50%',
	textAlign: 'left',
	padding: theme.spacing(0.2),
	paddingRight: theme.spacing(0.8),
	minWidth: theme.spacing(2)
}));

interface ImageContainerProps {
	selected: boolean;
}

const ImageContainer = styled(Box)<ImageContainerProps>(
	({ theme, selected }) => ({
		position: 'relative',
		display: 'inline-block',
		width: theme.spacing(10),
		height: theme.spacing(10),
		border: '4px solid',
		margin: `4px`,
		borderColor: selected ? 'red' : 'transparent'
	})
);

const ExoticImage = styled(BungieImage)(({ theme }) => ({
	position: 'relative',
	width: '100%',
	height: '100%'
}));

type Temp = {
	[key in EDestinyClass]: boolean;
};

function ExoticSelector() {
	const selectedCharacterClass = useAppSelector(selectSelectedCharacterClass);
	const availableExoticArmor = useAppSelector(selectAvailableExoticArmor);
	const selectedExoticArmor = useAppSelector(selectSelectedExoticArmor);
	const dispatch = useAppDispatch();
	const [hasSelectedDefaultExotics, setHasSelectedDefaultExotics] =
		useState(false);

	const handleClick = (
		destinyClassName: EDestinyClass,
		armor: AvailableExoticArmorItem
	) => {
		if (
			selectedExoticArmor &&
			selectedCharacterClass &&
			armor.hash === selectedExoticArmor[selectedCharacterClass].hash
		) {
			// Don't trigger a redux dirty
			return;
		}
		const newSelectedExoticArmor = { ...selectedExoticArmor };
		newSelectedExoticArmor[destinyClassName] = armor;
		dispatch(setSelectedExoticArmor(newSelectedExoticArmor));
	};

	const setDefaultCharacterClass = useCallback(() => {
		if (
			availableExoticArmor &&
			selectedCharacterClass &&
			!hasSelectedDefaultExotics
		) {
			const newSelectedExoticArmor: Record<
				EDestinyClass,
				AvailableExoticArmorItem
			> = {
				[EDestinyClass.Titan]: null,
				[EDestinyClass.Hunter]: null,
				[EDestinyClass.Warlock]: null
			};
			DestinyClasses.forEach((className) => {
				if (availableExoticArmor[className]) {
					for (const armorSlot of ArmorSlots) {
						// TODO: this lookup of className in the availableExoticArmor const is not
						// typesafe and is not picked up by intellisense. remove all such mapping consts
						// from the data file. `availableExoticArmor['derp']` is not caught!!!!!
						if (availableExoticArmor[className][armorSlot].length > 0) {
							// Just pick the first exotic item we find
							newSelectedExoticArmor[className] =
								availableExoticArmor[className][armorSlot][0];
							break;
						}
					}
				}
			});
			setHasSelectedDefaultExotics(true);
			dispatch(setSelectedExoticArmor(newSelectedExoticArmor));
		}
	}, [
		availableExoticArmor,
		dispatch,
		hasSelectedDefaultExotics,
		selectedCharacterClass
	]);

	useEffect(() => {
		setDefaultCharacterClass();
	}, [setDefaultCharacterClass]);

	return (
		availableExoticArmor &&
		selectedCharacterClass &&
		selectedExoticArmor && (
			<>
				<Container>
					{ArmorSlots.map((armorSlot) => {
						return (
							<div key={armorSlot}>
								<div>
									{availableExoticArmor[selectedCharacterClass][armorSlot].map(
										(item: AvailableExoticArmorItem) => {
											return (
												<ImageContainer
													selected={
														selectedExoticArmor[selectedCharacterClass] &&
														item.hash ===
															selectedExoticArmor[selectedCharacterClass].hash
													}
													key={item.hash}
													onClick={() => {
														handleClick(item.destinyClassName, item);
													}}
												>
													<ExoticImage src={item.icon} />
													<Count>{item.count}</Count>
												</ImageContainer>
											);
										}
									)}
								</div>
							</div>
						);
					})}
				</Container>
			</>
		)
	);
}

export default ExoticSelector;
