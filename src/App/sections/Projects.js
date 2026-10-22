import '../css/projects.css';
import Section from '../components/Section';
import { bezier, desktop, pageFrames } from '../utils/constants';
import { appState } from '../utils/state';
import { data, moreProjects } from '../utils/data';

// Size of the virtual browser window each live site is rendered in (then scaled to fit the tile)
const VIEWPORTS = {
	wide: { width: 1280, height: 960 },
	tall: { width: 420, height: 560 },
};

const ZOOM = 1.5;

export default class Projects extends Section {
	constructor(element) {
		super(element);

		this._generateHTML();
		this._generateMore();
		this._initElements();

		this._setupOptions();

		this.animationFinished = false;
		this._setupPreviews();
	}

	_generateHTML() {
		const sectionMap = {
			'projects-top': this.app.dom.projectsTop,
			'projects-middle': this.app.dom.projectsMiddle,
		};

		data.forEach(sectionData => {
			const sectionDiv = sectionMap[sectionData.class];
			const isTopSection = sectionData.class === 'projects-top';

			sectionData.projects.forEach(project => {
				const imageStack = this._createImageStack(project, isTopSection);
				const contentDiv = this._createContent(project);

				const projectDiv = document.createElement('div');
				projectDiv.appendChild(imageStack);
				projectDiv.appendChild(contentDiv);

				sectionDiv.appendChild(projectDiv);
			});
		});
	}

	// A project tile = a live iframe of the site + a link that opens it
	_createImageStack(project, isTopSection) {
		const viewport = VIEWPORTS[project.type];

		const imageStack = document.createElement('div');
		imageStack.classList.add('image-stack', `image-stack__${project.type}`);
		imageStack.dataset.url = project.url;
		imageStack.dataset.vw = viewport.width;
		imageStack.dataset.vh = viewport.height;

		if (isTopSection) {
			imageStack.classList.add('image-animate');
		}

		const preview = document.createElement('div');
		preview.classList.add('images', 'preview');

		if (!isTopSection) {
			preview.classList.add('active');
		}

		const frame = document.createElement('iframe');
		frame.title = `${project.title} (live preview)`;
		frame.tabIndex = -1;
		frame.setAttribute('referrerpolicy', 'no-referrer');
		frame.setAttribute('sandbox', 'allow-scripts allow-same-origin');
		frame.style.width = `${viewport.width}px`;
		frame.style.height = `${viewport.height}px`;
		preview.appendChild(frame);

		const link = document.createElement('a');
		link.classList.add('preview-link');
		link.href = project.url;
		link.target = '_blank';
		link.rel = 'noopener noreferrer';
		link.setAttribute('aria-label', `Open ${project.title}`);

		const live = document.createElement('span');
		live.classList.add('live-tag');
		live.textContent = 'Live';

		imageStack.appendChild(preview);
		imageStack.appendChild(link);
		imageStack.appendChild(live);

		return imageStack;
	}

	_createContent(project) {
		const contentDiv = document.createElement('div');
		contentDiv.classList.add('projects-content', 'projects-text');

		const contentSpan1 = document.createElement('span');
		const contentSpan2 = document.createElement('span');
		contentSpan1.textContent = `(${project.id})`;
		contentSpan2.textContent = project.title;

		const open = document.createElement('a');
		open.classList.add('hover', 'projects-open');
		open.href = project.url;
		open.target = '_blank';
		open.rel = 'noopener noreferrer';
		open.textContent = 'Open ↗';

		contentDiv.appendChild(contentSpan1);
		contentDiv.appendChild(contentSpan2);
		contentDiv.appendChild(open);

		return contentDiv;
	}

	// Other projects: big name + link rows
	_generateMore() {
		const section = this.app.dom.projectsBottom;

		const wrapper = document.createElement('div');
		wrapper.classList.add('more');

		const head = document.createElement('div');
		head.classList.add('more-head', 'projects-text');
		head.innerHTML = '<span>(More)</span><span>Other projects / Name + Link</span>';
		wrapper.appendChild(head);

		const list = document.createElement('ul');
		list.classList.add('more-list');

		moreProjects.forEach(project => {
			const item = document.createElement('li');
			const row = document.createElement('a');
			row.classList.add('more-row');
			row.href = project.url;
			row.target = '_blank';
			row.rel = 'noopener noreferrer';

			const id = document.createElement('span');
			id.classList.add('more-id');
			id.textContent = `(${project.id})`;

			const name = document.createElement('span');
			name.classList.add('more-name');
			name.textContent = project.name;

			const desc = document.createElement('span');
			desc.classList.add('more-desc');
			desc.textContent = project.desc;

			const arrow = document.createElement('span');
			arrow.classList.add('more-arrow');
			arrow.textContent = '↗';

			row.append(id, name, desc, arrow);
			item.appendChild(row);
			list.appendChild(item);
		});

		wrapper.appendChild(list);
		section.appendChild(wrapper);
	}

