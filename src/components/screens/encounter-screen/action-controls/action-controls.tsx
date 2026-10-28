import { Component, ReactNode, createRef } from 'react';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

import { CardType } from '../../../../enums/card-type';
import { StructureType } from '../../../../enums/structure-type';

import { ActionLogic, ActionPrerequisites } from '../../../../logic/action/action-logic';
import { CombatantLogic } from '../../../../logic/combatant/combatant-logic';
import { StrongholdLogic } from '../../../../logic/stronghold/stronghold-logic';

import type { ActionModel, ActionOriginParameterModel, ActionParameterModel, ActionTargetParameterModel, ActionWeaponParameterModel } from '../../../../models/action';
import type { CombatantModel } from '../../../../models/combatant';
import type { EncounterModel } from '../../../../models/encounter';
import type { GameModel } from '../../../../models/game';

import { ActionCard, StrongholdBenefitCard } from '../../../cards';
import { Text, TextType } from '../../../controls';
import { ActionParameter } from './action-parameter/action-parameter';

import './action-controls.scss';

interface Props {
	combatant: CombatantModel;
	encounter: EncounterModel;
	game: GameModel;
	developer: boolean;
	currentActionParameter: ActionParameterModel | null;
	collapsed: boolean;
	toggleCollapsed: () => void;
	drawActions: (encounter: EncounterModel, combatant: CombatantModel, spendCharge: StructureType | null) => void;
	selectAction: (encounter: EncounterModel, combatant: CombatantModel, action: ActionModel) => void;
	deselectAction: (encounter: EncounterModel, combatant: CombatantModel) => void;
	setActionParameter: (parameter: ActionParameterModel) => void;
	setWeaponParameterValue: (parameter: ActionWeaponParameterModel, weaponID: string) => void;
	setOriginParameterValue: (parameter: ActionOriginParameterModel, square: { x: number, y: number }) => void;
	setTargetParameterValue: (parameter: ActionTargetParameterModel, targetIDs: string[]) => void;
	runAction: (encounter: EncounterModel, combatant: CombatantModel) => void;
}

interface State {
	canScrollLeft: boolean;
	canScrollRight: boolean;
}

