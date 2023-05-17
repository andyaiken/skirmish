import { Component } from 'react';

import { CombatantType } from '../../../enums/combatant-type';

import { ActionLogic } from '../../../logic/action-logic';
import { FeatureLogic } from '../../../logic/feature-logic';

import type { SpeciesModel } from '../../../models/species';

import { ListItemPanel } from '../../panels';

import { Tag, Text, TextType } from '../../controls';

import './species-card.scss';

interface Props {
	species: SpeciesModel;
}

export class SpeciesCard extends Component<Props> {
	render = () => {
		const tags: JSX.Element[] = [];
		if (this.props.species.type === CombatantType.Monster) {
			tags.push(<Tag key='monster'>Monster</Tag>);
		}
		this.props.species.quirks.forEach((q, n) => tags.push(<Tag key={n}>{q}</Tag>));

		let traits = null;
		if (this.props.species.traits.length > 0) {
			traits = (
				<div>
					<Text type={TextType.MinorHeading}>Traits</Text>
					{this.props.species.traits.map((t, n) => <ListItemPanel key={n} item={t} />)}
				</div>
			);
		}

		let skills = null;
		if (this.props.species.skills.length > 0) {
			skills = (
				<div>
					<Text type={TextType.MinorHeading}>Skills</Text>
					{this.props.species.skills.map((s, n) => <ListItemPanel key={n} item={s} />)}
				</div>
			);
		}

		let features = null;
		if (this.props.species.features.length > 0) {
			features = (
				<div>
					<Text type={TextType.MinorHeading}>Features</Text>
					{this.props.species.features.map(f => <ListItemPanel key={f.id} item={FeatureLogic.getFeatureDescription(f)} />)}
				</div>
			);
		}

		let actions = null;
		if (this.props.species.actions.length > 0) {
			actions = (
				<div>
					<Text type={TextType.MinorHeading}>Actions</Text>
					{this.props.species.actions.map(a => <ListItemPanel key={a.id} item={ActionLogic.getActionDescription(a)} />)}
				</div>
			);
		}

		return (
			<div className='species-card'>
				<Text type={TextType.SubHeading}>{this.props.species.name}</Text>
				<hr />
				<div className='description'>{this.props.species.description}</div>
				{ tags.length > 0 ? <div className='tags'>{tags}</div> : null }
				<hr />
				{traits}
				{skills}
				{features}
				{actions}
			</div>
		);
	};
}
