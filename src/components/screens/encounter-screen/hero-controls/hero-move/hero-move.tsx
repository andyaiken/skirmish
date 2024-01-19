import { Component } from 'react';
import { IconArrowBigRightLinesFilled } from '@tabler/icons-react';

import { EncounterLogic } from '../../../../../logic/encounter-logic';

import type { CombatantModel } from '../../../../../models/combatant';
import type { EncounterModel } from '../../../../../models/encounter';
import type { OptionsModel } from '../../../../../models/options';

import { Expander, Text, TextType } from '../../../../controls';
import { DirectionPanel } from '../../../../panels';

import './hero-move.scss';

interface Props {
	combatant: CombatantModel;
	encounter: EncounterModel;
	options: OptionsModel;
	move: (encounter: EncounterModel, combatant: CombatantModel, dir: string, cost: number) => void;
	addMovement: (encounter: EncounterModel, combatant: CombatantModel, value: number) => void;
}

export class HeroMove extends Component<Props> {
	render = () => {
		try {
			const moveCosts: Record<string, number> = {};
			[ 'n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw' ].forEach(dir => {
				moveCosts[dir] = EncounterLogic.getMoveCost(this.props.encounter, this.props.combatant, this.props.combatant.combat.position, dir);
			});

			return (
				<div className='hero-move'>
					{this.props.options.developer ? <button className='developer' onClick={() => this.props.addMovement(this.props.encounter, this.props.combatant, 10)}>Add Movement</button> : null}
					<DirectionPanel
						mode='full'
						movement={this.props.combatant.combat.movement}
						costs={moveCosts}
						onMove={(dir, cost) => this.props.move(this.props.encounter, this.props.combatant, dir, cost)}
					/>
					{
						this.props.combatant.combat.movement === 0 ?
							<Text type={TextType.Information}>
								<p>You have used all your movement for this turn.</p>
								{!this.props.combatant.combat.selectedAction || !this.props.combatant.combat.selectedAction.used ? <p>You can still take your action.</p> : null }
							</Text>
							: null
					}
					{
						this.props.options.showTips ?
							<Expander
								header={
									<Text type={TextType.Tip}>Movement Points</Text>
								}
								content={
									<div>
										<p>Your hero only has a certain number of movement points <IconArrowBigRightLinesFilled size={15} /> to use each round.</p>
										<p>These points are calculated using their <b>Speed</b> trait rank.</p>
										<p>You can use them to move your hero around the map, but they&apos;re also useful for picking up items, hiding, or drinking potions.</p>
									</div>
								}
							/>
							: null
					}
				</div>
			);
		} catch {
			return <div className='hero-move render-error' />;
		}
	};
}
