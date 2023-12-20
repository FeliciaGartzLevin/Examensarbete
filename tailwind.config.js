/** @type {import('tailwindcss').Config} */
import Color from 'color';

const lighten = (clr, val) => Color(clr).lighten(val).hex()
// const darken = (clr, val) => Color(clr).darken(val).hex()

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
				button: {
					bg: '#19945D',
				},
				alert: {
					'red': '#EF4444',
					'lighter-red': lighten('red', 0.9),
					'green': '#339900',
					'lighter-green': lighten('green', 1.5),
					'orange': '#ffcc00',
					'lighter-orange': lighten('orange', 0.9),
				}
			},
			fontFamily: {
				primary: ['"Montserrat"', 'sans-serif']
			}
		},
	},
	plugins: [],
}

