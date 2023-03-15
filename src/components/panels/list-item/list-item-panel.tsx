import { Component } from 'react';

import { ActionLogic } from '../../../logic/action-logic';
import { FeatureLogic } from '../../../logic/feature-logic';

import { ActionModel } from '../../../models/action';
import { FeatureModel } from '../../../models/feature';

import './list-item-panel.scss';

interface FeatureProps {
	item: FeatureModel;
}

export class FeatureListItemPanel extends Component<FeatureProps> {
	render = () => {
		return (
			<div className='list-item-panel feature'>
				{FeatureLogic.getFeatureDescription(this.props.item)}
			</div>
		);
	};
}

interface ActionProps {
	item: ActionModel;
}

export class ActionListItemPanel extends Component<ActionProps> {
	render = () => {
		return (
			<div className='list-item-panel action'>
				{ActionLogic.getActionDescription(this.props.item)}
			</div>
		);
	};
}

interface TextProps {
	item: string;
}

export class TextListItemPanel extends Component<TextProps> {
	render = () => {
		return (
			<div className='list-item-panel text'>
				{this.props.item}
			</div>
		);
	};
}
