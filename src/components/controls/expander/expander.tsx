import { MouseEvent, useEffect, useRef, useState } from 'react';

import './expander.scss';

interface Props {
	header: string | JSX.Element;
	content: string | JSX.Element;
}

export const Expander = (props: Props) => {
	const [ opened, setOpened ] = useState<boolean>(false);

	const containerRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!containerRef.current) {
			return;
		}

		const observer = new MutationObserver(onMutation);
		observer.observe(containerRef.current, {
			childList: true,
			subtree: true
		});

		return () => {
			observer.disconnect();
		};
	}, []);

	const onMutation = () => {
		const content = contentRef.current;
		if (!content) {
			return;
		}

		content
			.animate(
				{ maxHeight: `${content.scrollHeight}px`, opacity: 1 },
				{ duration: 200, easing: 'ease-in', fill: 'forwards' }
			);
	};

	const openExpander = () => {
		setOpened(true);
	};

	const closeExpander = () => {
		const content = contentRef.current;
		if (!content) {
			return;
		}

		content
			.animate(
				{ maxHeight: 0, opacity: 0 },
				{ duration: 200, easing: 'ease-out' }
			)
			.finished.then(() => {
				content.style.display = 'none';
				setOpened(false);
			});
	};

	const onClick = (e: MouseEvent) => {
		e.stopPropagation();

		if (opened) {
			closeExpander();
		} else {
			openExpander();
		}
	};

	return (
		<div className='expander' ref={containerRef} onClick={onClick}>
			<div className='expander-header'>
				{props.header}
			</div>
			{opened ? <div className='expander-content' ref={contentRef}>{props.content}</div> : null}
		</div>
	);
};
