import '../css/loading.css';
import App from '../App';
import { pageOptions } from '../utils/constants';

export default class Loading {
	constructor() {
		this._initElements();

		this._setupApp();

		this.duration = 2150;
		this.delay = 1400;
		this.startTime = null;

		this._initSelectors();

		document.addEventListener('DOMContentLoaded', () => {
			this._displayBody();
			this._updateProgress();
		});
	}

	_initElements() {
		this.loading = document.querySelector('.loading');
		this.countdown = this.loading.querySelector('.countdown');
	}

	_setupApp() {
		this.app = new App();
		this.selectors = this.app.dom;
		this.navbar = this.app.navbar.navbar;
	}

	_initSelectors() {
		const { about, works, scattered, projectsTop, projectsMiddle, projectsBottom, contact } =
			this.selectors;

		this.about = about;
		this.works = works;
		this.scattered = scattered;
		this.projectsTop = projectsTop;
		this.projectsMiddle = projectsMiddle;
		this.projectsBottom = projectsBottom;
		this.contact = contact;

		this.visibleElements = [works, scattered, contact, projectsTop, projectsMiddle, projectsBottom];
	}

	_displayBody() {
		document.body.classList.add('loaded');
	}

	_removeLoader() {
		this.loading.remove();
	}

	_displaySections() {
		this.visibleElements.forEach(el => (el.style.display = 'grid'));
	}

	_displayNavbar() {
		this.navbar.style.visibility = 'initial';
		this.navbar.style.opacity = 1;
		this.navbar.style.transition = 'opacity 600ms ease-in-out';
	}

	_ready() {
		this._removeLoader();
		this._displaySections();
		this._displayNavbar();
	}

	// https://easings.net/#easeOutCubic
	_easeOutCubic(x) {
		return 1 - Math.pow(1 - x, 3);
	}

	_updateProgress() {
		const now = performance.now();
		if (!this.startTime) this.startTime = now;

		const elapsed = now - this.startTime;
		const t = Math.min(1, elapsed / this.duration);
		const eased = this._easeOutCubic(t);

		this.countdown.textContent = `${Math.round(eased * 100)}%`;

		if (elapsed < this.duration) {
			requestAnimationFrame(() => this._updateProgress());
		} else {
			this.about.animate({ transform: 'translateY(0)' }, pageOptions);
			setTimeout(() => this._ready(), this.delay);
		}
	}
}
