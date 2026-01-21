import { ReactNode } from 'react';

import './tag.scss';

interface Props {
	children: ReactNode;
}

export const Tag = (props: Props) => {
	try {
		return (
			<div className='tag'>
				{props.children}
			</div>
		);
	} catch {
		return <div className='tag render-error' />;
	}
};
