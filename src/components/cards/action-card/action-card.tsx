import { Component } from 'react';

import { ActionLogic, ActionPrerequisites } from '../../../logic/action-logic';

import type { ActionEffectModel, ActionModel } from '../../../models/action';
import type { CombatantModel } from '../../../models/combatant';
import type { EncounterModel } from '../../../models/encounter';

import { Tag, Text, TextType } from '../../controls';

import './action-card.scss';

interface Props {
	action: ActionModel;
	encounter: EncounterModel | null;
}

export class ActionCard extends Component<Props> {
	static defaultProps = {
		encounter: null
	};

	getPrerequisites = () => {
		if (this.props.encounter === null) {
			return [];
		}

		const combatant = this.props.encounter.combatants.find(c => c.combat.current) as CombatantModel;
		return this.props.action.prerequisites
			.filter(p => !ActionPrerequisites.isSatisfied(p, this.props.encounter as EncounterModel, combatant))
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
					<div className='effect'>{effect.description}</div>
					{children ? <div className='indent'>{children}</div> : null}
				</div>
			);
		};

		return this.props.action.effects.map((e, n) => <div key={n}>{getEffectDescription(e)}</div>);
	};

	render = () => {
		return (
			<div className='action-card'>
				<Text type={TextType.SubHeading}>{this.props.action.name}</Text>
				<div className='tags'>
					<Tag>{ActionLogic.getActionType(this.props.action)}</Tag>
					{ActionLogic.getActionSpeed(this.props.action) === 'Quick' ? <Tag>Quick</Tag> : null}
				</div>
				{this.getPrerequisites()}
				{this.getParameters()}
				{this.getEffects()}
			</div>
		);
	};
}
