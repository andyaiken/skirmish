import { IconArrowsMove, IconCircleCheck, IconCircleCheckFilled, IconFlare, IconFlask2, IconListDetails } from '@tabler/icons-react';
import { Component } from 'react';

import { CombatantState } from '../../../../enums/combatant-state';
import { CombatantType } from '../../../../enums/combatant-type';

import type { ActionModel, ActionParameterModel } from '../../../../models/action';
import type { CombatantModel } from '../../../../models/combatant';
import type { EncounterModel } from '../../../../models/encounter';
import type { ItemModel } from '../../../../models/item';
import type { OptionsModel } from '../../../../models/options';

import { Expander, Tabs, Text, TextType } from '../../../controls';
import { CombatantAction } from './combatant-action/combatant-action';
import { CombatantEndturn } from './combatant-endturn/combatant-endturn';
import { CombatantHeader } from './combatant-header/combatant-header';
import { CombatantMonster } from './combatant-monster/combatant-monster';
import { CombatantMove } from './combatant-move/combatant-move';
import { CombatantOverview } from './combatant-overview/combatant-overview';
import { CombatantPotions } from './combatant-potions/combatant-potions';

import './combatant-controls.scss';

interface CombatantControlsProps {
	combatant: CombatantModel;
	encounter: EncounterModel;
	options: OptionsModel;
	selectedActionParameter: ActionParameterModel | null;
	showToken: (combatant: CombatantModel) => void;
	showCharacterSheet: (combatant: CombatantModel) => void;
	move: (encounter: EncounterModel, combatant: CombatantModel, dir: string, cost: number) => void;
	addMovement: (encounter: EncounterModel, combatant: CombatantModel, value: number) => void;
	inspire: (encounter: EncounterModel, combatant: CombatantModel) => void;
	scan: (encounter: EncounterModel, combatant: CombatantModel) => void;
	hide: (encounter: EncounterModel, combatant: CombatantModel) => void;
	drinkPotion: (encounter: EncounterModel, owner: CombatantModel, drinker: CombatantModel, potion: ItemModel) => void;
	drawActions: (encounter: EncounterModel, combatant: CombatantModel) => void;
	selectAction: (encounter: EncounterModel, combatant: CombatantModel, action: ActionModel) => void;
	deselectAction: (encounter: EncounterModel, combatant: CombatantModel) => void;
	setActionParameter: (parameter: ActionParameterModel) => void;
	setActionParameterValue: (parameter: ActionParameterModel, value: unknown) => void;
	runAction: (encounter: EncounterModel, combatant: CombatantModel) => void;
	runMonsterTurn: (encounter: EncounterModel, combatant: CombatantModel, onFinished: () => void) => void;
	endTurn: () => void;
}

interface CombatantControlsState {
	tab: string;
	thinking: boolean;
}

export class CombatantControls extends Component<CombatantControlsProps, CombatantControlsState> {
	constructor(props: CombatantControlsProps) {
		super(props);
		this.state = {
			tab: 'stats',
			thinking: false
		};
	}

	setTab = (tab: string) => {
		this.setState({
			tab: tab
		});
	};

	setThinking = (value: boolean) => {
		this.setState({
			thinking: value
		});
	};

