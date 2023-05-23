import { Component, MouseEvent } from 'react';
import { IconCircle, IconCircleCheckFilled } from '@tabler/icons-react';

import './switch.scss';

interface Props {
	label: string;
	checked: boolean;
	onChange: (value: boolean) => void;
}

export class Switch extends Component<Props> {
	onClick = (e: MouseEvent) => {
		e.stopPropagation();
		this.props.onChange(!this.props.checked);
	};

	render = () => {
		try {
			return (
				<div className='switch' onClick={this.onClick}>
					<div className='switch-label'>{this.props.label}</div>
					{this.props.checked ? <IconCircleCheckFilled className='switch-icon checked' /> : <IconCircle className='switch-icon' />}
				</div>
			);
		} catch {
			return <div className='switch render-error' />;
		}
	};
}
