/** @type {import('tailwindcss').Config} */
import Color from 'color';

const primaryColors = {
	'neutral': '#968BAF',
}

const lighten = (clr, val) => Color(clr).lighten(val).hex()
// const darken = (clr, val) => Color(clr).darken(val).hex()

export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			backgroundImage: {
				'neutral-dinner': "url('/src/assets/img/neutral-dinner.jpg')",
			},
			colors: {
				'primary-text': '#0F172A',
				'light-background': '#FAF9F2',
				'dark-background': '#253C33',
				'link-hover': '#188C57',
				button: {
					'green': '#19945D',
					'green-hover': '#188C57',
					'red': '#990B00',
					'red-hover': '#660700',
					'neutral': primaryColors.neutral,
					'neutral-soft': lighten(primaryColors.neutral, 0.4),
					'neutral-lighter': lighten(primaryColors.neutral, 0.5),
					'neutral-hover': '#7A74A4',
				},
				alert: {
					'red': '#EF4444',
					'lighter-red': lighten('red', 0.9),
					'green': '#339900',
					'lighter-green': lighten('green', 2.5),
					'orange': '#F08F0E',
					'lighter-orange': lighten('orange', 0.9),
				},
			},
			fontFamily: {
				primary: ['"Montserrat"', 'sans-serif']
			},
			gridTemplateRows: {
				'app': '4.5rem 1fr'
			},
		},
	},
	plugins: [],
}

