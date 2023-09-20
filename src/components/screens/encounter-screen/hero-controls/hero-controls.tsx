import { IconArrowsMove, IconCircleCheck, IconCircleCheckFilled, IconFlask2, IconUser } from '@tabler/icons-react';
import { Component } from 'react';

import type { CombatantModel } from '../../../../models/combatant';
import type { EncounterModel } from '../../../../models/encounter';
import type { ItemModel } from '../../../../models/item';
import type { OptionsModel } from '../../../../models/options';

import { Expander, Tabs, Text, TextType } from '../../../controls';
import { HeroEndturn } from './hero-endturn/hero-endturn';
import { HeroMove } from './hero-move/hero-move';
import { HeroOverview } from './hero-overview/hero-overview';
import { HeroPotions } from './hero-potions/hero-potions';

import './hero-controls.scss';

interface Props {
	combatant: CombatantModel;
	encounter: EncounterModel;
	options: OptionsModel;
	showToken: (combatant: CombatantModel) => void;
	showCharacterSheet: (combatant: CombatantModel) => void;
	move: (encounter: EncounterModel, combatant: CombatantModel, dir: string, cost: number) => void;
	addMovement: (encounter: EncounterModel, combatant: CombatantModel, value: number) => void;
	inspire: (encounter: EncounterModel, combatant: CombatantModel) => void;
	scan: (encounter: EncounterModel, combatant: CombatantModel) => void;
	hide: (encounter: EncounterModel, combatant: CombatantModel) => void;
	drinkPotion: (encounter: EncounterModel, owner: CombatantModel, drinker: CombatantModel, potion: ItemModel) => void;
	endTurn: () => void;
}

interface State {
	tab: string;
}

export class HeroControls extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			tab: 'stats'
		};
	}

	setTab = (tab: string) => {
		this.setState({
			tab: tab
		});
	};

	endTurn = () => {
		this.setState({
			tab: 'stats'
		}, () => {
			this.props.endTurn();
		});
	};

	render = () => {
		try {
			const finished = (this.props.combatant.combat.movement === 0) && this.props.combatant.combat.selectedAction && this.props.combatant.combat.selectedAction.used;

			const options = [
				{ id: 'stats', display: <IconUser /> },
				{ id: 'move', display: <IconArrowsMove /> },
				{ id: 'endturn', display: finished ? <IconCircleCheckFilled className='checked' /> : <IconCircleCheck /> }
			];

			if (this.props.combatant.carried.some(i => i.potion)) {
				options.splice(2, 0, { id: 'potion', display: <IconFlask2 /> });
			}

			let content = null;
			switch (this.state.tab) {
				case 'stats':
					content = (
						<HeroOverview
							combatant={this.props.combatant}
							encounter={this.props.encounter}
							options={this.props.options}
							showToken={this.props.showToken}
							showCharacterSheet={this.props.showCharacterSheet}
							inspire={this.props.inspire}
							scan={this.props.scan}
							hide={this.props.hide}
						/>
					);
					break;
				case 'move':
					content = (
						<HeroMove
							combatant={this.props.combatant}
							encounter={this.props.encounter}
							options={this.props.options}
							move={this.props.move}
							addMovement={this.props.addMovement}
						/>
					);
					break;
				case 'potion':
					content = (
						<HeroPotions
							combatant={this.props.combatant}
							encounter={this.props.encounter}
							drinkPotion={this.props.drinkPotion}
						/>
					);
					break;
				case 'endturn':
					content = (
						<HeroEndturn
							combatant={this.props.combatant}
							encounter={this.props.encounter}
							endTurn={this.endTurn}
						/>
					);
					break;
			}

			return (
				<div className='hero-controls' key={this.props.combatant.id}>
					{
						this.props.options.showTips ?
							<Expander
								header={
									<Text type={TextType.Tip}>It is {this.props.combatant.name}&apos;s turn; explore the tabs below to see what they can do.</Text>
								}
								content={
									<div>
										<p>The most important things to know are:</p>
										<ul>
											<li>You can move your hero around the map with the <IconArrowsMove size={15} /> tab.</li>
											<li>You can choose your action - you only get one per turn! Your action cards are shown below the map.</li>
										</ul>
										<p>When you&apos;re finished, select <b>End Turn</b> on the <IconCircleCheck size={15} /> tab.</p>
									</div>
								}
							/>
							: null
					}
					<Tabs
						options={options}
						selectedID={this.state.tab}
						onSelect={this.setTab}
					/>
					<div className='tab-content'>
						{content}
					</div>
				</div>
			);
		}  catch {
			return <div className='hero-controls render-error' />;
		}
	};
}
