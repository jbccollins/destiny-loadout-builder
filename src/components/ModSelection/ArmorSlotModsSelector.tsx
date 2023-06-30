import GenericTierRow from '@dlb/components/GenericTierRow';
import BungieImage from '@dlb/dim/dim-ui/BungieImage';
import { EModId } from '@dlb/generated/mod/EModId';
import { selectDisabledArmorSlotMods } from '@dlb/redux/features/disabledArmorSlotMods/disabledArmorSlotModsSlice';
import { selectMaxPossibleReservedArmorSlotEnergy } from '@dlb/redux/features/maxPossibleReservedArmorSlotEnergy/maxPossibleReservedArmorSlotEnergySlice';
import {
	selectReservedArmorSlotEnergy,
	setReservedArmorSlotEnergy,
} from '@dlb/redux/features/reservedArmorSlotEnergy/reservedArmorSlotEnergySlice';
import {
	selectSelectedArmorSlotMods,
	setSelectedArmorSlotMods,
} from '@dlb/redux/features/selectedArmorSlotMods/selectedArmorSlotModsSlice';
import { selectSelectedDestinyClass } from '@dlb/redux/features/selectedDestinyClass/selectedDestinyClassSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import {
	ArmorSlotWithClassItemIdList,
	getArmorSlot,
} from '@dlb/types/ArmorSlot';
import { IMod } from '@dlb/types/generation';
import { EArmorSlotId } from '@dlb/types/IdEnums';
import { ArmorSlotIdToArmorSlotModIdListMapping, getMod } from '@dlb/types/Mod';
import { getModCategory } from '@dlb/types/ModCategory';
import {
	Box,
	FormControl,
	MenuItem,
	Select,
	SelectChangeEvent,
	styled,
} from '@mui/material';
import ModSelector from './ModSelector';

const TierRowContainer = styled('div')(({ theme }) => ({
	paddingTop: '8px',
	paddingBottom: '6px',
	// transform: 'scaleY(0.3)',
}));

type MaxPossibleReservedArmorSlotEnergyIndicatorProps = {
	value: number;
};

let tiers = [...Array(11).keys()].map((t) => t);
tiers = tiers.slice(1); // Delete the "0" tier

function MaxPossibleReservedArmorSlotEnergyIndicator({
	value,
}: MaxPossibleReservedArmorSlotEnergyIndicatorProps) {
	return (
		<TierRowContainer>
			<GenericTierRow
				prefixImageSrc={null}
				showPrefixImage={false}
				showValue={false}
				tiers={tiers}
				value={value}
				tierBlockBorderWidth="px"
				tierBlockBackgroundColor="rgb(50, 50, 50)"
				tierBlockHeight="8px"
			/>
		</TierRowContainer>
	);
}

/******/
type ReservedArmorSlotEnergySelectorProps = {
	value: number;
	maxValue: number;
	onChange: (value: number) => void;
	armorSlotId: EArmorSlotId;
};

function ReservedArmorSlotEnergySelector({
	value,
	onChange,
	armorSlotId,
	maxValue,
}: ReservedArmorSlotEnergySelectorProps) {
	const handleChange = (value: number) => {
		onChange(value);
	};

	const MenuItems = [...Array(11).keys()].map((value) => (
		<MenuItem key={value} value={value} disabled={value > maxValue}>
			{value}
		</MenuItem>
	));
	return (
		<FormControl key={armorSlotId} variant="standard">
			<Select
				sx={{ minWidth: 50 }}
				id={`reserved-armor-slot-energy-selector-${armorSlotId}`}
				onChange={(event: SelectChangeEvent) => {
					handleChange(Number(event.target.value));
				}}
				value={value.toString()}
				label={armorSlotId}
			>
				{MenuItems}
			</Select>
		</FormControl>
	);
}

/*****/

const Container = styled('div')(({ theme }) => ({
	padding: theme.spacing(1),
}));

const IconDropdownContainer = styled('div')(({ theme }) => ({
	marginBottom: theme.spacing(1),
	display: 'flex',
	position: 'relative',
	flexWrap: 'wrap',
}));

