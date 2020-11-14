import { Button, Col, Divider, Row } from 'antd';
import React from 'react';
import { Encounter } from '../../models/encounter';
import { EncounterMapPanel } from '../panels/encounter-map-panel';

interface Props {
	encounter: Encounter;
	finish: () => void;
}

export class EncounterScreen extends React.Component<Props> {
	private victory() {
		// TODO
		// Get equipment from dead heroes
		// Remove dead heroes from the game
		// If region conquered: show message, add a new level 1 hero
		// Show victory message (plus loot)
		// Increment XP for remaining heroes
		// Clear current encounter

		this.props.finish();
	}

	private defeat() {
		// TODO
		// Remove dead heroes from the game
		// Show defeat message
		// Clear current encounter

		this.props.finish();
	}

	private retreat() {
		// TODO
		// Remove dead heroes from the game
		// Show retreat message
		// Clear current encounter

		this.props.finish();
	}

	private concede() {
		// TODO
		// Remove all current heroes from the game
		// Show concede message
		// Clear current encounter

		this.props.finish();
	}

	public render() {
		return (
			<div>
				<EncounterMapPanel map={this.props.encounter.map}/>
				<Divider/>
				<Row gutter={10}>
					<Col span={6}>
						<Button block={true} onClick={() => this.victory()}>VICTORY</Button>
					</Col>
					<Col span={6}>
						<Button block={true} onClick={() => this.defeat()}>DEFEAT</Button>
					</Col>
					<Col span={6}>
						<Button block={true} onClick={() => this.retreat()}>RETREAT</Button>
					</Col>
					<Col span={6}>
						<Button block={true} onClick={() => this.concede()}>CONCEDE</Button>
					</Col>
				</Row>
			</div>
		);
	}
}
