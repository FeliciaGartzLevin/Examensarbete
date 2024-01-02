import { useEffect, useState } from 'react'

export const useWindowSize = () => {
	const [windowWidth, setWindowWidth] = useState<number | null>()
	const [windowSizeisLoading, setWindowSizeIsLoading] = useState(true)

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth)
			setWindowSizeIsLoading(false)
		}

		// Initial setup
		handleResize()

		// Add event listener for window resize
		window.addEventListener('resize', handleResize)

		// Cleanup on unmount
		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])

	return {
		windowWidth,
		windowSizeisLoading,
	}
}
