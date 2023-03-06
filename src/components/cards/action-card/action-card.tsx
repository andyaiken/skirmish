import { Component } from 'react';

import { ActionLogic, ActionPrerequisites } from '../../../logic/action-logic';

import type { ActionEffectModel, ActionModel, ActionOriginParameterModel, ActionParameterModel, ActionTargetParameterModel, ActionWeaponParameterModel } from '../../../models/action';
import type { EncounterModel } from '../../../models/encounter';

import { Text, TextType } from '../../controls';

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

		return this.props.action.prerequisites
			.filter(p => !ActionPrerequisites.isSatisfied(p, this.props.encounter as EncounterModel))
			.map((p, n) => <div key={n} className='prerequisite highlighted'>{p.description}</div>);
	};

	getParameters = () => {
		const getParameterDescription = (parameter: ActionParameterModel) => {
			switch (parameter.name) {
				case 'origin': {
					const originParam = parameter as ActionOriginParameterModel;
					if (originParam.distance === 'weapon') {
						return 'Origin: within weapon range';
					}
					return `Origin: within ${originParam.distance} squares`;
				}
				case 'weapon': {
					const weaponParam = parameter as ActionWeaponParameterModel;
					return `Weapon: ${weaponParam.type}`;
				}
				case 'targets': {
					const targetParam = parameter as ActionTargetParameterModel;
					return `Targets: ${ActionLogic.getTargetDescription(targetParam)}`;
				}
			}
		};

		return this.props.action.parameters.map((p, n) => <div key={n} className='parameter'>{getParameterDescription(p)}</div>);
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
				{this.getPrerequisites()}
				{this.getParameters()}
				{this.getEffects()}
			</div>
		);
	};
}
