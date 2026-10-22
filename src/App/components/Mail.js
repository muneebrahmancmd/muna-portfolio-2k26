export default class Mail {
	constructor() {
		this.white = document.querySelectorAll('.white');
		this.link = document.querySelector('.contact-link');

		this.white.forEach(el => el.addEventListener('click', () => this._handleRedirect()));
		this.link.addEventListener('click', () => this._handleRedirect());
	}

	_handleRedirect() {
		window.location.href = 'mailto:muneebrahman500@gmail.com';
	}
}
