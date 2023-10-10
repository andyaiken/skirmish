import { Component } from 'react';
import { PackData } from '../../../../data/pack-data';

import { GameLogic } from '../../../../logic/game-logic';

import type { OptionsModel } from '../../../../models/options';

import { Text, TextType } from '../../../controls';

import './cards-tab.scss';

interface Props {
	options: OptionsModel;
}

export class CardsTab extends Component<Props> {
	getCards = (type: string, packID: string) => {
		let names: string[] = [];

		switch (type) {
			case 'heroes':
				names = GameLogic.getHeroSpeciesDeck(this.props.options.packIDs)
					.filter(s => s.packID === packID)
					.map(s => s.name);
				break;
			case 'monsters':
				names = GameLogic.getMonsterSpeciesDeck(this.props.options.packIDs)
					.filter(s => s.packID === packID)
					.map(s => s.name);
				break;
			case 'roles':
				names = GameLogic.getRoleDeck(this.props.options.packIDs)
					.filter(r => r.packID === packID)
					.map(r => r.name);
				break;
			case 'backgrounds':
				names = GameLogic.getBackgroundDeck(this.props.options.packIDs)
					.filter(b => b.packID === packID)
					.map(b => b.name);
				break;
			case 'structures':
				names = GameLogic.getStructureDeck(this.props.options.packIDs)
					.filter(s => s.packID === packID)
					.map(s => s.name);
				break;
			case 'potions':
				names = GameLogic.getPotionDeck(this.props.options.packIDs)
					.filter(p => p.packID === packID)
					.map(p => p.name);
				break;
			case 'items':
				names = GameLogic.getItemDeck(this.props.options.packIDs)
					.filter(i => i.packID === packID)
					.map(i => i.name);
				break;
		}

		return names.map((name, n) => <Text key={n} type={TextType.Small}>{name}</Text>);
	};

	render = () => {
		try {
			const types = [
				'heroes',
				'monsters',
				'roles',
				'backgrounds',
				'structures',
				'potions',
				'items'
			];

			const packIDs = [ '' ].concat(PackData.getList().map(p => p.id));

			const rows = types.map(type => {
				return (
					<div key={type}>
						<Text type={TextType.SubHeading}>{type}</Text>
						<div className='row'>
							{
								packIDs.map(id => {
									return (
										<div key={id} className='cell'>
											{this.getCards(type, id)}
										</div>
									);
								})
							}
						</div>
					</div>
				);
			});

			return (
				<div className='cards-tab'>
					<div className='row'>
						{
							packIDs.map(id => {
								const pack = GameLogic.getPack(id);
								const name = pack ? pack.name : 'Skirmish';
								return (
									<div key={id} className='cell'>
										<Text type={TextType.Small}>{name}</Text>
									</div>
								);
							})
						}
					</div>
					{rows}
				</div>
			);
		} catch {
			return <div className='cards-tab render-error' />;
		}
	};
}
