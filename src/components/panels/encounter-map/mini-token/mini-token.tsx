import { Component } from 'react';

import { CardType } from '../../../../enums/card-type';
import { TraitType } from '../../../../enums/trait-type';

import { EncounterLogic } from '../../../../logic/encounter-logic';

import type { CombatantModel } from '../../../../models/combatant';
import type { EncounterModel } from '../../../../models/encounter';

import { HeroCard } from '../../../cards';
import { PlayingCard } from '../../../controls';

import './mini-token.scss';

interface Props {
	combatant: CombatantModel;
	encounter: EncounterModel | null;
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
			.map(token => {
				if (/^\d+$/.test(token)) {
					return token;
				}
				return token[0];
			})
			.join('');
	};

	getPopover = () => {
		if (!this.props.encounter) {
			return null;
		}

		return (
			<div
				className={this.state.mouseOver ? 'token-popover shown' : 'token-popover'}
				style={{
					left: `-${100 - (this.props.squareSize * this.props.combatant.size / 2)}px`,
					top: `${this.props.squareSize * this.props.combatant.size}px`
				}}
			>
				<PlayingCard type={CardType.Hero} front={<HeroCard hero={this.props.combatant} encounter={this.props.encounter} />} />
			</div>
		);
	};

	render = () => {
		try {
			const type = this.props.combatant.type.toLowerCase();
			const current = !!this.props.encounter && this.props.combatant.combat.current ? 'current' : '';
			const selectable = this.props.selectable ? 'selectable' : '';
			const selected = this.props.selected ? 'selected' : '';
			const hidden = (this.props.combatant.combat.hidden > 0) ? 'hidden' : '';
			const mouseOver = this.state.mouseOver ? 'mouse-over' : '';
			const className = `encounter-map-mini-token ${type} ${current} ${selectable} ${selected} ${hidden} ${mouseOver}`;

			let healthBar = null;
			if (this.props.encounter && (this.props.combatant.combat.wounds > 0)) {
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
						width: this.props.encounter ? `${this.props.squareSize * this.props.combatant.size}px` : `${this.props.squareSize}px`,
						left: this.props.encounter ? `${((this.props.combatant.combat.position.x - this.props.mapDimensions.left) * this.props.squareSize)}px` : '0',
						top: this.props.encounter ? `${((this.props.combatant.combat.position.y - this.props.mapDimensions.top) * this.props.squareSize)}px` : '0',
						fontSize: this.props.encounter ? `${this.props.squareSize * this.props.combatant.size * 0.25}px` : `${this.props.squareSize * 0.25}px`
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
					{!!this.props.encounter && this.props.combatant.combat.current ? <div className='pulse pulse-one' /> : null}
					{!!this.props.encounter && this.props.combatant.combat.current ? <div className='pulse pulse-two' /> : null}
					{!!this.props.encounter && this.props.combatant.combat.current ? <div className='pulse pulse-three' /> : null}
					{this.getPopover()}
				</div>
			);
		} catch {
			return <div className='encounter-map-mini-token render-error' />;
		}
	};
}
