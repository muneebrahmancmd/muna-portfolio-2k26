export const desktop = window.innerWidth >= 650;
export const bezier = 'cubic-bezier(0.76, 0.0, 0.24, 1.0)';
export const pageFrames = [
	{ clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)', transform: 'translateY(100%)' },
	{ clipPath: 'polygon(0 0, 100% 0, 100% 105%, 0 105%)', transform: 'translateY(0)' },
];
export const pageOptions = { duration: 1500, fill: 'forwards', easing: bezier };
export const elementOptions = { duration: 800, fill: 'forwards', easing: bezier };
