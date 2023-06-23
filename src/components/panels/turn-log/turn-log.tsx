import { Component, createRef } from 'react';

import type { EncounterModel } from '../../../models/encounter';

import './turn-log.scss';

interface Props {
	encounter: EncounterModel;
}

export class TurnLogPanel extends Component<Props> {

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
		try {
			if (this.props.encounter.log.length === 0) {
				return null;
			}

			return (
				<div className='turn-log'>
					{this.props.encounter.log.map((msg, n) => <div key={n} className='turn-log-message'>{msg}</div>)}
					<div ref={this.messagesEndRef} />
				</div>
			);
		} catch {
			return <div className='turn-log render-error' />;
		}
	};
}
