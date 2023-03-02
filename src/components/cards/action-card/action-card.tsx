import { Component } from 'react';

import { ActionLogic } from '../../../logic/action-logic';

import type { ActionEffectModel, ActionModel, ActionPrerequisiteModel, ActionTargetModel, ActionWeaponModel } from '../../../models/action';

import { Text, TextType } from '../../controls';

import './action-card.scss';

interface Props {
	action: ActionModel;
}

export class ActionCard extends Component<Props> {
	getPrerequisites = (prerequisites: ActionPrerequisiteModel[]) => {
		if (prerequisites.length === 0) {
			return null;
		}

		return prerequisites.map((p, n) => <div key={n} className='prerequisite'>{p.description}</div>);
	};

	getParameters = (parameters: (ActionTargetModel | ActionWeaponModel)[]) => {
		if (parameters.length === 0) {
			return null;
		}

		const getParameterDescription = (parameter: ActionTargetModel | ActionWeaponModel) => {
			switch (parameter.name) {
				case 'targets': {
					return `Targets: ${ActionLogic.getTargetDescription(parameter as ActionTargetModel)}`;
				}
				case 'weapon': {
					const wpn = parameter as ActionWeaponModel;
					return `Weapon: ${wpn.type}`;
				}
			}
		};

		return parameters.map((p, n) => <div key={n} className='parameter'>{getParameterDescription(p)}</div>);
	};

	getEffects = (effects: ActionEffectModel[]) => {
		if (effects.length === 0) {
			return null;
		}

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

		return effects.map((e, n) => <div key={n}>{getEffectDescription(e)}</div>);
	};

	render = () => {
		return (
			<div className='action-card'>
				<Text type={TextType.SubHeading}>{this.props.action.name}</Text>
				{this.getPrerequisites(this.props.action.prerequisites)}
				{this.getParameters(this.props.action.parameters)}
				{this.getEffects(this.props.action.effects)}
			</div>
		);
	};
}
