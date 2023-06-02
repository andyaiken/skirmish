import { Component, createRef } from 'react';

import { TraitType } from '../../../../enums/trait-type';

import { EncounterLogic } from '../../../../logic/encounter-logic';

import type { CombatantModel } from '../../../../models/combatant';
import type { EncounterModel } from '../../../../models/encounter';

import { Color } from '../../../../utils/color';

import './mini-token.scss';

interface Props {
	combatant: CombatantModel;
	encounter: EncounterModel | null;
	squareSize: number;
	mapDimensions: { left: number, top: number };
	selectable: boolean;
	selected: boolean;
	onClick: (combatant: CombatantModel) => void;
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

	tokenRef = createRef<HTMLDivElement>();

	scrollIntoView = () => {
		this.tokenRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	onClick = (e: React.MouseEvent) => {
		if (this.props.selectable) {
			e.stopPropagation();
			this.props.onClick(this.props.combatant);
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

	render = () => {
		try {
			const current = this.props.combatant.combat.current ? 'current' : '';
			const selectable = this.props.selectable ? 'selectable' : '';
			const selected = this.props.selected ? 'selected' : '';
			const hidden = !!this.props.encounter && (this.props.combatant.combat.hidden > 0) ? 'hidden' : '';
			const mouseOver = this.state.mouseOver ? 'mouse-over' : '';
			const className = `encounter-map-mini-token ${current} ${selectable} ${selected} ${hidden} ${mouseOver}`;

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

			let colorDark = this.props.combatant.color;
			let colorLight = this.props.combatant.color;
			const color = Color.parse(this.props.combatant.color);
			if (color) {
				colorDark = Color.toString(Color.darken(color));
				colorLight = Color.toString(Color.lighten(color));
			}

			return (
				<div
					ref={this.tokenRef}
					className={className}
					style={{
						width: this.props.encounter ? `${this.props.squareSize * this.props.combatant.size}px` : `${this.props.squareSize}px`,
						left: this.props.encounter ? `${((this.props.combatant.combat.position.x - this.props.mapDimensions.left) * this.props.squareSize)}px` : '0',
						top: this.props.encounter ? `${((this.props.combatant.combat.position.y - this.props.mapDimensions.top) * this.props.squareSize)}px` : '0',
						fontSize: this.props.encounter ? `${this.props.squareSize * this.props.combatant.size * 0.35}px` : `${this.props.squareSize * 0.35}px`,
						backgroundImage: `linear-gradient(135deg, ${this.props.combatant.color}, ${colorDark})`
					}}
					onClick={e => this.onClick(e)}
					onMouseEnter={() => this.setMouseOver(true)}
					onMouseLeave={() => this.setMouseOver(false)}
				>
					<div
						className={this.props.combatant.combat.current ? 'mini-token-face current' : 'mini-token-face'}
						style={{
							backgroundImage: `linear-gradient(135deg, ${colorLight}, ${this.props.combatant.color})`
						}}
					>
						{this.getMonogram()}
					</div>
					{healthBar}
					{!!this.props.encounter && this.props.combatant.combat.current ? <div className='pulse pulse-one' /> : null}
					{!!this.props.encounter && this.props.combatant.combat.current ? <div className='pulse pulse-two' /> : null}
					{!!this.props.encounter && this.props.combatant.combat.current ? <div className='pulse pulse-three' /> : null}
				</div>
			);
		} catch {
			return <div className='encounter-map-mini-token render-error' />;
		}
	};
}
