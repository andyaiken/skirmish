import { Component, MouseEvent } from 'react';

import { CardType } from '../../../enums/card-type';

import { ActionEffects, ActionLogic, ActionPrerequisites } from '../../../logic/action-logic';

import type { ActionEffectModel, ActionModel } from '../../../models/action';
import type { CombatantModel } from '../../../models/combatant';
import type { EncounterModel } from '../../../models/encounter';

import { PlayingCard, Tag, Text, TextType } from '../../controls';

import './action-card.scss';

interface Props {
	action: ActionModel;
	footer: string;
	footerType: CardType;
	combatant: CombatantModel | null;
	encounter: EncounterModel | null;
	disabled: boolean;
	onClick: ((action: ActionModel) => void) | null;
}

interface State {
	flipped: boolean;
}

export class ActionCard extends Component<Props, State> {
	static defaultProps = {
		combatant: null,
		encounter: null,
		disabled: false,
		onClick: null
	};

	constructor(props: Props) {
		super(props);
		this.state = {
			flipped: false
		};
	}

	onFlip = (e: MouseEvent) => {
		e.stopPropagation();

		this.setState({
			flipped: !this.state.flipped
		});
	};

	onClick = (e: MouseEvent) => {
		e.stopPropagation();

		if (this.props.onClick) {
			this.props.onClick(this.props.action);
		}
	};

	getPrerequisites = () => {
		if (this.props.combatant === null) {
			return [];
		}

		return this.props.action.prerequisites
			.filter(p => !ActionPrerequisites.isSatisfied(p, this.props.combatant as CombatantModel))
			.map((p, n) => <div key={n} className='prerequisite highlighted'>{p.description}</div>);
	};

	getParameters = () => {
		return this.props.action.parameters.map((p, n) => <div key={n} className='parameter'>{ActionLogic.getParameterDescription(p)}</div>);
	};

	getEffects = () => {
		const getEffectDescription = (effect: ActionEffectModel) => {
			let children = null;
			if (effect.children.length > 0) {
				children = effect.children.map((child, n) => <div key={n}>{getEffectDescription(child)}</div>);
			}

			return (
				<div>
					<div className='effect'>{ActionEffects.getDescription(effect, this.props.combatant, this.props.encounter)}</div>
					{children ? <div className='indent'>{children}</div> : null}
				</div>
			);
		};

		return this.props.action.effects.map((e, n) => <div key={n}>{getEffectDescription(e)}</div>);
	};

	render = () => {
		return (
			<PlayingCard
				type={CardType.Action}
				front={(
					<div className='action-card-front'>
						<div className='action-title'>
							<Text type={TextType.SubHeading}>{this.props.action.name}</Text>
						</div>
						<div className='tags'>
							<Tag>{ActionLogic.getActionType(this.props.action)}</Tag>
							{ActionLogic.getActionSpeed(this.props.action) === 'Quick' ? <Tag>Quick</Tag> : null}
						</div>
						{this.getPrerequisites()}
						{this.getParameters()}
						{this.getEffects()}
					</div>
				)}
				footerText={this.props.footer || 'Action'}
				footerType={this.props.footerType}
				flipped={this.state.flipped}
				disabled={this.props.disabled}
				onClick={this.props.onClick ? this.onClick : null}
			/>
		);
	};
}
