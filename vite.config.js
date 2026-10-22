import { resolve } from 'path';
import handlebars from 'vite-plugin-handlebars';

export default {
	root: 'src/',
	publicDir: '../static/',
	base: './',
	server: {
		open: true,
	},
	build: {
		outDir: '../dist',
		emptyOutDir: true,
		sourcemap: true,
	},
	plugins: [
		handlebars({
			partialDirectory: resolve(__dirname, 'src/App/partials'),
		}),
	],
};
