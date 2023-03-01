import { Component } from 'react';

import { ActionRangeType } from '../../../enums/action-range-type';
import { ActionTargetType } from '../../../enums/action-target-type';

import type { ActionAttackModel, ActionEffectModel, ActionModel, ActionPrerequisiteModel, ActionTargetModel } from '../../../models/action';

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

		return (
			<div>
				<Text type={TextType.MinorHeading}>Prerequisites</Text>
				{prerequisites.map((p, n) => <Text key={n}>{p.name}</Text>)}
			</div>
		);
	};

	getTarget = (target: ActionTargetModel) => {
		let count = '';
		let type = '';
		if (target.targets) {
			let plural = false;

			// [one (1) / all (Number.Max) / up to N] [allies / enemies / combatants / squares / walls]
			if (target.targets.count === 1) {
				count = 'one';
			} else if (target.targets.count === Number.MAX_VALUE) {
				count = 'all';
				plural = true;
			} else {
				count = `up to ${target.targets.count}`;
				plural = true;
			}

			switch (target.targets.type) {
				case ActionTargetType.Combatants:
					type = plural ? 'combatants' : 'combatant';
					break;
				case ActionTargetType.Enemies:
					type = plural ? 'enemies' : 'enemy';
					break;
				case ActionTargetType.Allies:
					type = plural ? 'allies' : 'ally';
					break;
				case ActionTargetType.Squares:
					type = plural ? 'squares' : 'square';
					break;
				case ActionTargetType.Walls:
					type = plural ? 'walls' : 'wall';
					break;
			}
		}

		let str = '';
		switch (target.range.type) {
			case ActionRangeType.Self:
				str = 'self';
				break;
			case ActionRangeType.Adjacent:
				str = `${count} adjacent ${type}`;
				break;
			case ActionRangeType.Burst:
				str = `${count} ${type} within ${target.range.radius} squares`;
				break;
			case ActionRangeType.Weapon:
				if (target.range.radius > 0) {
					str = `${count} ${type} within weapon range +${target.range.radius}`;
				} else {
					str = `${count} ${type} within weapon range`;
				}
				break;
			case ActionRangeType.Area:
				if (target.range.radius > 0) {
					str = `${count} ${type} in a radius of ${target.range.radius} squares centered on a square within ${target.range.distance} squares`;
				} else {
					str = `${count} ${type} within ${target.range.distance} squares`;
				}
				break;
		}

		return (
			<div>
				<Text>Target: {str}</Text>
			</div>
		);
	};

	getAttackRoll = (roll: ActionAttackModel) => {
		let skill = `${roll.skill}`;
		if (roll.skillBonus !== 0) {
			skill = `${roll.skill} ${roll.skillBonus >= 0 ? '+' : ''}${roll.skillBonus}`;
		}

		let trait = `${roll.trait}`;
		if (roll.traitBonus !== 0) {
			trait = `${roll.trait} ${roll.traitBonus >= 0 ? '+' : ''}${roll.traitBonus}`;
		}

		return (
			<div>
				<Text>Roll: {`${skill} vs ${trait}`}</Text>
			</div>
		);
	};

	getEffects = (effects: ActionEffectModel[], heading = '') => {
		if (effects.length === 0) {
			return null;
		}

		return (
			<div>
				{heading !== '' ? <Text type={TextType.MinorHeading}>{heading}</Text> : null}
				{effects.map((e, n) => <Text key={n}>{e.name}</Text>)}
			</div>
		);
	};

	render = () => {
		return (
			<div className='action-card'>
				<Text type={TextType.SubHeading}>{this.props.action.name}</Text>
				{this.getPrerequisites(this.props.action.prerequisites)}
				{this.getTarget(this.props.action.target)}
				{this.getEffects(this.props.action.prologue)}
				{this.props.action.attack ? this.getAttackRoll(this.props.action.attack.roll) : null}
				{this.props.action.attack ? this.getEffects(this.props.action.attack.hit, 'On Hit') : null}
				{this.props.action.attack ? this.getEffects(this.props.action.attack.miss, 'On Miss') : null}
				{this.getEffects(this.props.action.epilogue)}
			</div>
		);
	};
}
