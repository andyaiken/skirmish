import { Component } from 'react';

import './options-page.scss';

interface Props {
	endCampaign: () => void;
}

export class OptionsPage extends Component<Props> {
	public render() {
		return (
			<div className='options-page'>
				<button onClick={() => this.props.endCampaign()}>Abandon This Campaign</button>
			</div>
		);
	}
}
