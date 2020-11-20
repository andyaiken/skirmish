import React from 'react';

interface Props {
}

export class Heading extends React.Component<Props> {
	public render() {
		return (
			<div className='skirmish-heading' style={{ textTransform: 'uppercase', letterSpacing: '8px', fontSize: '22px', fontWeight: 600 }}>
				{this.props.children}
			</div>
		);
	}
}
