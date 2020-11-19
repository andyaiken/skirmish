import { Col, Row } from 'antd';
import React from 'react';

interface Props {
	label: number | string | JSX.Element;
	value: number | string | JSX.Element;
}

export class StatValue extends React.Component<Props> {
	public render() {
		return (
			<Row gutter={10} align='middle'>
				<Col span={12} style={{ textAlign: 'left' }}>
					{this.props.label}
				</Col>
				<Col span={12} style={{ textAlign: 'right' }}>
					{this.props.value}
				</Col>
			</Row>
		);
	}
}
