import { Component } from 'react';

import { CardType } from '../../../../enums/card-type';

import { CombatantLogic } from '../../../../logic/combatant-logic';
import { FeatureLogic } from '../../../../logic/feature-logic';

import type { CombatantModel } from '../../../../models/combatant';
import type { FeatureModel } from '../../../../models/feature';

import { CardList, PlayingCard, Text, TextType } from '../../../controls';
import { ChoicePanel } from './choice/choice';
import { FeatureCard } from '../../../cards';

import './level-up.scss';

interface Props {
	combatant: CombatantModel;
	features: FeatureModel[];
	levelUp: (feature: FeatureModel) => void;
}

interface State {
	selectedFeature: FeatureModel | null;
}

export class LevelUp extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			selectedFeature: null
		};
	}

	setFeature = (feature: FeatureModel) => {
		this.setState({
			selectedFeature: feature
		});
	};

	levelUp = () => {
		const feature = this.state.selectedFeature as FeatureModel;

		this.setState({
			selectedFeature: null
		}, () => {
			this.props.levelUp(feature);
		});
	};

	render = () => {
		try {
			const featureCards = this.props.features.map(feature => {
				return (
					<div key={feature.id}>
						<PlayingCard
							type={CardType.Feature}
							front={<FeatureCard feature={feature} />}
							footer={CombatantLogic.getActionSource(this.props.combatant, feature.id) || 'Feature'}
							footerType={CombatantLogic.getActionSourceType(this.props.combatant, feature.id)}
							onClick={() => this.setState({ selectedFeature: feature })}
						/>
					</div>
				);
			});

			let selected = null;
			if (this.state.selectedFeature) {
				selected = (
					<div className='selected-feature'>
						<PlayingCard
							type={CardType.Feature}
							front={<FeatureCard feature={this.state.selectedFeature} />}
							footer={CombatantLogic.getActionSource(this.props.combatant, this.state.selectedFeature.id) || 'Feature'}
							footerType={CombatantLogic.getActionSourceType(this.props.combatant, this.state.selectedFeature.id)}
						/>
					</div>
				);
			}

			let choice = null;
			let canFinish = false;
			if (this.state.selectedFeature !== null) {
				choice = FeatureLogic.hasChoice(this.state.selectedFeature) ? <ChoicePanel feature={this.state.selectedFeature} hero={this.props.combatant} onChange={this.setFeature} /> : null;
				canFinish = !FeatureLogic.hasChoice(this.state.selectedFeature);
			}

			return (
				<div className='level-up'>
					<div className='content'>
						<Text type={TextType.Information}><b>Level up.</b> Choose a feature for level {this.props.combatant.level + 1}</Text>
						{ this.state.selectedFeature === null ? <CardList cards={featureCards} /> : null }
						{selected}
						{choice}
					</div>
					<div className='footer'>
						<button disabled={!canFinish} onClick={this.levelUp}>Level Up</button>
					</div>
				</div>
			);
		} catch {
			return <div className='level-up render-error' />;
		}
	};
}
