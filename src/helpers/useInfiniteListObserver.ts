import { useCallback, useRef } from "react";

export const useInfiniteListObserver = (fetchMore: () => void) => {
	const handleObserver = useRef<IntersectionObserver>();
	const endOfList = useCallback(
		(element: HTMLElement | null) => {
			if (handleObserver.current) handleObserver.current.disconnect();
			handleObserver.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting) {
					fetchMore();
				}
			});
			if (element) handleObserver.current.observe(element);
		},
		[fetchMore],
	);

	return endOfList;
};
