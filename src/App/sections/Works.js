import '../css/works.css';
import Section from '../components/Section';
import { elementOptions, pageFrames } from '../utils/constants';

export default class Works extends Section {
	constructor(element) {
		super(element);

		this._initElements();
	}

	_initElements() {
		this.letters = this.element.querySelectorAll('.works-letters');
	}

	_setInitialState() {
		this.letters.forEach(letter => (letter.style.opacity = 0));
	}

	_animateLetters() {
		this.letters.forEach((letter, index) => {
			setTimeout(() => {
				letter.style.opacity = 1;
				letter.animate(pageFrames, elementOptions);
			}, index * 20);
		});
	}

	onEnter() {
		this._setInitialState();
		this._animateLetters();
	}
}
