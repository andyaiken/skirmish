import React from 'react';

interface Props {
	scrollable: boolean;
}

export class Fill extends React.Component<Props> {
	public static defaultProps = {
		scrollable: false
	};

	public render() {
		return (
			<div style={{ width: '100%', height: '100%', overflowY: (this.props.scrollable ? 'auto' : 'hidden') }}>
				{this.props.children}
			</div>
		);
	}
}
