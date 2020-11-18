import React from 'react';

interface Props {
}

export class Heading extends React.Component<Props> {
	public render() {
		return (
			<div className='skirmish-heading'>
				{this.props.children}
			</div>
		);
	}
}
