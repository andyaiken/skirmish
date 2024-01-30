import { IconArrowsMove, IconFlask2, IconUser } from '@tabler/icons-react';
import { Component } from 'react';

import type { CombatantModel } from '../../../../models/combatant';
import type { EncounterModel } from '../../../../models/encounter';
import type { ItemModel } from '../../../../models/item';
import type { OptionsModel } from '../../../../models/options';

import { Expander, Tabs, Text, TextType } from '../../../controls';
import { CombatantRowPanel } from '../../../panels';
import { HeroMove } from './hero-move/hero-move';
import { HeroOverview } from './hero-overview/hero-overview';
import { HeroPotions } from './hero-potions/hero-potions';

import './hero-controls.scss';

interface Props {
	combatant: CombatantModel;
	encounter: EncounterModel;
	options: OptionsModel;
	showToken: (combatant: CombatantModel) => void;
	showCharacterSheet: (combatant: CombatantModel) => void;
	move: (encounter: EncounterModel, combatant: CombatantModel, dir: string, cost: number) => void;
	addMovement: (encounter: EncounterModel, combatant: CombatantModel, value: number) => void;
	inspire: (encounter: EncounterModel, combatant: CombatantModel) => void;
	scan: (encounter: EncounterModel, combatant: CombatantModel) => void;
	hide: (encounter: EncounterModel, combatant: CombatantModel) => void;
	levelUp: (combatant: CombatantModel) => void;
	switchAllegiance: (combatant: CombatantModel) => void;
	stun: (combatant: CombatantModel) => void;
	drinkPotion: (encounter: EncounterModel, owner: CombatantModel, drinker: CombatantModel, potion: ItemModel) => void;
}

interface State {
	tab: string;
}

export class HeroControls extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			tab: 'stats'
		};
	}

	setTab = (tab: string) => {
		this.setState({
			tab: tab
		});
	};

	render = () => {
		try {
			const options = [
				{ id: 'stats', display: <IconUser /> },
				{ id: 'move', display: <IconArrowsMove /> }
			];

			if (this.props.combatant.carried.some(i => i.potion)) {
				options.splice(2, 0, { id: 'potion', display: <IconFlask2 /> });
			}

			let content = null;
			switch (this.state.tab) {
				case 'stats':
					content = (
						<HeroOverview
							combatant={this.props.combatant}
							encounter={this.props.encounter}
							options={this.props.options}
							inspire={this.props.inspire}
							scan={this.props.scan}
							hide={this.props.hide}
							levelUp={this.props.levelUp}
							switchAllegiance={this.props.switchAllegiance}
							stun={this.props.stun}
						/>
					);
					break;
				case 'move':
					content = (
						<HeroMove
							combatant={this.props.combatant}
							encounter={this.props.encounter}
							options={this.props.options}
							move={this.props.move}
							addMovement={this.props.addMovement}
						/>
					);
					break;
				case 'potion':
					content = (
						<HeroPotions
							combatant={this.props.combatant}
							encounter={this.props.encounter}
							drinkPotion={this.props.drinkPotion}
						/>
					);
					break;
			}

			return (
				<div className='hero-controls' key={this.props.combatant.id}>
					<CombatantRowPanel
						mode='header'
						combatant={this.props.combatant}
						encounter={this.props.encounter}
						onTokenClick={this.props.showToken}
						onDetails={this.props.showCharacterSheet}
					/>
					{
						this.props.options.showTips ?
							<Expander
								header={
									<Text type={TextType.Tip}>It is {this.props.combatant.name}&apos;s turn; explore the tabs below to see what they can do.</Text>
								}
								content={
									<div>
										<p>The most important things to know are:</p>
										<ul>
											<li>You can move your hero around the map with the <IconArrowsMove size={15} /> tab.</li>
											<li>You can choose your action - you only get one per turn! Your action cards are shown below the map.</li>
											<li>If you can&apos;t see your hero&apos;s token on the map, press their icon and the map will scroll them into view.</li>
										</ul>
										<p>When you&apos;re finished, select <b>End My Turn</b> above.</p>
									</div>
								}
							/>
							: null
					}
					<Tabs
						options={options}
						selectedID={this.state.tab}
						onSelect={this.setTab}
					/>
					<div className='tab-content'>
						{content}
					</div>
				</div>
			);
		}  catch {
			return <div className='hero-controls render-error' />;
		}
	};
}
