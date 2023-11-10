import { IconCircle, IconCircleCheckFilled } from '@tabler/icons-react';
import { MouseEvent } from 'react';

import './switch.scss';

interface Props {
	label: string;
	checked: boolean;
	onChange: (value: boolean) => void;
}

export const Switch = (props: Props) => {
	const onClick = (e: MouseEvent) => {
		e.stopPropagation();
		props.onChange(!props.checked);
	};

	try {
		return (
			<div className='switch' onClick={onClick}>
				<div className='switch-label'>{props.label}</div>
				{props.checked ? <IconCircleCheckFilled className='switch-icon checked' /> : <IconCircle className='switch-icon' />}
			</div>
		);
	} catch {
		return <div className='switch render-error' />;
	}
};
