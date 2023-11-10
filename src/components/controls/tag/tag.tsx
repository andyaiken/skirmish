import './tag.scss';

interface Props {
	children: (JSX.Element | number | string | null)[] | JSX.Element | number | string | null;
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
