import { Component, ReactNode } from 'react';
import { IconArrowsMove, IconFlask2, IconId } from '@tabler/icons-react';

import { StructureType } from '../../../../enums/structure-type';

import type { CombatantModel } from '../../../../models/combatant';
import type { EncounterModel } from '../../../../models/encounter';
import type { GameModel } from '../../../../models/game';
import type { ItemModel } from '../../../../models/item';
import type { OptionsModel } from '../../../../models/options';

import { Expander, Text, TextType } from '../../../controls';
import { HeroMove } from './hero-move/hero-move';
import { HeroOverview } from './hero-overview/hero-overview';
import { HeroPotions } from './hero-potions/hero-potions';
import { MiniToken } from '../../../panels/encounter-map/mini-token/mini-token';

import './hero-controls.scss';

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
	drinkPotion: (encounter: EncounterModel, owner: CombatantModel, drinker: CombatantModel, potion: ItemModel) => void;
}

interface State {
	// Which of the toolbar's panels is hovering over the controls, if any; one at a time
	submenu: 'move' | 'potion' | null;
}

export class HeroControls extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			submenu: null
		};
	}

	getSubmenuButton = (id: 'move' | 'potion', title: string, icon: ReactNode) => {
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

	render = () => {
		const hasPotions = this.props.combatant.carried.some(i => i.potion);

		return (
			<div className='hero-controls' key={this.props.combatant.id}>
				{
					this.props.options.showTips ?
						<Expander
							header={
								<Text type={TextType.Tip}>It is {this.props.combatant.name}&apos;s turn; explore the buttons below to see what they can do.</Text>
							}
							content={
								<div>
									<p>The most important things to know are:</p>
									<ul>
										<li>You can move your hero around the map with the <IconArrowsMove size={15} /> button.</li>
										<li>You can choose your action - you only get one per turn! Your action cards are shown below the map.</li>
										<li>If you can&apos;t see your hero&apos;s token on the map, press their icon and the map will scroll them into view.</li>
									</ul>
									<p>When you&apos;re finished, select <b>End My Turn</b> above.</p>
								</div>
							}
						/>
						: null
				}
				<div className='hero-content'>
					<Text type={TextType.SubHeading}>{this.props.combatant.name}</Text>
					<div className='hero-toolbar'>
						<div className='hero-buttons'>
							<MiniToken
								combatant={this.props.combatant}
								encounter={null}
								squareSize={40}
								mapDimensions={{ left: 0, top: 0 }}
								selectable={true}
								selected={false}
								onClick={this.props.showToken}
							/>
							{this.getSubmenuButton('move', 'Movement', <IconArrowsMove size={36} />)}
							{hasPotions ? this.getSubmenuButton('potion', 'Potions', <IconFlask2 size={36} />) : null}
							<button className='icon-btn' title='Character Sheet' onClick={() => this.props.showCharacterSheet(this.props.combatant)}>
								<IconId size={36} />
							</button>
						</div>
						{
							this.state.submenu === 'move' ?
								<div className='hero-submenu'>
									<HeroMove
										combatant={this.props.combatant}
										encounter={this.props.encounter}
										options={this.props.options}
										move={this.props.move}
										addMovement={this.props.addMovement}
									/>
								</div>
								: null
						}
						{
							this.state.submenu === 'potion' && hasPotions ?
								<div className='hero-submenu'>
									<HeroPotions
										combatant={this.props.combatant}
										encounter={this.props.encounter}
										drinkPotion={this.props.drinkPotion}
									/>
								</div>
								: null
						}
					</div>
					<div className='hero-stats'>
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
						/>
					</div>
				</div>
			</div>
		);
	};
}
