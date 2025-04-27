import { useEffect, useRef } from "react";

// https://stackoverflow.com/a/77290679
export function useHorizontalScroll<T extends HTMLElement>() {
    const element = useRef<T>(null);

    useEffect(() => {
        const el = element.current;
        if (el) {
            const onWheel = (e: WheelEvent) => {
                if (e.deltaY === 0) {
                    return;
                }
                e.preventDefault();
                el.scrollTo({
                    left: el.scrollLeft + e.deltaY,
                    behavior: "auto"
                });
            }
            el.addEventListener("wheel", onWheel);
            return () => el.removeEventListener("wheel", onWheel);
        }
    }, []);

    return element;
}
