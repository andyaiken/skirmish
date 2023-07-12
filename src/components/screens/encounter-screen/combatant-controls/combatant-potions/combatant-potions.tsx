import { Component } from 'react';

import type { CombatantModel } from '../../../../../models/combatant';
import type { EncounterModel } from '../../../../../models/encounter';
import type { ItemModel } from '../../../../../models/item';

import { Collections } from '../../../../../utils/collections';

import { IconType, IconValue } from '../../../../controls';
import { ItemCard } from '../../../../cards';

import './combatant-potions.scss';

interface Props {
	combatant: CombatantModel;
	encounter: EncounterModel;
	drinkPotion: (encounter: EncounterModel, combatant: CombatantModel, potion: ItemModel) => void;
}

export class CombatantPotions extends Component<Props> {
	render = () => {
		try {
			const potions = Collections.distinct(this.props.combatant.carried.filter(i => i.potion), i => i.name);

			const potionSections = potions.map((p, n) => {
				const count = this.props.combatant.carried.filter(i => i.name === p.name).length;
				return (
					<div key={n}>
						<div className='potion-card'>
							<ItemCard item={p} count={count} />
						</div>
						<button disabled={this.props.combatant.combat.movement < 2} onClick={() => this.props.drinkPotion(this.props.encounter, this.props.combatant, p)}>
							Drink<br /><IconValue type={IconType.Movement} value={2} iconSize={12} />
						</button>
					</div>
				);
			});

			return (
				<div className='combatant-potions'>
					{potionSections}
				</div>
			);
		} catch {
			return <div className='combatant-potions render-error' />;
		}
	};
}