	_initElements() {
		this.projectsDiv = document.querySelectorAll('.image-animate');
		this.imageStack = document.querySelectorAll('.image-stack');
		this.projectsText = document.querySelectorAll('.projects-text');
	}

	_setupOptions() {
		this.projectsOptions = { duration: 650, fill: 'forwards', easing: bezier };
	}

	_animateDivs() {
		this.projectsDiv.forEach((div, i) => {
			setTimeout(() => {
				div.style.opacity = 1;
				div.animate(pageFrames, this.projectsOptions);
			}, i * 150);
		});
	}

	async _animateImages() {
		const keyframes = [
			{ transform: 'translateY(100%) scale(1.3)' },
			{ transform: 'translateY(30%) scale(1.2)' },
			{ transform: 'translateY(10%) scale(1.1)' },
			{ transform: 'translateY(0) scale(1)' },
		];

		const allAnimations = [];

		this.projectsText.forEach(text => {
			text.style.opacity = 1;
			text.style.transition = 'opacity 600ms 400ms';
		});

		this.projectsDiv.forEach((stack, i) => {
			const imgs = stack.querySelector('.images');

			setTimeout(() => {
				imgs.style.opacity = 1;
				const animation = imgs.animate(keyframes, this.projectsOptions);
				allAnimations.push(animation.finished);
			}, i * 150);
		});

		await Promise.all(allAnimations);
		this.animationFinished = true;
	}

	_setupPreviews() {
		this.imageStack.forEach(stack => {
			this._lazyLoad(stack);
			this._fitFrame(stack);

			if (desktop) this._bindCursorPan(stack);
		});
	}

	// Only load each live site once its tile is close to the screen
	_lazyLoad(stack) {
		const frame = stack.querySelector('iframe');

		const observer = new IntersectionObserver(
			entries => {
				if (!entries.some(entry => entry.isIntersecting)) return;
				frame.src = stack.dataset.url;
				observer.disconnect();
			},
			{ rootMargin: '900px 0px' }
		);

		observer.observe(stack);
	}

	// Scale the virtual browser window to the tile size
	_fitFrame(stack) {
		const frame = stack.querySelector('iframe');
		const viewportWidth = Number(stack.dataset.vw);

		frame.style.transformOrigin = '0 0';

		const state = (stack._pan = { base: 1, zoom: 1, x: 0.5, y: 0.5 });

		const measure = () => {
			state.base = stack.clientWidth / viewportWidth;
			this._applyPan(stack);
		};

		measure();
		new ResizeObserver(measure).observe(stack);
	}

	_applyPan(stack) {
		const frame = stack.querySelector('iframe');
		const { base, zoom, x, y } = stack._pan;
		const offsetX = -(zoom - 1) * stack.clientWidth * x;
		const offsetY = -(zoom - 1) * stack.clientHeight * y;

		frame.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${base * zoom})`;
	}

	// Hover a tile: it zooms in and follows the cursor, so moving the mouse pans across the live site
	_bindCursorPan(stack) {
		const state = stack._pan;
		const target = { zoom: 1, x: 0.5, y: 0.5 };
		let rafId = null;

		const setTarget = e => {
			const rect = stack.getBoundingClientRect();
			target.x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
			target.y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
		};

		const tick = () => {
			state.zoom += (target.zoom - state.zoom) * 0.12;
			state.x += (target.x - state.x) * 0.12;
			state.y += (target.y - state.y) * 0.12;
			this._applyPan(stack);

			const settled =
				Math.abs(target.zoom - state.zoom) < 0.001 &&
				Math.abs(target.x - state.x) < 0.001 &&
				Math.abs(target.y - state.y) < 0.001;

			rafId = settled ? null : requestAnimationFrame(tick);
		};

		const start = () => {
			if (!rafId) rafId = requestAnimationFrame(tick);
		};

		stack.addEventListener('mouseenter', e => {
			if (!this.animationFinished && !appState.contactAnimated) return;
			target.zoom = ZOOM;
			setTarget(e);
			start();
		});

		stack.addEventListener('mousemove', e => {
			if (target.zoom === 1) return;
			setTarget(e);
			start();
		});

		stack.addEventListener('mouseleave', () => {
			target.zoom = 1;
			target.x = 0.5;
			target.y = 0.5;
			start();
		});
	}

	onEnter() {
		this._animateDivs();
		setTimeout(() => this._animateImages(), 600);
	}
}
