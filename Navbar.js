import '../css/header.css';
import App from '../App';
import { desktop } from '../utils/constants';

export default class Navbar {
	constructor() {
		this._initElements();

		this._setupApp();
		this._setupEasings();

		this._hideCloseButton();
		this._bindEvents();
		this._bindNavLinks();

		this.lastScrollTop = 0;
		this.scroll.on('scroll', lenis => this._handleScroll(lenis));
	}

	_initElements() {
		this.navbar = document.querySelector('.nav');
		this.burger = this.navbar.querySelector('.burger');
		this.openButton = this.navbar.querySelector('.open');
		this.closeButton = this.navbar.querySelector('.close');
		this.navList = this.navbar.querySelector('.nav .ul');
		this.navLinks = this.navbar.querySelectorAll('span a');
	}

	_setupApp() {
		this.app = new App();
		this.about = this.app.about;
		this.works = this.app.works;
		this.contact = this.app.contact;
		this.scroll = this.app.scroll;
	}

	_setupEasings() {
		this.scrollUpStyle = { transform: 'translateY(0)', opacity: 1 };
		this.scrollDownStyle = { transform: 'translateY(-100%)', opacity: 0 };
		this.animationOptions = { duration: 500, easing: 'ease-in-out', fill: 'forwards' };
	}

	_hideCloseButton() {
		this.closeButton.style.display = 'none';
	}

	_bindEvents() {
		this.burger.addEventListener('click', () => {
			const isActive = this.navList.classList.toggle('active');
			this._setActiveState(isActive);
		});
	}

	_bindNavLinks() {
		this.navLinks.forEach(link => {
			link.addEventListener('click', e => {
				const id = e.target.getAttribute('href');
				const target = document.querySelector(id);
				if (!target) return;

				if (!desktop) {
					this.navList.classList.remove('active');
					this._setActiveState(false);
				}

				if (target.classList.contains('about')) this.about.onEnter();
				if (target.classList.contains('works')) this.works.onEnter();
				if (target.classList.contains('contact')) this.contact.onEnter();
			});
		});
	}

	_setActiveState(isActive) {
		this.navbar.classList.toggle('active', isActive);
		this.openButton.style.display = isActive ? 'none' : 'block';
		this.closeButton.style.display = isActive ? 'block' : 'none';
	}

	_handleScroll(lenis) {
		const scrollY = lenis.scroll;
		const animation = scrollY > this.lastScrollTop ? this.scrollDownStyle : this.scrollUpStyle;
		this.navbar.animate(animation, this.animationOptions);
		this.lastScrollTop = Math.max(scrollY, 0);
	}
}