export class ActionControls extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			canScrollLeft: false,
			canScrollRight: false
		};
	}

	contentRef = createRef<HTMLDivElement>();

	componentDidMount = () => {
		this.updateScroll();
		// How much of the row is past the edge depends on how wide the row is.
		window.addEventListener('resize', this.updateScroll);
	};

	componentDidUpdate = () => {
		// Drawing a new hand, or choosing a card, changes what is in the row and so what is off
		// the end of it. This runs after every one of those.
		this.updateScroll();
	};

	componentWillUnmount = () => {
		window.removeEventListener('resize', this.updateScroll);
	};

	// Whether there is anything past each end of the row, which is all the arrows say. A pixel of
	// slack either side, because a scroll position is fractional and a row scrolled all the way
	// over rarely comes out exactly equal. Nothing is set unless an answer changed, so this is
	// safe to call from componentDidUpdate.
	updateScroll = () => {
		const content = this.contentRef.current;
		if (!content) {
			return;
		}

		const canScrollLeft = content.scrollLeft > 1;
		const canScrollRight = (content.scrollLeft + content.clientWidth) < (content.scrollWidth - 1);

		if ((canScrollLeft !== this.state.canScrollLeft) || (canScrollRight !== this.state.canScrollRight)) {
			this.setState({
				canScrollLeft: canScrollLeft,
				canScrollRight: canScrollRight
			});
		}
	};

	// How far one press moves the row: a card and the gap after it, read from the row rather than
	// written down here, so it follows whatever size the cards are. The row holding a chosen action
	// has a card and a column of details in it rather than a hand, and there most of the width is
	// the right amount to move.
	getScrollStep = () => {
		const content = this.contentRef.current;
		if (!content) {
			return 0;
		}

		const card = content.querySelector('.playing-card');
		if (!card) {
			return content.clientWidth * 0.8;
		}

		return card.getBoundingClientRect().width + (parseFloat(getComputedStyle(content).columnGap) || 0);
	};

	scrollRow = (direction: -1 | 1) => {
		// Smoothly or not is the stylesheet's business, so that it can be turned off along with
		// the rest of the motion the game makes.
		this.contentRef.current?.scrollBy({ left: direction * this.getScrollStep() });
	};

	showParameter = (parameter: ActionParameterModel) => {
		switch (parameter.id) {
			case 'weapon':
				return parameter.candidates.length > 1;
			case 'targets': {
				const targetParam = parameter as ActionTargetParameterModel;
				return !!targetParam.targets && !!targetParam.value;
			}
		}

		return true;
	};

	getNotSelected = () => {
		const actionCards: ReactNode[] = [];
		const baseCards: ReactNode[] = [];

		this.props.combatant.combat.actions
			.filter(a => CombatantLogic.getActionSourceType(this.props.combatant, a.id) !== CardType.Base)
			.sort((a, b) => a.name.localeCompare(b.name))
			.forEach(a => {
				const prerequisitesMet = a.prerequisites.every(p => ActionPrerequisites.isSatisfied(p, this.props.combatant, this.props.encounter));
				actionCards.push(
					<ActionCard
						key={a.id}
						action={a}
						footer={CombatantLogic.getActionSource(this.props.combatant, a.id)}
						footerType={CombatantLogic.getActionSourceType(this.props.combatant, a.id)}
						combatant={this.props.combatant}
						encounter={this.props.encounter}
						disabled={!prerequisitesMet}
						onClick={prerequisitesMet ? action => this.props.selectAction(this.props.encounter, this.props.combatant, action) : null}
					/>
				);
			});

		this.props.combatant.combat.actions
			.filter(a => CombatantLogic.getActionSourceType(this.props.combatant, a.id) === CardType.Base)
			.forEach(a => {
				const prerequisitesMet = a.prerequisites.every(p => ActionPrerequisites.isSatisfied(p, this.props.combatant, this.props.encounter));
				if (prerequisitesMet) {
					baseCards.push(
						<ActionCard
							key={a.id}
							action={a}
							footer={CombatantLogic.getActionSource(this.props.combatant, a.id)}
							footerType={CombatantLogic.getActionSourceType(this.props.combatant, a.id)}
							combatant={this.props.combatant}
							encounter={this.props.encounter}
							onClick={action => this.props.selectAction(this.props.encounter, this.props.combatant, action)}
						/>
					);
				}
			});

		let benefit = null;
		const redraws = StrongholdLogic.getStructureCharges(this.props.game, StructureType.Observatory);
		if ((redraws > 0) || this.props.developer) {
			benefit = (
				<StrongholdBenefitCard
					label='Redraw'
					available={redraws}
					developer={this.props.developer}
					onRedraw={() => this.props.drawActions(this.props.encounter, this.props.combatant, this.props.developer ? null : StructureType.Observatory)}
				/>
			);
		}

		return (
			<>
				{actionCards}
				{benefit ? <div className='separator' /> : null}
				{benefit}
				{baseCards.length > 0 ? <div className='separator' /> : null}
				{baseCards}
			</>
		);
	};

	getInProgress = (action: ActionModel) => {
		let prerequisitesMet = true;
		const prerequisites: ReactNode[] = [];
		action.prerequisites.forEach((prerequisite, n) => {
			if (!ActionPrerequisites.isSatisfied(prerequisite, this.props.combatant, this.props.encounter)) {
				prerequisitesMet = false;
				prerequisites.push(
					<div key={n} className='action-prerequisite'>{prerequisite.description}</div>
				);
			}
		});

		let allParametersSet = true;
		const parameters: ReactNode[] = [];
		action.parameters.forEach((parameter, n) => {
			if (!allParametersSet) {
				// A previous parameter isn't finished yet
				return;
			}

			const parameterSet = ActionLogic.isParameterSet(parameter);
			if (this.showParameter(parameter) && !!parameter.value) {
				parameters.push(
					<ActionParameter
						key={parameter.id}
						parameter={parameter}
						encounter={this.props.encounter}
						combatant={this.props.combatant}
						isSelectedOnMap={this.props.currentActionParameter === parameter}
						selectOnMap={this.props.setActionParameter}
						setWeaponParameterValue={this.props.setWeaponParameterValue}
						setOriginParameterValue={this.props.setOriginParameterValue}
						setTargetParameterValue={this.props.setTargetParameterValue}
					/>
				);
			}

			if (!parameterSet) {
				allParametersSet = false;
			}
		});

		return (
			<>
				<ActionCard
					action={action}
					footer={CombatantLogic.getActionSource(this.props.combatant, action.id)}
					footerType={CombatantLogic.getActionSourceType(this.props.combatant, action.id)}
					combatant={this.props.combatant}
					encounter={this.props.encounter}
				/>
				<div className='action-details'>
					{prerequisites}
					{parameters}
					<div className='button-row'>
						<button
							className='primary'
							disabled={!prerequisitesMet || !allParametersSet}
							onClick={() => this.props.runAction(this.props.encounter, this.props.combatant)}
						>
							Go
						</button>
						<button
							onClick={() => this.props.deselectAction(this.props.encounter, this.props.combatant)}
						>
							Cancel
						</button>
					</div>
				</div>
			</>
		);
	};

	getUsed = (action: ActionModel) => {
		let benefit = null;
		const redraws = StrongholdLogic.getStructureCharges(this.props.game, StructureType.ThievesGuild);
		if ((redraws > 0) || this.props.developer) {
			benefit = (
				<StrongholdBenefitCard
					label='Act Again'
					available={redraws}
					developer={this.props.developer}
					onUse={() => this.props.drawActions(this.props.encounter, this.props.combatant, this.props.developer ? null : StructureType.ThievesGuild)}
				/>
			);
		}

		return (
			<>
				<ActionCard
					action={action}
					footer={CombatantLogic.getActionSource(this.props.combatant, action.id)}
					footerType={CombatantLogic.getActionSourceType(this.props.combatant, action.id)}
					combatant={this.props.combatant}
					encounter={this.props.encounter}
				/>
				{benefit}
				<div className='action-details'>
					<Text type={TextType.Information}>
						<p>You have used your action for this turn.</p>
						{this.props.combatant.combat.movement > 0 ? <p>You still have some movement points you can use.</p> : null }
					</Text>
				</div>
			</>
		);
	};

	render = () => {
		// The key is the row's: it changes when the row's contents are replaced wholesale, which
		// remounts it and so puts it back to the left rather than leaving it scrolled to where the
		// last set of cards happened to be.
		let key = 'not-selected';
		let content = this.getNotSelected();
		const selected = this.props.combatant.combat.selectedAction;
		if (selected) {
			key = selected.used ? `${selected.action.id} used` : selected.action.id;
			content = selected.used ? this.getUsed(selected.action) : this.getInProgress(selected.action);
		}

		return (
			<div
				key={this.props.combatant.id}
				className={`action-controls ${this.props.collapsed ? 'collapsed' : 'expanded'}`}
				onClick={() => {
					if (this.props.collapsed) {
						this.props.toggleCollapsed();
					}
				}}
			>
				<div key={key} ref={this.contentRef} className='action-controls-content' onScroll={this.updateScroll}>
					{content}
				</div>
				{
					// Which way the row has more to show, and a press that goes there. Not while
					// it's shut: it doesn't scroll then, and the strip has no room to say anything.
					// There is no disabled state because an arrow with nowhere to go isn't drawn.
					this.props.collapsed ?
						null
						:
						<>
							{
								this.state.canScrollLeft ?
									<button className='scroll-arrow left' title='Scroll left' onClick={e => { e.stopPropagation(); this.scrollRow(-1); }}>
										<IconChevronLeft />
									</button>
									: null
							}
							{
								this.state.canScrollRight ?
									<button className='scroll-arrow right' title='Scroll right' onClick={e => { e.stopPropagation(); this.scrollRow(1); }}>
										<IconChevronRight />
									</button>
									: null
							}
						</>
				}
			</div>
		);
	};
}
