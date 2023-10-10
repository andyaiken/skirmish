import { Component } from 'react';

import { CombatantState } from '../../../../../enums/combatant-state';

import { EncounterLogic } from '../../../../../logic/encounter-logic';
import { EncounterMapLogic } from '../../../../../logic/encounter-map-logic';

import type { CombatantModel } from '../../../../../models/combatant';
import type { EncounterModel } from '../../../../../models/encounter';
import type { ItemModel } from '../../../../../models/item';

import { Collections } from '../../../../../utils/collections';

import { IconSize, IconType, IconValue, Text, TextType } from '../../../../controls';
import { ItemCard } from '../../../../cards';

import './hero-potions.scss';

interface Props {
	combatant: CombatantModel;
	encounter: EncounterModel;
	drinkPotion: (encounter: EncounterModel, owner: CombatantModel, drinker: CombatantModel, potion: ItemModel) => void;
}

export class HeroPotions extends Component<Props> {
	render = () => {
		try {
			const edges = EncounterMapLogic.getMapEdges(this.props.encounter.mapSquares);
			const originSquares = EncounterLogic.getCombatantSquares(this.props.encounter, this.props.combatant);
			const adj = EncounterLogic.findCombatants(this.props.encounter, originSquares, 1)
				.filter(c => c.id !== this.props.combatant.id)
				.filter(c => c.combat.state !== CombatantState.Dead)
				.filter(c => c.type === this.props.combatant.type)
				.filter(c => EncounterMapLogic.canSeeAny(edges, originSquares, EncounterLogic.getCombatantSquares(this.props.encounter, c)));

			const potionSections = Collections.distinct(this.props.combatant.carried.filter(i => i.potion), i => i.name)
				.map((p, n) => {
					const count = this.props.combatant.carried.filter(i => i.name === p.name).length;
					return (
						<div key={n}>
							<div className='potion-card'>
								<ItemCard item={p} count={count} />
							</div>
							<button disabled={this.props.combatant.combat.movement < 2} onClick={() => this.props.drinkPotion(this.props.encounter, this.props.combatant, this.props.combatant, p)}>
								Drink<br /><IconValue type={IconType.Movement} value={2} size={IconSize.Button} />
							</button>
							{
								adj.map(c => (
									<button key={c.id} disabled={this.props.combatant.combat.movement < 2} onClick={() => this.props.drinkPotion(this.props.encounter, this.props.combatant, c, p)}>
										Feed to {c.name}<br /><IconValue type={IconType.Movement} value={2} size={IconSize.Button} />
									</button>
								))
							}
						</div>
					);
				});

			if (potionSections.length === 0) {
				potionSections.push(
					<div key='empty'>
						<Text type={TextType.Information}>
							<p>{this.props.combatant.name} does not have any potions.</p>
						</Text>
					</div>
				);
			}

			return (
				<div className='hero-potions'>
					{potionSections}
				</div>
			);
		} catch {
			return <div className='hero-potions render-error' />;
		}
	};
}
