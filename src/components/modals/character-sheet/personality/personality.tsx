import { PersonalityAxis, personalityAxes } from '../../../../enums/personality-type';
import { MemoryType } from '../../../../enums/memory-type';

import { MindLogic } from '../../../../logic/mind/mind-logic';

import type { CombatantModel } from '../../../../models/combatant';
import type { MemoryModel } from '../../../../models/mind';

import { Box, StatValue, Text, TextType } from '../../../controls';

import './personality.scss';

interface Props {
	combatant: CombatantModel;
}

const levels = [ 'Quiet', 'Subtle', 'Strong', 'Defining' ];

const memoryLabels: Record<MemoryType, string> = {
	[MemoryType.Victory]: 'Victory',
	[MemoryType.Retreat]: 'Retreat',
	[MemoryType.Wounded]: 'Wounded',
	[MemoryType.KnockedOut]: 'Knocked out',
	[MemoryType.Unscathed]: 'Unscathed',
	[MemoryType.SlewBoss]: 'Defeated a boss',
	[MemoryType.SlewMany]: 'Defeated many',
	[MemoryType.SlewAtOnce]: 'Defeated several at once',
	[MemoryType.NoKills]: 'No kills',
	[MemoryType.AllyFell]: 'Ally lost',
	[MemoryType.AllyDown]: 'Ally knocked out',
	[MemoryType.LeftBehind]: 'Stayed behind',
	[MemoryType.RegionConquered]: 'Region conquered',
	[MemoryType.RegionBought]: 'Region purchased',
	[MemoryType.LevelUp]: 'Levelled up',
	[MemoryType.NewGear]: 'New gear',
	[MemoryType.NewComrade]: 'New comrade',
	[MemoryType.ComradeRetired]: 'Comrade retired',
	[MemoryType.StructureBuilt]: 'Structure built',
	[MemoryType.StructureUpgraded]: 'Structure upgraded',
	[MemoryType.StructureSold]: 'Structure sold'
};

const memoryAmountLabels: Partial<Record<MemoryType, string>> = {
	[MemoryType.Wounded]: 'wounds',
	[MemoryType.SlewMany]: 'monsters',
	[MemoryType.SlewAtOnce]: 'at once',
	[MemoryType.LevelUp]: 'level',
	[MemoryType.StructureUpgraded]: 'level'
};

const formatMemory = (memory: MemoryModel) => {
	const parts = [ memoryLabels[memory.type] ];
	if (memory.subject) {
		parts.push(memory.subject);
	}
	if (memory.detail) {
		parts.push(memory.detail);
	}
	const amountLabel = memoryAmountLabels[memory.type];
	if (amountLabel && memory.amount > 0) {
		parts.push(`${memory.amount} ${amountLabel}`);
	}
	const age = memory.age === 0 ? 'this encounter' : `${memory.age} ${memory.age === 1 ? 'encounter' : 'encounters'} ago`;
	return `${parts.join(' · ')} · ${age}`;
};

export const Personality = ({ combatant }: Props) => (
	<div className='personality'>
		<div className='header'>
			<Text type={TextType.Heading}>Personality</Text>
		</div>
		<Box label='Personality'>
			<div className='personality-list'>
				{Object.values(PersonalityAxis).map(axis => {
					const definition = personalityAxes[axis];
					const value = combatant.mind.personality[axis];
					const leftLevel = MindLogic.getPersonalityLevel(combatant.mind.personality, definition.left);
					const rightLevel = MindLogic.getPersonalityLevel(combatant.mind.personality, definition.right);
					const label = `${definition.left}: ${levels[leftLevel]}, ${definition.right}: ${levels[rightLevel]}, position ${value} of 6`;
					return (
						<div key={axis} className='personality-group'>
							<div className='personality-axis-labels'>
								<span>{definition.left}<small>{levels[leftLevel]}</small></span>
								<span>{definition.right}<small>{levels[rightLevel]}</small></span>
							</div>
							<div className='personality-axis-meter' role='img' aria-label={label}>
								{[ 0, 1, 2, 3, 4, 5, 6 ].map(n => <span key={n} className={n === value ? 'selected' : ''} />)}
							</div>
						</div>
					);
				})}
			</div>
		</Box>
		<Box label='Inner life'>
			<StatValue label='Dream' value={combatant.mind.dream} />
			<StatValue label='Fear' value={combatant.mind.fear} />
			<StatValue label='Pastime' value={combatant.mind.pastime} />
		</Box>
		<Box label='History'>
			<StatValue label='Encounters' value={combatant.mind.history.encounters} />
			<StatValue label='Victories' value={combatant.mind.history.victories} />
			<StatValue label='Retreats' value={combatant.mind.history.retreats} />
			<StatValue label='Knockouts' value={combatant.mind.history.knockouts} />
			<StatValue label='Monsters slain' value={combatant.mind.history.monstersSlain} />
			<StatValue label='Bosses slain' value={combatant.mind.history.bossesSlain} />
			<StatValue label='Most slain at once' value={combatant.mind.history.mostSlainAtOnce} />
			<StatValue
				label='Comrades lost'
				value={combatant.mind.history.comradesLost.length > 0 ? combatant.mind.history.comradesLost.join(', ') : 'None'}
			/>
		</Box>
		<Box label='Recent memories'>
			{combatant.mind.memories.length > 0
				? combatant.mind.memories.slice(0, 8).map((memory, index) => (
					<Text key={`${memory.type}-${memory.subject}-${index}`}>
						<span>{formatMemory(memory)}</span>
						{
							memory.personalityChange
								? <p>Shifted toward {memory.personalityChange.trait} (axis position {memory.personalityChange.from} to {memory.personalityChange.to}).</p>
								: null
						}
					</Text>
				))
				: <Text type={TextType.Dimmed}>No memories yet.</Text>
			}
		</Box>
	</div>
);
