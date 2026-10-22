export default class Dates {
	constructor() {
		this.date = document.querySelectorAll('.date');
		this.dateString = document.querySelectorAll('.date-string');
		this.year = new Date().getFullYear();

		this._initDates();
	}

	_initDates() {
		this.date.forEach(date => {
			date.textContent = '©' + this.year;
		});

		this.dateString.forEach(date => {
			date.textContent = String(this.year).slice(-2);
		});
	}
}
