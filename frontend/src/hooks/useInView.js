import { useEffect, useRef, useState } from "react";

/**
 * useInView — fires every time the element enters/leaves the viewport.
 * @param {number} threshold  0–1, fraction of element visible before trigger (default 0.15)
 * @param {string} rootMargin CSS margin around root (default "0px")
 * @returns {[React.RefObject, boolean]}
 */
export function useInView(threshold = 0.15, rootMargin = "0px", once = false) {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el || typeof IntersectionObserver === 'undefined') return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (once) {
                        observer.unobserve(el);
                    }
                } else if (!once) {
                    setIsVisible(false);
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold, rootMargin, once]);

    return [ref, isVisible];
}

/**
 * useCountUp — animates a number from 0 to `target` over `duration` ms
 * once `trigger` becomes true.
 */
export function useCountUp(target, duration = 3200, trigger = true) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!trigger) {
            setCount(0);
            return;
        }
        let start = null;
        let animId;
        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) {
                animId = requestAnimationFrame(step);
            } else {
                setCount(target);
            }
        };
        animId = requestAnimationFrame(step);
        return () => cancelAnimationFrame(animId);
    }, [target, duration, trigger]);

    return count;
}
