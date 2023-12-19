import { Component } from 'react';

import { OptionsModel } from '../../../../models/options';

import { Platform } from '../../../../platform/platform';

import { CardGridPanel } from '../../../panels';

import './dev-page.scss';

interface Props {
	options: OptionsModel;
	platform: Platform;
}

export class DevPage extends Component<Props> {
	render = () => {
		try {
			const content = <CardGridPanel options={this.props.options} platform={this.props.platform} />;
			return (
				<div className='dev-page'>
					{content}
				</div>
			);
		} catch {
			return <div className='dev-page render-error' />;
		}
	};
}
