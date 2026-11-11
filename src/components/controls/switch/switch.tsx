import { IconCircle, IconCircleCheckFilled } from '@tabler/icons-react';
import { MouseEvent } from 'react';

import { Keyboard } from '../../../utils/keyboard/keyboard';

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

	return (
		<div className='switch' {...Keyboard.clickable(true, 'switch')} aria-checked={props.checked} onClick={onClick}>
			<div className='switch-label'>{props.label}</div>
			{props.checked ? <IconCircleCheckFilled className='switch-icon checked' /> : <IconCircle className='switch-icon' />}
		</div>
	);
};
