import { Component } from 'react';

import { FeatureType } from '../../../../enums/feature-type';
import { StructureType } from '../../../../enums/structure-type';

import { CombatantLogic } from '../../../../logic/combatant-logic';
import { FeatureLogic } from '../../../../logic/feature-logic';
import { StrongholdLogic } from '../../../../logic/stronghold-logic';

import type { CombatantModel } from '../../../../models/combatant';
import type { FeatureModel } from '../../../../models/feature';
import type { GameModel } from '../../../../models/game';

import { Collections } from '../../../../utils/collections';

import { CardList, Text, TextType } from '../../../controls';
import { ChoicePanel } from './choice/choice';
import { FeatureCard } from '../../../cards';
import { RedrawButton } from '../../../panels';

import './level-up.scss';

interface Props {
	combatant: CombatantModel;
	game: GameModel;
	developer: boolean;
	useCharge: (type: StructureType) => void;
	levelUp: (feature: FeatureModel) => void;
}

interface State {
	features: FeatureModel[];
	selectedFeature: FeatureModel | null;
}

export class LevelUp extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			features: this.drawFeatures(props.combatant),
			selectedFeature: null
		};
	}

	drawFeatures = (combatant: CombatantModel) => {
		const features = CombatantLogic.getFeatureDeck(combatant)
			.filter(feature => {
				// Make sure we can select this feature
				if (feature.type === FeatureType.Proficiency) {
					const profs = CombatantLogic.getProficiencies(combatant);
					if (profs.length >= 9) {
						// We already have all proficiencies
						return false;
					}
					if (profs.includes(feature.proficiency)) {
						// We already have this proficiency
						return false;
					}
				}
				return true;
			});
		return Collections.shuffle(features).splice(0, 3);
	};

	setFeatures = () => {
		this.setState({
			features: this.drawFeatures(this.props.combatant),
			selectedFeature: null
		}, () => {
			if (!this.props.developer) {
				this.props.useCharge(StructureType.TrainingGround);
			}
		});
	};

	setFeature = (feature: FeatureModel) => {
		this.setState({
			selectedFeature: feature
		});
	};

	levelUp = () => {
		const feature = this.state.selectedFeature as FeatureModel;

		this.setState({
			features: this.drawFeatures(this.props.combatant),
			selectedFeature: null
		}, () => {
			this.props.levelUp(feature);
		});
	};

	render = () => {
		try {
			const featureCards = this.state.features.map(feature => {
				return (
					<FeatureCard
						key={feature.id}
						feature={feature}
						footer={CombatantLogic.getFeatureSource(this.props.combatant, feature.id) || 'Feature'}
						footerType={CombatantLogic.getFeatureSourceType(this.props.combatant, feature.id)}
						onClick={f => this.setState({ selectedFeature: f })}
					/>
				);
			});

			const redraws = StrongholdLogic.getStructureCharges(this.props.game, StructureType.TrainingGround);
			if ((redraws > 0) || this.props.developer) {
				featureCards.push(
					<RedrawButton
						key='redraw'
						value={redraws}
						developer={this.props.developer}
						onClick={() => this.setFeatures()}
					/>
				);
			}

			let selected = null;
			if (this.state.selectedFeature) {
				selected = (
					<div className='selected-feature'>
						<FeatureCard feature={this.state.selectedFeature}
							footer={CombatantLogic.getFeatureSource(this.props.combatant, this.state.selectedFeature.id) || 'Feature'}
							footerType={CombatantLogic.getFeatureSourceType(this.props.combatant, this.state.selectedFeature.id)}
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
						<Text type={TextType.Information}>
							<p><b>Level up.</b> Choose a feature for level {this.props.combatant.level + 1}.</p>
						</Text>
						{ this.state.selectedFeature === null ? <CardList cards={featureCards} /> : null }
						{selected}
						{choice}
					</div>
					<div className='footer'>
						<button className='primary' disabled={!canFinish} onClick={this.levelUp}>Level Up</button>
					</div>
				</div>
			);
		} catch {
			return <div className='level-up render-error' />;
		}
	};
}
