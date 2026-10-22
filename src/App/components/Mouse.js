export default class Mouse {
	constructor() {
		this.mouse = document.querySelector('.mouse');
		this.options = { duration: 800, fill: 'forwards' };

		window.addEventListener('mousemove', e => this._handleMouseMove(e));
	}

	_handleMouseMove(e) {
		const x = e.clientX - this.mouse.offsetWidth / 2;
		const y = e.clientY - this.mouse.offsetHeight / 2;

		this.mouse.animate({ transform: `translate(${x}px, ${y}px)` }, this.options);
	}
}
