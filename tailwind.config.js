/** @type {import('tailwindcss').Config} */

export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				'primary-text': '#0F172A',
				'light-background': '#FAF9F2',
				'dark-background': '#253C33',
				'link-hover': '#188C57',
				'button-bg': '#19945D',
				'red-alert': 'rgb(239 68 68)'
			},
			fontFamily: {
				primary: ['"Montserrat"', 'sans-serif']
			}
		},
	},
	plugins: [],
}

