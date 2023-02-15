import { Component, MouseEvent } from 'react';

import './dialog.scss';

interface Props {
	content: JSX.Element;
	onClickOff: (() => void) | null;
}

export class Dialog extends Component<Props> {
	public static defaultProps = {
		onClickOff: null
	};

	backdropClick = () => {
		if (this.props.onClickOff) {
			this.props.onClickOff();
		}
	};

	dialogClick = (e: MouseEvent) => {
		e.stopPropagation();
	};

	public render = () => {
		return (
			<div className='dialog-backdrop' onClick={this.backdropClick}>
				<div className='dialog' onClick={this.dialogClick}>
					<div className='dialog-content'>
						{this.props.content}
					</div>
				</div>
			</div>
		);
	};
}
