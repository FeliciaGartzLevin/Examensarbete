import { useEffect, RefObject } from 'react';


export const useCloseOnClickOutside = (ref: RefObject<HTMLElement>, close: () => void) => {

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				close();
			}
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [ref, close]);

};
