import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { KeyboardEvent, PointerEvent, ReactNode, useRef, useState } from 'react';

import './carousel.scss';

interface Props {
	slides: ReactNode[];
}

// How far a swipe has to travel, in pixels, before it changes the slide
const SWIPE_THRESHOLD = 40;

export const Carousel = (props: Props) => {
	const [ index, setIndex ] = useState<number>(0);

	const swipeStart = useRef<number | null>(null);

	const count = props.slides.length;

	const goTo = (n: number) => {
		setIndex(Math.max(0, Math.min(n, count - 1)));
	};

	const onKeyDown = (e: KeyboardEvent) => {
		switch (e.key) {
			case 'ArrowLeft':
				goTo(index - 1);
				break;
			case 'ArrowRight':
				goTo(index + 1);
				break;
		}
	};

	const onPointerDown = (e: PointerEvent) => {
		swipeStart.current = e.clientX;
	};

	const onPointerUp = (e: PointerEvent) => {
		if (swipeStart.current === null) {
			return;
		}

		const delta = e.clientX - swipeStart.current;
		swipeStart.current = null;

		if (delta <= -SWIPE_THRESHOLD) {
			goTo(index + 1);
		} else if (delta >= SWIPE_THRESHOLD) {
			goTo(index - 1);
		}
	};

	return (
		<div className='carousel' tabIndex={0} onKeyDown={onKeyDown}>
			<div
				className='carousel-viewport'
				onPointerDown={onPointerDown}
				onPointerUp={onPointerUp}
				onPointerCancel={() => swipeStart.current = null}
			>
				{/* Every slide stays in the track, so the carousel is as tall as its tallest slide and doesn't jump as it moves */}
				<div className='carousel-track' style={{ transform: `translateX(-${index * 100}%)` }}>
					{
						props.slides.map((slide, n) => (
							<div key={n} className='carousel-slide' aria-hidden={n !== index}>
								{slide}
							</div>
						))
					}
				</div>
			</div>
			{
				count > 1 ?
					<div className='carousel-controls'>
						<button className='carousel-arrow' title='Previous' disabled={index === 0} onClick={() => goTo(index - 1)}>
							<IconChevronLeft />
						</button>
						<div className='carousel-dots'>
							{
								props.slides.map((_, n) => (
									<button
										key={n}
										className={n === index ? 'carousel-dot selected' : 'carousel-dot'}
										title={`${n + 1} of ${count}`}
										onClick={() => goTo(n)}
									/>
								))
							}
						</div>
						<button className='carousel-arrow' title='Next' disabled={index === count - 1} onClick={() => goTo(index + 1)}>
							<IconChevronRight />
						</button>
					</div>
					: null
			}
		</div>
	);
};
