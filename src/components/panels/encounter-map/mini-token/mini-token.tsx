import { Component } from 'react';

import { CombatantState } from '../../../../enums/combatant-state';
import { TraitType } from '../../../../enums/trait-type';

import { ConditionLogic } from '../../../../logic/condition-logic';
import { EncounterLogic } from '../../../../logic/encounter-logic';

import type { CombatantModel } from '../../../../models/combatant';
import type { EncounterModel } from '../../../../models/encounter';

import { StatValue, Tag, Text, TextType } from '../../../controls';

import './mini-token.scss';

interface Props {
	combatant: CombatantModel;
	encounter: EncounterModel;
	squareSize: number;
	mapDimensions: { left: number, top: number };
	selectable: boolean;
	selected: boolean;
	onClick: (combatant: CombatantModel) => void;
	onDoubleClick: (combatant: CombatantModel) => void;
}

interface State {
	mouseOver: boolean;
}

export class MiniToken extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			mouseOver: false
		};
	}

	onClick = (e: React.MouseEvent) => {
		if (this.props.selectable) {
			e.stopPropagation();
			this.props.onClick(this.props.combatant);
		}
	};

	onDoubleClick = (e: React.MouseEvent) => {
		if (this.props.selectable) {
			e.stopPropagation();
			this.props.onDoubleClick(this.props.combatant);
		}
	};

	setMouseOver = (value: boolean) => {
		this.setState({
			mouseOver: value
		});
	};

	getMonogram = () => {
		return this.props.combatant.name
			.split(' ')
			.filter(token => token.length > 0)
			.map(token => token[0])
			.join('');
	};

	getPopover = () => {
		const tags = [
			<Tag key='level'>Level {this.props.combatant.level}</Tag>
		];
		if (this.props.combatant.combat.state !== CombatantState.Standing) {
			tags.push(<Tag key='state'>{this.props.combatant.combat.state}</Tag>);
		}
		if (this.props.combatant.combat.stunned) {
			tags.push(<Tag key='stunned'>Stunned</Tag>);
		}
		if (this.props.combatant.combat.hidden > 0) {
			tags.push(<Tag key='hidden'>Hidden</Tag>);
		}

		return (
			<div
				className={this.state.mouseOver ? 'token-popover shown' : 'token-popover'}
				style={{
					left: `-${80 - (this.props.squareSize * this.props.combatant.size / 2)}px`,
					top: `${this.props.squareSize * this.props.combatant.size}px`
				}}
			>
				<Text type={TextType.SubHeading}>{this.props.combatant.name}</Text>
				{tags}
				<hr />
				<StatValue orientation='compact' label='Endurance' value={EncounterLogic.getTraitRank(this.props.encounter, this.props.combatant, TraitType.Endurance)} />
				<StatValue orientation='compact' label='Resolve' value={EncounterLogic.getTraitRank(this.props.encounter, this.props.combatant, TraitType.Resolve)} />
				<StatValue orientation='compact' label='Speed' value={EncounterLogic.getTraitRank(this.props.encounter, this.props.combatant, TraitType.Speed)} />
				<hr />
				<StatValue orientation='compact' label='Damage' value={this.props.combatant.combat.damage} />
				<StatValue
					orientation='compact'
					label='Wounds'
					value={`${this.props.combatant.combat.wounds} / ${EncounterLogic.getTraitRank(this.props.encounter, this.props.combatant, TraitType.Resolve)}`}
				/>
				{this.props.combatant.combat.conditions.length > 0 ? <hr /> : null}
				{this.props.combatant.combat.conditions.map(c => <StatValue key={c.id} orientation='compact' label={ConditionLogic.getConditionDescription(c)} value={c.rank} />)}
			</div>
		);
	};

	render = () => {
		const type = this.props.combatant.type.toLowerCase();
		const current = this.props.combatant.combat.current ? 'current' : '';
		const selectable = this.props.selectable ? 'selectable' : '';
		const selected = this.props.selected ? 'selected' : '';
		const hidden = (this.props.combatant.combat.hidden > 0) ? 'hidden' : '';
		const mouseOver = this.state.mouseOver ? 'mouse-over' : '';
		const className = `encounter-map-mini-token ${type} ${current} ${selectable} ${selected} ${hidden} ${mouseOver}`;

		let healthBar = null;
		if (this.props.combatant.combat.wounds > 0) {
			const resolve = EncounterLogic.getTraitRank(this.props.encounter, this.props.combatant, TraitType.Resolve);
			const barWidth = 1 - (this.props.combatant.combat.wounds / resolve);
			healthBar = (
				<div className='health-bar' style={{ height: `${this.props.squareSize / 5}px` }}>
					<div className='health-bar-gauge' style={{ width: `${100 * barWidth}%` }} />
				</div>
			);
		}

		return (
			<div
				className={className}
				style={{
					width: `${this.props.squareSize * this.props.combatant.size}px`,
					left: `${((this.props.combatant.combat.position.x - this.props.mapDimensions.left) * this.props.squareSize)}px`,
					top: `${((this.props.combatant.combat.position.y - this.props.mapDimensions.top) * this.props.squareSize)}px`,
					fontSize: `${this.props.squareSize * this.props.combatant.size * 0.25}px`
				}}
				onClick={e => this.onClick(e)}
				onDoubleClick={e => this.onDoubleClick(e)}
				onMouseEnter={() => this.setMouseOver(true)}
				onMouseLeave={() => this.setMouseOver(false)}
			>
				<div className={this.props.combatant.combat.current ? 'mini-token-face current' : 'mini-token-face'}>
					{this.getMonogram()}
				</div>
				{healthBar}
				{this.props.combatant.combat.current ? <div className='pulse pulse-one' /> : null}
				{this.props.combatant.combat.current ? <div className='pulse pulse-two' /> : null}
				{this.props.combatant.combat.current ? <div className='pulse pulse-three' /> : null}
				{this.getPopover()}
			</div>
		);
	};
}
