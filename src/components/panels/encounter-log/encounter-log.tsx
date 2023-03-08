import { Component, createRef } from 'react';

import type { EncounterModel } from '../../../models/encounter';

import './encounter-log.scss';

interface Props {
	encounter: EncounterModel;
}

export class EncounterLogPanel extends Component<Props> {

	messagesEndRef = createRef<HTMLDivElement>();

	componentDidMount = () => {
		this.scrollToBottom();
	};

	componentDidUpdate = () => {
		this.scrollToBottom();
	};

	scrollToBottom = () => {
		this.messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	render = () => {
		return (
			<div className='encounter-log'>
				{this.props.encounter.log.map((msg, n) => <div key={n} className='encounter-log-message'>{msg}</div>)}
				<div ref={this.messagesEndRef} />
			</div>
		);
	};
}
