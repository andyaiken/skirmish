import { Component } from 'react';

import { CombatantType } from '../../../enums/combatant-type';

import type { SpeciesModel } from '../../../models/species';

import { ActionListItemPanel, FeatureListItemPanel, TextListItemPanel } from '../../panels';

import { Tag, Text, TextType } from '../../controls';

import './species-card.scss';

interface Props {
	species: SpeciesModel;
}

export class SpeciesCard extends Component<Props> {
	render = () => {
		let traits = null;
		if (this.props.species.traits.length > 0) {
			traits = (
				<div>
					<Text type={TextType.MinorHeading}>Traits</Text>
					{this.props.species.traits.map((t, n) => <TextListItemPanel key={n} item={t} />)}
				</div>
			);
		}

		let skills = null;
		if (this.props.species.skills.length > 0) {
			skills = (
				<div>
					<Text type={TextType.MinorHeading}>Skills</Text>
					{this.props.species.skills.map((s, n) => <TextListItemPanel key={n} item={s} />)}
				</div>
			);
		}

		let features = null;
		if (this.props.species.features.length > 0) {
			features = (
				<div>
					<Text type={TextType.MinorHeading}>Features</Text>
					{this.props.species.features.map(f => <FeatureListItemPanel key={f.id} item={f} />)}
				</div>
			);
		}

		let actions = null;
		if (this.props.species.actions.length > 0) {
			actions = (
				<div>
					<Text type={TextType.MinorHeading}>Actions</Text>
					{this.props.species.actions.map(a => <ActionListItemPanel key={a.id} item={a} />)}
				</div>
			);
		}

		return (
			<div className='species-card'>
				<Text type={TextType.SubHeading}>{this.props.species.name}</Text>
				<hr />
				<div className='description'>{this.props.species.description}</div>
				<div className='tags'>
					{this.props.species.type === CombatantType.Monster ? <Tag>Monster</Tag> : null}
					{this.props.species.quirks.map((q, n) => (<Tag key={n}>{q}</Tag>))}
				</div>
				{traits}
				{skills}
				{features}
				{actions}
			</div>
		);
	};
}
