import { Component } from 'react';
import ReactMarkdown from 'react-markdown';

import { Text, TextType } from '../../../controls';

import './rules-tab.scss';

interface Props {
	rules: string;
}

export class RulesTab extends Component<Props> {
	render = () => {
		try {
			return (
				<div className='rules-tab'>
					{
						this.props.rules ?
							<ReactMarkdown>{this.props.rules}</ReactMarkdown>
							:
							<Text type={TextType.Information}>
								<p>No rules for this page.</p>
							</Text>
					}
				</div>
			);
		} catch {
			return <div className='rules-tab render-error' />;
		}
	};
}
