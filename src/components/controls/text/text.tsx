import { Component } from 'react';
import { IconInfoCircle } from '@tabler/icons-react';

import './text.scss';

export enum TextType {
	Default = 'default',
	Dimmed = 'dimmed',
	Heading = 'heading',
	SubHeading = 'subheading',
	MinorHeading = 'minorheading',
	ListItem = 'listitem',
	Information = 'information',
	Tip = 'tip',
	Small = 'small',
	Empty = 'empty'
}

interface Props {
	type: TextType;
	children: (JSX.Element | number | string | null)[] | JSX.Element | number | string | null;
}

export class Text extends Component<Props> {
	static defaultProps = {
		type: TextType.Default
	};

	render = () => {
		try {
			let icon = null;
			switch (this.props.type) {
				case TextType.Tip:
					icon = (
						<div className='skirmish-text-icon'>
							<IconInfoCircle />
						</div>
					);
					break;
			}

			return (
				<div className={`skirmish-text ${this.props.type}`}>
					{icon}
					<div className={`skirmish-text-content ${this.props.type}`}>
						{this.props.children}
					</div>
				</div>
			);
		} catch {
			return <div className='skirmish-text render-error' />;
		}
	};
}
