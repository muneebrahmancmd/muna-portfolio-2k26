import '../css/contact.css';
import Section from '../components/Section';
import { desktop, elementOptions, pageFrames } from '../utils/constants';
import { setContactAnimated } from '../utils/state';

export default class Contact extends Section {
	constructor(element) {
		super(element);

		this._initElements();

		this.mouse = this.app.mouse.mouse;
		this.scroll = this.app.scroll;
		this.about = this.app.about;

		this._bindBackButton();
		this._bindMouseEnter();
	}

	_initElements() {
		this.header = this.element.querySelectorAll('.contact-header');
		this.mobile = this.element.querySelectorAll('.contact-mobile');
		this.socials = this.element.querySelector('.contact-socials');
		this.image = this.element.querySelector('.contact-image');
		this.back = this.element.querySelector('.back-top');
	}

	_bindBackButton() {
		this.back.addEventListener('click', () => {
			this.scroll.scrollTo(0, { immediate: true });
			this.about.onEnter();
		});
	}

	_bindMouseEnter() {
		this.element.addEventListener('mouseenter', () => {
			this.mouse.style.background = 'var(--white)';
		});

		this.element.addEventListener('mouseleave', () => {
			this.mouse.style.background = 'var(--orange)';
		});
	}

	_setInitialState() {
		this.header.forEach(header => (header.style.opacity = 0));
		this.mobile.forEach(contact => (contact.style.opacity = 0));
		this.socials.style.opacity = 0;
		this.image.style.opacity = 0;
	}

	_animateSmallText() {
		const keyframes = [{ opacity: 0 }, { opacity: 0 }, { opacity: 1 }];
		this.socials.animate(keyframes, { fill: 'forwards', duration: 1600 });
	}

	_animateImage() {
		const imgContainer = document.querySelector('.contact-image-bg');
		imgContainer.style.opacity = 1;
		imgContainer.animate(pageFrames, elementOptions);
	}

	_animateHeader() {
		const keyframes = [
			{ clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)', transform: 'translateY(120px)' },
			{ clipPath: 'polygon(0 0, 100% 0, 100% 120%, 0 120%)', transform: 'translateY(0)' },
		];

		const headers = desktop ? this.header : this.mobile;

		headers.forEach((header, i) => {
			header.style.opacity = 0;
			setTimeout(() => {
				header.style.opacity = 1;
				header.animate(keyframes, elementOptions);
			}, i * 100);
		});
	}

	_exitAnimation() {
		const keyframes = [
			{ transform: 'translateY(100%)' },
			{ transform: 'translateY(0) scale(1.3)' },
			{ transform: 'translateY(0) scale(1)' },
		];

		const options = { duration: 1000, easing: 'ease-out', fill: 'forwards' };

		this.image.style.opacity = 1;
		this.image.animate(keyframes, options);
	}

	onEnter() {
		this.image.style.opacity = 0;
		this._setInitialState();

		this._animateSmallText();
		this._animateImage();
		this._animateHeader();

		setTimeout(() => this._exitAnimation(), 600);

		// Keep track of contact animation in case user reverse scrolls
		setContactAnimated(true);
	}
}