function ArmorSlotModSelector() {
	const maxPossibleReservedArmorSlotEnergy = useAppSelector(
		selectMaxPossibleReservedArmorSlotEnergy
	);
	const reservedArmorSlotEnergy = useAppSelector(selectReservedArmorSlotEnergy);
	const disabledMods = useAppSelector(selectDisabledArmorSlotMods);
	const selectedArmorSlotMods = useAppSelector(selectSelectedArmorSlotMods);
	const dispatch = useAppDispatch();

	const getLabel = (option: IMod) => option.name;
	const getDescription = (option: IMod) => option.description;
	const getCost = (option: IMod) => option.cost;
	const getGroupBy = (option: IMod) => {
		return option.modCategoryId
			? getModCategory(option.modCategoryId).name
			: '';
	};

	const getGroupBySort = (optionA: IMod, optionB: IMod) => {
		return `${getModCategory(optionA.modCategoryId).name}${
			optionA.name
		}`.localeCompare(
			`${getModCategory(optionB.modCategoryId).name}${optionB.name}`
		);
	};

	const selectedDestinyClass = useAppSelector(selectSelectedDestinyClass);

	const handleChange = (
		armorSlotId: EArmorSlotId,
		armorSlotModId: EModId,
		index: number
	) => {
		const armorSlotModIds = { ...selectedArmorSlotMods };
		const modIds = [...armorSlotModIds[armorSlotId]];
		modIds[index] = armorSlotModId;
		armorSlotModIds[armorSlotId] = modIds;
		dispatch(setSelectedArmorSlotMods(armorSlotModIds));
	};

	const isModDisabled = (
		mod: IMod,
		index: number,
		usedArmorEnergy: number,
		selectedMods: EModId[]
	): boolean => {
		const selectedModCost = selectedMods[index]
			? getMod(selectedMods[index]).cost
			: 0;

		if (10 - usedArmorEnergy < mod.cost - selectedModCost) {
			return true;
		}
		if (disabledMods[mod.id] && disabledMods[mod.id][index]) {
			return true;
		}
	};

	function handleReservedArmorSlotEnergySelectorChange(
		value: number,
		armorSlotId: EArmorSlotId
	) {
		dispatch(
			setReservedArmorSlotEnergy({
				...reservedArmorSlotEnergy,
				[armorSlotId]: value,
			})
		);
	}

	return (
		<>
			<Container>
				{ArmorSlotWithClassItemIdList.map((armorSlotId, j) => {
					const dropdownIndices = selectedArmorSlotMods[armorSlotId].map(
						(_, i) => i
					);
					const usedArmorEnergy =
						10 -
						maxPossibleReservedArmorSlotEnergy[armorSlotId] +
						reservedArmorSlotEnergy[armorSlotId];
					return (
						<Box key={armorSlotId}>
							<IconDropdownContainer className={'icon-dropdown-container'}>
								<Box
									sx={{
										// paddingTop: '16px',
										// paddingRight: '6px',
										flex: '0 0 100%',
										// border: '1px solid rgb(50, 50, 50)',
										padding: '8px',
										borderRadius: '4px',
										background: 'rgba(50, 50, 50, 0.5)',
									}}
								>
									<Box
										sx={{
											// paddingTop: '16px',
											// paddingRight: '6px',
											flex: '0 0 100%',
										}}
									>
										<Box sx={{ display: 'flex' }}>
											<Box
												sx={{
													flex: 1,
													display: 'flex',
													alignItems: 'center',
													justifyCcontent: 'center',
												}}
											>
												<Box
													sx={{
														//border: '2px solid rgb(50,50,50)',
														display: 'flex',
														alignItems: 'center',
														justifyCcontent: 'center',
														//borderRadius: '50%',
													}}
												>
													<BungieImage
														width={'30px'}
														height={'30px'}
														src={getArmorSlot(armorSlotId).icon}
													/>
													{/* {`(${usedArmorEnergy}/10)`} */}
												</Box>
											</Box>
											<Box
												sx={{
													display: 'flex',
													alignItems: 'center',
													justifyCcontent: 'center',
												}}
											>
												<Box
													sx={{
														display: 'flex',
														alignItems: 'center',
														justifyCcontent: 'center',
														marginRight: '8px',
													}}
												>
													Reserved Energy:
												</Box>
												<Box>
													<ReservedArmorSlotEnergySelector
														value={reservedArmorSlotEnergy[armorSlotId]}
														maxValue={
															maxPossibleReservedArmorSlotEnergy[armorSlotId]
														}
														onChange={(value) => {
															handleReservedArmorSlotEnergySelectorChange(
																value,
																armorSlotId
															);
														}}
														armorSlotId={armorSlotId}
													/>
												</Box>
											</Box>
										</Box>
										<MaxPossibleReservedArmorSlotEnergyIndicator
											value={usedArmorEnergy}
										/>
									</Box>
									<Box sx={{ display: 'flex', flexDirection: 'column' }}>
										{dropdownIndices.map((index) => (
											<Box key={index} sx={{ flex: 1 }}>
												<ModSelector
													isModDisabled={(mod: IMod) =>
														isModDisabled(
															mod,
															index,
															usedArmorEnergy,
															selectedArmorSlotMods[armorSlotId]
														)
													}
													selectedDestinyClass={selectedDestinyClass}
													availableMods={
														ArmorSlotIdToArmorSlotModIdListMapping[armorSlotId]
													}
													selectedMods={selectedArmorSlotMods[armorSlotId]}
													handleChange={(modId: EModId, index: number) =>
														handleChange(armorSlotId, modId, index)
													}
													getLabel={getLabel}
													getDescription={getDescription}
													getCost={getCost}
													getGroupBy={getGroupBy}
													getGroupBySort={getGroupBySort}
													index={index}
													idPrefix={armorSlotId}
													first={index === 0}
													last={index === dropdownIndices.length - 1}
													textFieldClassName={
														'armor-slot-mod-selector-text-field'
													}
													compact={false}
												/>
											</Box>
										))}
									</Box>
								</Box>
							</IconDropdownContainer>
						</Box>
					);
				})}
			</Container>
		</>
	);
}

export default ArmorSlotModSelector;
