import App from '../App.js';
import { desktop } from '../utils/constants.js';

export default class Section {
	constructor(element, options = { rootMargin: '0px', threshold: 0.3 }) {
		this.element = element;
		this.options = { ...options };

		this._setupApp();

		this.isAnimating = false;
		this._initObserver();
	}

	_setupApp() {
		this.app = new App();
		this.scroll = this.app.scroll;
	}

	_initObserver() {
		this.observer = new IntersectionObserver(
			entries => this._handleIntersect(entries),
			this.options
		);
		this.observer.observe(this.element);
	}

	_handleIntersect(entries) {
		const [entry] = entries;

		if (entry.isIntersecting) {
			this._lockScroll();

			if (!this.isAnimating) {
				this.isAnimating = true;
				this.onEnter();
			}
		}
	}

	_lockScroll() {
		if (!desktop) return;
		this.scroll.scrollTo(this.element, { lock: true, force: true });
	}

	// Animate function per section
	onEnter() {}
}
