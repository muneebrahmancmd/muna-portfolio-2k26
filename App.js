import Lenis from 'lenis';
import { selectors } from './utils/selectors';
import Mouse from './components/Mouse';
import Dates from './components/Dates';
import About from './sections/About';
import Scattered from './sections/Scattered';
import Works from './sections/Works';
import Projects from './sections/Projects';
import Contact from './sections/Contact';
import Navbar from './components/Navbar';
import Loading from './components/Loading';
import Mail from './components/Mail';

let instance = null;

export default class App {
	constructor() {
		if (instance) return instance;
		instance = this;

		this.scroll = new Lenis();
		requestAnimationFrame(time => this._handleScroll(time));

		this.dom = selectors;
		this.mouse = new Mouse();
		this.dates = new Dates();
		this.about = new About(this.dom.about);
		this.scattered = new Scattered(this.dom.scattered);
		this.works = new Works(this.dom.works);
		this.projects = new Projects(this.dom.projectsTop);
		this.contact = new Contact(this.dom.contact);
		this.navbar = new Navbar();
		this.loading = new Loading();
		this.mail = new Mail();

		this._handleRefresh();
	}

	_handleScroll(time) {
		this.scroll.raf(time);
		requestAnimationFrame(time => this._handleScroll(time));
	}

	_handleRefresh() {
		if (window.location.pathname !== '/' || window.location.hash !== '') {
			window.location.href = '/';
		}
	}
}
