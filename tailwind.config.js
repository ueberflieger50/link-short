module.exports = {
	mode: 'jit',
	purge: [
		'./components/**/*.{vue,js}',
		'./layouts/**/*.vue',
		'./pages/**/*.vue',
		'./plugins/**/*.{js,ts}',
		'./nuxt.config.{js,ts}',
	],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			colors: {
				nuxt: {
					light: '#7EEDC3',
					DEFAULT: '#00F397',
					dark: '#00DA89',
				},
			},
		},
	},
	variants: {
		extend: {
			textColor: ['active'],
		},
	},
	plugins: [],
	// darkMode: 'media',
};
