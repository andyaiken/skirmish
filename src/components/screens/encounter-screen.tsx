import { Button, Col, Row } from 'antd';
import React from 'react';
import { Encounter, EncounterHelper, EncounterState } from '../../models/encounter';
import { Game } from '../../models/game';
import { Hero } from '../../models/hero';
import { Item } from '../../models/item';
import { CharacterSheetPanel } from '../panels/character-sheet-panel';
import { EncounterMapPanel } from '../panels/encounter-map-panel';
import { InitiativeListPanel } from '../panels/initiative-list-panel';

interface Props {
	encounter: Encounter;
	game: Game;
	equipItem: (item: Item, hero: Hero) => void;
	unequipItem: (item: Item, hero: Hero) => void;
	finish: (state: 'victory' | 'defeat' | 'retreat' | 'concede') => void;
}

export class EncounterScreen extends React.Component<Props> {
	public render() {
		let controls = null;
		switch (EncounterHelper.getState(this.props.encounter)) {
			case EncounterState.Active:
				controls = (
					<div>
						<CharacterSheetPanel
							hero={null as unknown as Hero}
							game={this.props.game}
							equipItem={(item, hero) => this.props.equipItem(item, hero)}
							unequipItem={(item, hero) => this.props.unequipItem(item, hero)}
						/>
						<div>action card slots</div>
						<Row gutter={10}>
							<Col span={12}>
								<Button block={true} onClick={() => this.props.finish('retreat')}>RETREAT</Button>
							</Col>
							<Col span={12}>
								<Button block={true} onClick={() => this.props.finish('concede')}>CONCEDE</Button>
							</Col>
						</Row>
					</div>
				);
				break;
			case EncounterState.Won:
				controls = (
					<div>
						<Button block={true} onClick={() => this.props.finish('victory')}>VICTORY</Button>
					</div>
				);
				break;
			case EncounterState.Defeated:
				controls = (
					<div>
						<Button block={true} onClick={() => this.props.finish('defeat')}>DEFEAT</Button>
					</div>
				);
				break;
		}

		return (
			<div>
				<Row gutter={10} style={{ height: '100%' }}>
					<Col span={6} style={{ height: '100%', overflowY: 'auto' }}>
						<InitiativeListPanel />
					</Col>
					<Col span={18} style={{ height: '100%', display: 'flex', flexDirection: 'column'}}>
						<EncounterMapPanel map={this.props.encounter.map} />
						{controls}
					</Col>
				</Row>
			</div>
		);
	}
}
