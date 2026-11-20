import { useEffect, useRef } from 'react';

export default function useMotionDismiss(onDismiss) {
    const elementRef = useRef(null);
    const closing = useRef(false);

    useEffect(() => () => {
        closing.current = false;
    }, []);

    async function dismiss() {
        if (closing.current) return;
        const element = elementRef.current;
        if (!element || matchMedia('(prefers-reduced-motion: reduce)').matches) {
            onDismiss();
            return;
        }

        closing.current = true;
        element.dataset.closing = 'true';
        const animations = element.getAnimations({ subtree: true }).filter(
            animation => ['cmp-dialog-out', 'cmp-overlay-out'].includes(animation.animationName),
        );
        await Promise.allSettled(animations.map(animation => animation.finished));
        if (closing.current && element.isConnected) onDismiss();
    }

    return [elementRef, dismiss];
}
