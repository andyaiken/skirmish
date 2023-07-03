import { Component } from 'react';
import ReactMarkdown from 'react-markdown';

import './rules-tab.scss';

interface Props {
	rules: string;
}

export class RulesTab extends Component<Props> {
	render = () => {
		try {
			return (
				<div className='rules-tab'>
					<ReactMarkdown>{this.props.rules}</ReactMarkdown>
				</div>
			);
		} catch {
			return <div className='rules-tab render-error' />;
		}
	};
}
