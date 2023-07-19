import { MouseEvent, useEffect, useRef, useState } from 'react';
import { IconChevronDown } from '@tabler/icons-react';

import './accordion.scss';

interface Props {
	header: string | JSX.Element;
	children: string | JSX.Element | (string | JSX.Element)[];
}

export const Accordion = (props: Props) => {
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

	const openAccordion = () => {
		setOpened(true);
	};

	const closeAccordion = () => {
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
			closeAccordion();
		} else {
			openAccordion();
		}
	};

	const className= `accordion ${opened ? 'accordion-open' : 'accordion-closed'}`;
	return (
		<div className={className} ref={containerRef}>
			<div className='accordion-header' onClick={onClick}>
				{props.header}
				<button className='icon-btn' onClick={onClick}><IconChevronDown /></button>
			</div>
			{opened ? <div className='accordion-content' ref={contentRef}>{props.children}</div> : null}
		</div>
	);
};