	runMonsterTurn = () => {
		this.setState({
			thinking: true
		}, () => {
			this.props.runMonsterTurn(this.props.encounter, this.props.combatant, () => {
				this.setState({
					thinking: false
				});
			});
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
			const unconscious = this.props.combatant.combat.state === CombatantState.Unconscious;
			const dead = this.props.combatant.combat.state === CombatantState.Dead;
			const stunned = this.props.combatant.combat.stunned;
			if (unconscious || dead || stunned) {
				return (
					<div className='combatant-controls'>
						<CombatantHeader
							combatant={this.props.combatant}
							encounter={this.props.encounter}
							developer={this.props.options.developer}
							onTokenClick={this.props.showToken}
							showCharacterSheet={this.props.showCharacterSheet}
						/>
						<button onClick={this.endTurn}>End Turn</button>
					</div>
				);
			}

			if (this.props.combatant.type === CombatantType.Monster) {
				return (
					<div className='combatant-controls'>
						<CombatantHeader
							combatant={this.props.combatant}
							encounter={this.props.encounter}
							developer={this.props.options.developer}
							onTokenClick={this.props.showToken}
							showCharacterSheet={this.props.showCharacterSheet}
						/>
						{
							this.props.options.showTips ?
								<Expander
									header={
										<Text type={TextType.Tip}>It is {this.props.combatant.name}&apos;s turn.</Text>
									}
									content={
										<div>You can&apos;t control a monster directly; press the <b>Go</b> button and it will take its turn.</div>
									}
								/>
								: null
						}
						<button disabled={this.state.thinking} onClick={() => this.runMonsterTurn()}>
							{this.state.thinking ? 'Thinking' : 'Go'}
						</button>
						<CombatantMonster
							combatant={this.props.combatant}
							encounter={this.props.encounter}
						/>
					</div>
				);
			}

			const finished = (this.props.combatant.combat.movement === 0) && this.props.combatant.combat.selectedAction && this.props.combatant.combat.selectedAction.used;

			const options = [
				{ id: 'stats', display: <IconListDetails /> },
				{ id: 'move', display: <IconArrowsMove /> },
				{ id: 'action', display: <IconFlare /> },
				{ id: 'endturn', display: finished ? <IconCircleCheckFilled className='checked' /> : <IconCircleCheck /> }
			];

			if (this.props.combatant.carried.some(i => i.potion)) {
				options.splice(3, 0, { id: 'potion', display: <IconFlask2 /> });
			}

			let title = '';
			let content = null;
			switch (this.state.tab) {
				case 'stats':
					title = 'Overview';
					content = (
						<CombatantOverview
							combatant={this.props.combatant}
							encounter={this.props.encounter}
							developer={this.props.options.developer}
							inspire={this.props.inspire}
							scan={this.props.scan}
							hide={this.props.hide}
						/>
					);
					break;
				case 'move':
					title = 'Move';
					content = (
						<CombatantMove
							combatant={this.props.combatant}
							encounter={this.props.encounter}
							developer={this.props.options.developer}
							move={this.props.move}
							addMovement={this.props.addMovement}
						/>
					);
					break;
				case 'action':
					title = 'Take an Action';
					content = (
						<CombatantAction
							combatant={this.props.combatant}
							encounter={this.props.encounter}
							currentActionParameter={this.props.selectedActionParameter}
							developer={this.props.options.developer}
							drawActions={this.props.drawActions}
							selectAction={this.props.selectAction}
							deselectAction={this.props.deselectAction}
							setActionParameter={this.props.setActionParameter}
							setActionParameterValue={this.props.setActionParameterValue}
							runAction={this.props.runAction}
						/>
					);
					break;
				case 'potion':
					title = 'Drink a Potion';
					content = (
						<CombatantPotions
							combatant={this.props.combatant}
							encounter={this.props.encounter}
							drinkPotion={this.props.drinkPotion}
						/>
					);
					break;
				case 'endturn':
					title = 'End Your Turn';
					content = (
						<CombatantEndturn
							combatant={this.props.combatant}
							encounter={this.props.encounter}
							endTurn={this.endTurn}
						/>
					);
					break;
			}

			return (
				<div className='combatant-controls'>
					<CombatantHeader
						combatant={this.props.combatant}
						encounter={this.props.encounter}
						developer={this.props.options.developer}
						onTokenClick={this.props.showToken}
						showCharacterSheet={this.props.showCharacterSheet}
					/>
					{
						this.props.options.showTips ?
							<Expander
								header={
									<Text type={TextType.Tip}>It is {this.props.combatant.name}&apos;s turn; explore the tabs below to see what they can do.</Text>
								}
								content={
									<Text>
										<p>The most important things to know are:</p>
										<ul>
											<li>You can move your hero around the map with the <IconArrowsMove size={12} /> tab.</li>
											<li>You can take your action - you only get one per turn! - with the <IconFlare size={12} /> tab.</li>
										</ul>
										<p>When you&apos;re finished, select <b>End Turn</b> on the <IconCircleCheck size={12} /> tab.</p>
									</Text>
								}
							/>
							: null
					}
					<Tabs
						options={options}
						selectedID={this.state.tab}
						onSelect={this.setTab}
					/>
					<div className='centered'>
						<Text type={TextType.SubHeading}>{title}</Text>
					</div>
					{content}
				</div>
			);
		}  catch {
			return <div className='combatant-controls render-error' />;
		}
	};
}
