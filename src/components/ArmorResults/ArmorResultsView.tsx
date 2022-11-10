import BungieImage from '@dlb/dim/dim-ui/BungieImage';

import { styled, Card, Box } from '@mui/material';
import { useAppSelector } from '@dlb/redux/hooks';
import { selectProcessedArmor } from '@dlb/redux/features/processedArmor/processedArmorSlice';
import { selectSelectedCharacterClass } from '@dlb/redux/features/selectedCharacterClass/selectedCharacterClassSlice';
import { selectArmor } from '@dlb/redux/features/armor/armorSlice';
import {
	ArmorItem,
	ArmorSlots,
	DesiredArmorStats as ArmorStatToValue,
	EArmorSlot
} from '@dlb/services/data';
import { selectSelectedExoticArmor } from '@dlb/redux/features/selectedExoticArmor/selectedExoticArmorSlice';
import ArmorResultsTable from './ArmorResultsTable';
import { useMemo } from 'react';
import { StatList } from '@dlb/services/armor-processing';
const Container = styled(Box)(({ theme }) => ({
	padding: theme.spacing(1)
}));

export type ResultsTableArmorItem = {
	id: string;
	// TODO: We should probably rename the 'DesiredArmorStats' type since it's being used
	// in a different way here
	totalStats: StatList;
	armorItems: ArmorItem[];
};

// TODO: Remove props and just read from redux?
function ArmorResultsView() {
	const armor = useAppSelector(selectArmor);
	const selectedCharacterClass = useAppSelector(selectSelectedCharacterClass);
	const processedArmor = useAppSelector(selectProcessedArmor);
	const selectedExoticArmor = useAppSelector(selectSelectedExoticArmor);

	const getArmorItem = (id: string, armorSlot: EArmorSlot) => {
		const selectedExoticArmorSlot =
			selectedExoticArmor[selectedCharacterClass].armorSlot;
		// console.log('>>>>>>>>>>>> getArmorItem <<<<<<<<<<<<<<', { id, armorSlot });
		if (selectedExoticArmorSlot === armorSlot) {
			return armor[selectedCharacterClass][armorSlot].exotic[id];
		}
		return armor[selectedCharacterClass][armorSlot].nonExotic[id];
	};

	const resultsTableArmorItems: ResultsTableArmorItem[] = useMemo(() => {
		const res: ResultsTableArmorItem[] = [];

		processedArmor.forEach((armorIdsBySlot) => {
			const resultArmorItem: ResultsTableArmorItem = {
				totalStats: [0, 0, 0, 0, 0, 0],
				armorItems: [],
				id: ''
			};
			ArmorSlots.forEach((armorSlot, i) => {
				const armorItem = getArmorItem(armorIdsBySlot[i], armorSlot);
				resultArmorItem.armorItems.push(armorItem);
				armorItem.stats.forEach((value, j) => {
					resultArmorItem.totalStats[j] += armorItem.stats[j];
					resultArmorItem.id += `[${armorItem.id}]`;
				});
			});
			res.push(resultArmorItem);
		});

		return res;
		// TODO: figure out a better pattern so that we can avoid this warning about getArmorItem
		// not being in the dependency array
	}, [processedArmor]);

	return (
		<>
			{armor &&
				selectedCharacterClass &&
				processedArmor &&
				selectedExoticArmor &&
				selectedExoticArmor[selectedCharacterClass] && (
					<Container>
						<ArmorResultsTable items={resultsTableArmorItems} />
					</Container>
				)}
		</>
	);
}

export default ArmorResultsView;

// id:'6917529338626075073' or id:'6917529314591524684' or id:'6917529339988633177' or id:'6917529582824429231'

// Raw dim loadout url
// https://beta.destinyitemmanager.com/4611686018444338689/d2/loadouts?loadout=%7B%22id%22%3A%22d2ap%22%2C%22name%22%3A%22D2ArmorPicker%20Loadout%22%2C%22classType%22%3A1%2C%22parameters%22%3A%7B%22statConstraints%22%3A%5B%7B%22statHash%22%3A2996146975%2C%22minTier%22%3A10%2C%22maxTier%22%3A10%7D%2C%7B%22statHash%22%3A392767087%2C%22minTier%22%3A4%2C%22maxTier%22%3A10%7D%2C%7B%22statHash%22%3A1943323491%2C%22minTier%22%3A9%2C%22maxTier%22%3A10%7D%2C%7B%22statHash%22%3A1735777505%2C%22minTier%22%3A3%2C%22maxTier%22%3A10%7D%2C%7B%22statHash%22%3A144602215%2C%22minTier%22%3A10%2C%22maxTier%22%3A10%7D%2C%7B%22statHash%22%3A4244567218%2C%22minTier%22%3A6%2C%22maxTier%22%3A10%7D%5D%2C%22mods%22%3A%5B2979815167%2C1484685887%2C4048838440%2C3961599962%2C3961599962%2C3682186345%5D%2C%22assumeArmorMasterwork%22%3A3%2C%22lockArmorEnergyType%22%3A1%2C%22exoticArmorHash%22%3A1734144409%7D%2C%22equipped%22%3A%5B%7B%22id%22%3A%226917529338626075073%22%2C%22hash%22%3A1496857121%7D%2C%7B%22id%22%3A%226917529314591524684%22%2C%22hash%22%3A1734144409%7D%2C%7B%22id%22%3A%226917529339988633177%22%2C%22hash%22%3A1399263478%7D%2C%7B%22id%22%3A%226917529582824429231%22%2C%22hash%22%3A3380315063%7D%2C%7B%22id%22%3A%2212345%22%2C%22hash%22%3A873720784%2C%22socketOverrides%22%3A%7B%227%22%3A537774540%2C%228%22%3A2483898429%2C%229%22%3A3469412969%2C%2210%22%3A3469412975%2C%2211%22%3A3469412970%7D%7D%5D%2C%22unequipped%22%3A%5B%5D%2C%22clearSpace%22%3Afalse%7D

// Parsed Query params
// {"id":"d2ap","name":"D2ArmorPicker Loadout","classType":1,"parameters":{"statConstraints":[{"statHash":2996146975,"minTier":10,"maxTier":10},{"statHash":392767087,"minTier":4,"maxTier":10},{"statHash":1943323491,"minTier":9,"maxTier":10},{"statHash":1735777505,"minTier":3,"maxTier":10},{"statHash":144602215,"minTier":10,"maxTier":10},{"statHash":4244567218,"minTier":6,"maxTier":10}],"mods":[2979815167,1484685887,4048838440,3961599962,3961599962,3682186345],"assumeArmorMasterwork":3,"lockArmorEnergyType":1,"exoticArmorHash":1734144409},"equipped":[{"id":"6917529338626075073","hash":1496857121},{"id":"6917529314591524684","hash":1734144409},{"id":"6917529339988633177","hash":1399263478},{"id":"6917529582824429231","hash":3380315063},{"id":"12345","hash":873720784,"socketOverrides":{"7":537774540,"8":2483898429,"9":3469412969,"10":3469412975,"11":3469412970}}],"unequipped":[],"clearSpace":false}
