'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';

declare global {
    interface Window {
        __lenis?: Lenis;
    }
}

// Scrolls to a selector or element, using Lenis when it is running so the motion stays continuous.
export function scrollToTarget(target: string | HTMLElement) {
    const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
    if (!el) return false;
    const lenis = window.__lenis;
    if (lenis) {
        lenis.scrollTo(el, { offset: -72, duration: 1.1 });
    } else {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    }
    return true;
}

// Inertial wheel scrolling (desktop only). Touch keeps native momentum; reduced motion keeps native scroll.
export default function SmoothScroll() {
    useEffect(() => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
        const fine = window.matchMedia('(pointer: fine)');
        if (reduce.matches || !fine.matches) return;

        const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1, syncTouch: false });
        window.__lenis = lenis;
        lenis.on('scroll', ScrollTrigger.update);
        const tick = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);

        // Fonts shift line heights; re-measure pinned sections once they settle.
        document.fonts?.ready.then(() => ScrollTrigger.refresh());

        return () => {
            gsap.ticker.remove(tick);
            lenis.destroy();
            delete window.__lenis;
        };
    }, []);

    return null;
}
