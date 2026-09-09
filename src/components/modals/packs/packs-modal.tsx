import { Component } from 'react';

import { PackLogic } from '../../../logic/pack/pack-logic';

import type { OptionsModel } from '../../../models/options';
import type { PackModel } from '../../../models/pack';

import { CardList, Dialog, Text, TextType } from '../../controls';
import { PackCard } from '../../cards';

import { PackModal } from '../pack/pack-modal';

import './packs-modal.scss';

interface Props {
	options: OptionsModel;
	getPrice: (pack: PackModel) => string | null;
	addPacks: (packs: PackModel[]) => void;
	removePack: (pack: PackModel) => void;
	restorePurchases: () => void;
}

interface State {
	selectedPack: PackModel | null;
}

export class PacksModal extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			selectedPack: null
		};
	}

	getDialog = () => {
		if (!this.state.selectedPack) {
			return null;
		}

		const pack = this.state.selectedPack;

		return (
			<Dialog
				content={
					<PackModal
						pack={pack}
						owned={this.props.options.packIDs.includes(pack.id)}
						price={this.props.getPrice(pack)}
						buyPack={p => this.props.addPacks([ p ])}
					/>
				}
				level={2}
				onClose={() => this.setState({ selectedPack: null })}
			/>
		);
	};

	render = () => {
		const ownedPacks = PackLogic.getExpansionPacks().filter(pack => this.props.options.packIDs.includes(pack.id));
		const notOwnedPacks = PackLogic.getExpansionPacks().filter(pack => !this.props.options.packIDs.includes(pack.id));

		const owned = ownedPacks.map(pack => {
			return (
				<PackCard
					key={pack.id}
					pack={pack}
					onClick={p => this.setState({ selectedPack: p })}
					onRemove={this.props.options.developer ? p => this.props.removePack(p) : null}
				/>
			);
		});
		const notOwned = notOwnedPacks.map(pack => {
			return (
				<PackCard
					key={pack.id}
					pack={pack}
					onClick={p => this.setState({ selectedPack: p })}
				/>
			);
		});

		return (
			<div className='packs-modal'>
				<Text type={TextType.Heading}>Card Packs</Text>
				{notOwned.length > 0 ? <hr /> : null}
				{notOwned.length > 0 ? <Text type={TextType.SubHeading}>Available Packs</Text> : null}
				{notOwned.length > 0 ? <CardList cards={notOwned} /> : null}
				{owned.length > 0 ? <hr /> : null}
				{owned.length > 0 ? <Text type={TextType.SubHeading}>My Packs</Text> : null}
				{owned.length > 0 ? <CardList cards={owned} /> : null}
				<hr />
				<button className='restore-btn' onClick={() => this.props.restorePurchases()}>Restore Purchases</button>
				<Text type={TextType.Small}>
					<p>Already bought some packs? Restore them here after reinstalling or on a new device.</p>
				</Text>
				{this.getDialog()}
			</div>
		);
	};
}
