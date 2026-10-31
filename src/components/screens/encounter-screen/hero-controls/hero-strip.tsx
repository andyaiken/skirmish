import { Component, ReactNode } from 'react';
import { IconArrowsMove, IconCircleCheckFilled, IconDots, IconFlask2, IconId, IconSparkles, IconUser, IconX } from '@tabler/icons-react';

import { StructureType } from '../../../../enums/structure-type';

import type { CombatantModel } from '../../../../models/combatant';
import type { EncounterModel } from '../../../../models/encounter';
import type { GameModel } from '../../../../models/game';
import type { ItemModel } from '../../../../models/item';
import type { OptionsModel } from '../../../../models/options';

import { IconSize, IconType, IconValue } from '../../../controls';
import { HeroMove } from './hero-move/hero-move';
import { HeroOverview } from './hero-overview/hero-overview';
import { HeroPotions } from './hero-potions/hero-potions';
import { MiniToken } from '../../../panels/encounter-map/mini-token/mini-token';
import { centrePopover } from '../popover';

import './hero-strip.scss';

type Submenu = 'end' | 'move' | 'potion' | 'quick' | 'stats';

interface Props {
	combatant: CombatantModel;
	encounter: EncounterModel;
	game: GameModel;
	options: OptionsModel;
	showToken: (combatant: CombatantModel) => void;
	showCharacterSheet: (combatant: CombatantModel) => void;
	move: (encounter: EncounterModel, combatant: CombatantModel, dir: string, cost: number) => void;
	addMovement: (encounter: EncounterModel, combatant: CombatantModel, value: number) => void;
	inspire: (encounter: EncounterModel, combatant: CombatantModel) => void;
	scan: (encounter: EncounterModel, combatant: CombatantModel) => void;
	treatWounds: (encounter: EncounterModel, combatant: CombatantModel, spendCharge: StructureType | null) => void;
	hide: (encounter: EncounterModel, combatant: CombatantModel) => void;
	levelUp: (combatant: CombatantModel) => void;
	switchAllegiance: (combatant: CombatantModel) => void;
	stun: (combatant: CombatantModel) => void;
	knockout: (combatant: CombatantModel) => void;
	kill: (combatant: CombatantModel) => void;
	toggleBottomPanel: () => void;
	horizontal?: boolean;
	endTurn?: ReactNode;
	drinkPotion: (encounter: EncounterModel, owner: CombatantModel, drinker: CombatantModel, potion: ItemModel) => void;
}

interface State {
	submenu: Submenu | null;
}

// What the hero's panel is when it is collapsed: a column of buttons, each of which opens what it
// stands for in a panel hovering to the left, over the map.
export class HeroStrip extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			submenu: null
		};
	}

	componentDidUpdate = (prevProps: Props) => {
		if (prevProps.combatant.id !== this.props.combatant.id && this.state.submenu !== null) {
			this.setState({ submenu: null });
		}
	};

	getButton = (id: Submenu, title: string, icon: ReactNode) => {
		const open = this.state.submenu === id;
		return (
			<button
				className={open ? 'icon-btn open' : 'icon-btn'}
				title={title}
				aria-expanded={open}
				onClick={() => this.setState({ submenu: open ? null : id })}
			>
				{icon}
			</button>
		);
	};

	getQuickAction = (label: string, use: (encounter: EncounterModel, combatant: CombatantModel) => void) => {
		const disabled = this.props.combatant.combat.stunned || (this.props.combatant.combat.movement < 4);
		return (
			<button
				disabled={disabled}
				onClick={() => {
					this.setState({ submenu: null });
					use(this.props.encounter, this.props.combatant);
				}}
			>
				{label}<br /><IconValue value={4} type={IconType.Movement} size={IconSize.Button} />
			</button>
		);
	};

	getMenu = (id: Submenu, hasPotions: boolean) => {
		switch (id) {
			case 'move':
				return (
					<HeroMove
						combatant={this.props.combatant}
						encounter={this.props.encounter}
						options={this.props.options}
						move={this.props.move}
						addMovement={this.props.addMovement}
					/>
				);
			case 'potion':
				return hasPotions ?
					<HeroPotions
						combatant={this.props.combatant}
						encounter={this.props.encounter}
						drinkPotion={this.props.drinkPotion}
					/>
					: null;
			case 'end':
				return this.props.endTurn;
			case 'quick':
				return (
					<>
						{this.getQuickAction('Inspire', this.props.inspire)}
						{this.getQuickAction('Scan', this.props.scan)}
						{this.getQuickAction('Hide', this.props.hide)}
					</>
				);
			case 'stats':
				return (
					<HeroOverview
						combatant={this.props.combatant}
						encounter={this.props.encounter}
						game={this.props.game}
						options={this.props.options}
						inspire={this.props.inspire}
						scan={this.props.scan}
						treatWounds={this.props.treatWounds}
						hide={this.props.hide}
						levelUp={this.props.levelUp}
						switchAllegiance={this.props.switchAllegiance}
						stun={this.props.stun}
						knockout={this.props.knockout}
						kill={this.props.kill}
						quickActions={false}
					/>
				);
		}
	};

	// A button, and the panel it opens, which is centred on the button.
	getGroup = (id: Submenu, title: string, icon: ReactNode, hasPotions: boolean) => {
		const menu = this.state.submenu === id ? this.getMenu(id, hasPotions) : null;
		return (
			<div className='hero-strip-group'>
				{this.getButton(id, title, icon)}
				{menu ? <div className={`hero-strip-submenu ${id}`} ref={e => centrePopover(e, this.props.horizontal === true)}>{menu}</div> : null}
			</div>
		);
	};

	render = () => {
		const hasPotions = this.props.combatant.carried.some(i => i.potion);
		const actionTaken = !!this.props.combatant.combat.selectedAction && this.props.combatant.combat.selectedAction.used;

		// Clicks stop here: the strip around this is what expands the panel, and a button in it
		// should not.
		return (
			<div className={this.props.horizontal ? 'hero-strip horizontal' : 'hero-strip'} key={this.props.combatant.id} onClick={e => e.stopPropagation()}>
				<MiniToken
					combatant={this.props.combatant}
					encounter={null}
					squareSize={40}
					mapDimensions={{ left: 0, top: 0 }}
					selectable={true}
					selected={false}
					onClick={this.props.showToken}
				/>
				<button className='icon-btn' title='Action' onClick={() => this.props.toggleBottomPanel()}>
					{actionTaken ? <IconCircleCheckFilled className='action-taken' /> : <IconDots />}
				</button>
				{this.getGroup('stats', 'Stats', <IconUser />, hasPotions)}
				{this.getGroup('move', 'Movement', <IconArrowsMove />, hasPotions)}
				{this.getGroup('quick', 'Inspire / Scan / Hide', <IconSparkles />, hasPotions)}
				{hasPotions ? this.getGroup('potion', 'Potions', <IconFlask2 />, hasPotions) : null}
				<button className='icon-btn' title='Character Sheet' onClick={() => this.props.showCharacterSheet(this.props.combatant)}>
					<IconId />
				</button>
				{this.props.endTurn ? this.getGroup('end', 'End turn', <IconX />, hasPotions) : null}
			</div>
		);
	};
}
