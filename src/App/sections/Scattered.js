import '../css/scattered.css';
import Section from '../components/Section';

export default class Scattered extends Section {
	constructor(element) {
		super(element);

		this._initElements();

		this._setupOptions();

		this._bindMouseEvents();
	}

	_initElements() {
		this.images = this.element.querySelectorAll('.scattered-images img');
	}

	_setupOptions() {
		this.tiltOptions = { duration: 300, fill: 'forwards', easing: 'ease-out' };
		this.resetOptions = { duration: 500, fill: 'forwards', easing: 'ease-out' };
		this.resetFrames = { transform: 'none' };
	}

	_bindMouseEvents() {
		this.images.forEach(image => {
			const handleMove = e => this._handleTilt(e);
			const handleLeave = () => {
				image.removeEventListener('mousemove', handleMove);
				setTimeout(() => this._handleReset(image), 200);
			};

			image.addEventListener('mouseenter', () => {
				image.addEventListener('mousemove', handleMove);
			});

			image.addEventListener('mouseleave', handleLeave);
		});
	}

	_handleTilt(e) {
		const image = e.currentTarget;
		const rect = image.getBoundingClientRect();
		const offsetX = e.clientX - rect.left - rect.width / 2;
		const offsetY = e.clientY - rect.top - rect.height / 2;

		const perspective = 1000;
		const tiltX = -(offsetY / 5);
		const tiltY = offsetX / 5;

		const keyframes = {
			transform: `
				perspective(${perspective}px)
				rotateX(${tiltX}deg)
				rotateY(${tiltY}deg)
			`,
		};

		image.animate(keyframes, this.tiltOptions);
	}

	_handleReset(image) {
		image.animate(this.resetFrames, this.resetOptions);
	}
}
