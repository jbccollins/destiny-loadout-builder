"use client";

import { RichAnalyzableLoadout } from '@dlb/types/AnalyzableLoadout';
import { getAspect } from '@dlb/types/Aspect';
import { getClassAbility } from '@dlb/types/ClassAbility';
import { getDestinySubclass } from '@dlb/types/DestinySubclass';
import { getFragment } from '@dlb/types/Fragment';
import { getGrenade } from '@dlb/types/Grenade';
import { getJump } from '@dlb/types/Jump';
import { getMelee } from '@dlb/types/Melee';
import { getSuperAbility } from '@dlb/types/SuperAbility';
import { EMPTY_SOCKET_TEXT, MISSING_ICON } from '@dlb/types/globals';
import { Box, styled } from '@mui/material';
import CustomTooltip from '../CustomTooltip';
import { Socket } from '../Socket';

const BASE_OFFSET = -40;
const Description = styled(Box)(({ theme }) => ({
	transform: `rotate(-35deg)`,
	transformOrigin: 'top right',
	minWidth: '105px',
	marginLeft: '-90px',
	textAlign: 'right',
	position: 'absolute',
	top: '40px',
}));

const CondensedSubclassItemsWrapper = styled(Box)(({ theme }) => ({
	display: 'flex',
	gap: '4px',
	// height: '120px',
	//paddingLeft: '40px',
}));

const CondensedSubclassItemWrapper = styled(Box)(({ theme }) => ({
	position: 'relative',
}));

const SubclassItem = (props: { name: string; icon: string }) => {
	const { name, icon } = props;
	return (
		<Box>
			<CustomTooltip title={name || EMPTY_SOCKET_TEXT}>
				<Box>
					<Socket getIcon={() => icon || MISSING_ICON} />
				</Box>
			</CustomTooltip>
		</Box>
	);
};

const SubclassItemsWrappper = styled(Box)(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	gap: '4px',
}));

const SubclassItemTitle = styled(Box)(({ theme }) => ({
	fontSize: '14px',
	fontWeight: 'bold',
	width: '104px',
}));

type SubclassSummaryProps = {
	loadout: RichAnalyzableLoadout;
};
export default function SubclassSummary({ loadout }: SubclassSummaryProps) {
	const {
		destinySubclassId,
		aspectIdList,
		fragmentIdList,
		superAbilityId,
		grenadeId,
		meleeId,
		classAbilityId,
		jumpId,
	} = loadout;
	const destinySubclass = getDestinySubclass(destinySubclassId);
	if (!destinySubclass) {
		return null;
	}
	const aspects: { name: string; icon: string }[] = aspectIdList
		.map((aspectId) => {
			const aspect = getAspect(aspectId);
			return aspect;
		})
		.filter((aspect) => aspect !== null);

	for (let i = 0; i < 2 - aspectIdList.length; i++) {
		aspects.push({
			name: `Aspect: ${EMPTY_SOCKET_TEXT}`,
			icon: MISSING_ICON,
		});
	}

	const fragments = fragmentIdList
		.map((fragmentId) => {
			const fragment = getFragment(fragmentId);
			return fragment;
		})
		.filter((fragment) => fragment !== null);

	const superAbility = getSuperAbility(superAbilityId) || {
		name: EMPTY_SOCKET_TEXT,
		icon: MISSING_ICON,
	};

	const grenade = getGrenade(grenadeId) || {
		name: EMPTY_SOCKET_TEXT,
		icon: MISSING_ICON,
	};

	const melee = getMelee(meleeId) || {
		name: EMPTY_SOCKET_TEXT,
		icon: MISSING_ICON,
	};

	const classAbility = getClassAbility(classAbilityId) || {
		name: EMPTY_SOCKET_TEXT,
		icon: MISSING_ICON,
	};

	const jump = getJump(jumpId) || {
		name: EMPTY_SOCKET_TEXT,
		icon: MISSING_ICON,
	};

	return (
		<Box>
			<Box sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>
				Subclass
			</Box>
			<Box sx={{ display: 'grid', gap: '8px' }}>
				<CondensedSubclassItemsWrapper>
					<CondensedSubclassItemWrapper>
						<SubclassItem
							name={destinySubclass.name}
							icon={destinySubclass.icon}
						/>
					</CondensedSubclassItemWrapper>
					<CondensedSubclassItemWrapper>
						<SubclassItem name={superAbility.name} icon={superAbility.icon} />
					</CondensedSubclassItemWrapper>

					<CondensedSubclassItemWrapper>
						<SubclassItem name={grenade.name} icon={grenade.icon} />
					</CondensedSubclassItemWrapper>

					<CondensedSubclassItemWrapper>
						<SubclassItem name={melee.name} icon={melee.icon} />
					</CondensedSubclassItemWrapper>

					<CondensedSubclassItemWrapper>
						<SubclassItem name={classAbility.name} icon={classAbility.icon} />
					</CondensedSubclassItemWrapper>

					<CondensedSubclassItemWrapper>
						<SubclassItem name={jump.name} icon={jump.icon} />
					</CondensedSubclassItemWrapper>
				</CondensedSubclassItemsWrapper>
				<Box>
					<SubclassItemsWrappper>
						{aspects.map((aspect, i) => {
							return (
								<SubclassItem key={i} name={aspect.name} icon={aspect.icon} />
							);
						})}
						{aspectIdList.length === 0 && (
							<SubclassItem name={EMPTY_SOCKET_TEXT} icon={MISSING_ICON} />
						)}
						{fragments.map((fragment, i) => {
							return (
								<SubclassItem
									key={i}
									name={fragment.name}
									icon={fragment.icon}
								/>
							);
						})}
						{fragmentIdList.length === 0 && (
							<SubclassItem name={EMPTY_SOCKET_TEXT} icon={MISSING_ICON} />
						)}
					</SubclassItemsWrappper>
				</Box>
			</Box>
		</Box>
	);
}
