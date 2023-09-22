import { Component } from 'react';

import { BoonType } from '../../../../enums/boon-type';
import { StructureType } from '../../../../enums/structure-type';

import { GameLogic } from '../../../../logic/game-logic';

import type { BoonModel } from '../../../../models/boon';
import type { CombatantModel } from '../../../../models/combatant';
import type { GameModel } from '../../../../models/game';
import type { ItemModel } from '../../../../models/item';
import type { OptionsModel } from '../../../../models/options';
import type { StructureModel } from '../../../../models/structure';

import { BoonCard, StructureCard } from '../../../cards';
import { CardList, Dialog, IconSize, IconType, IconValue, StatValue, Text, TextType } from '../../../controls';
import { BuyStructureModal } from '../../../modals/buy-structure/buy-structure-modal';
import { StrongholdMapPanel } from '../../../panels';

import './stronghold-page.scss';

interface Props {
	game: GameModel;
	options: OptionsModel;
	buyStructure: (structure: StructureModel) => void;
	upgradeStructure: (structure: StructureModel) => void;
	redeemBoon: (boon: BoonModel, hero: CombatantModel | null, item: ItemModel | null, newItem: ItemModel | null, cost: number) => void;
}

interface State {
	selectedStructure: StructureModel | null;
	addingStructure: boolean;
}

export class StrongholdPage extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			selectedStructure: null,
			addingStructure: false
		};
	}

	selectBoon = (boon: BoonModel) => {
		switch (boon.type) {
			case BoonType.Structure: {
				this.props.redeemBoon(boon, null, null, null, 0);
				break;
			}
		}
	};

	buyStructure = (structure: StructureModel) => {
		this.setState({
			addingStructure: false
		}, () => {
			this.props.buyStructure(structure);
		});
	};

	getStructureDetails = (structure: StructureModel) => {
		switch (structure.type) {
			case StructureType.Barracks:
				return (
					<div>
						This structure provides living space for up to {structure.level * 3} heroes.
					</div>
				);
		}

		return null;
	};

	getSidebar = () => {
		if (this.state.selectedStructure) {
			let upgrade = null;
			const upgradeCost = this.state.selectedStructure.level * 50;
			if (this.props.game.money >= upgradeCost) {
				upgrade = (
					<button onClick={() => this.props.upgradeStructure(this.state.selectedStructure as StructureModel)}>
						<div>Upgrade structure</div>
						<IconValue type={IconType.Money} value={upgradeCost} size={IconSize.Button} />
					</button>
				);
			}

			const details = this.getStructureDetails(this.state.selectedStructure);

			return (
				<div key={this.state.selectedStructure.id} className='sidebar'>
					<div className='structure-details-card'>
						<StructureCard structure={this.state.selectedStructure} />
					</div>
					{upgrade ? <hr /> : null}
					{upgrade}
					{details ? <hr /> : null}
					{details}
				</div>
			);
		}

		let boons = null;
		if (this.props.game.boons.filter(boon => GameLogic.getBoonIsStrongholdType(boon)).length > 0) {
			const cards = this.props.game.boons
				.filter(boon => !GameLogic.getBoonIsHeroType(boon))
				.map(b => <BoonCard key={b.id} boon={b} onClick={boon => this.selectBoon(boon)} />);
			boons = (
				<div>
					<Text type={TextType.Information}><p><b>You have won these rewards.</b> Select a card to redeem a reward.</p></Text>
					<CardList cards={cards} />
				</div>
			);
		}

		let addSection = null;
		if (this.props.game.money >= 50) {
			addSection = (
				<button onClick={() => this.setState({ addingStructure: true })}>
					<div>New structure</div>
					<IconValue type={IconType.Money} value={50} size={IconSize.Button} />
				</button>
			);
		}

		return (
			<div key='map' className='sidebar'>
				<Text type={TextType.SubHeading}>Your Stronghold</Text>
				<Text>This is your base of operations. Select a structure on the map to see what it can do.</Text>
				<hr />
				<StatValue orientation='vertical' label='Max Heroes' value={GameLogic.getHeroLimit(this.props.game)} />
				{boons !== null ? <hr /> : null}
				{boons}
				{addSection !== null ? <hr /> : null}
				{addSection}
			</div>
		);
	};

	getDialog = () => {
		if (this.state.addingStructure) {
			return (
				<Dialog
					content={(
						<BuyStructureModal
							game={this.props.game}
							options={this.props.options}
							buyStructure={this.buyStructure}
						/>
					)}
				/>
			);
		}

		return null;
	};

	render = () => {
		try {
			return (
				<div className='stronghold-page'>
					<div className='map-content' onClick={() => this.setState({ selectedStructure: null })}>
						<StrongholdMapPanel
							stronghold={this.props.game.stronghold}
							selectedStructure={this.state.selectedStructure}
							onSelectStructure={structure => this.setState({ selectedStructure: structure })}
						/>
					</div>
					{this.getSidebar()}
					{this.getDialog()}
				</div>
			);
		} catch {
			return <div className='stronghold-page render-error' />;
		}
	};
}
