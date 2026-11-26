'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Calm scroll reveals for any element marked `data-reveal`: it fades and rises a little the first
// time it enters the viewport. Stagger with a `--i` index in the element's style. Elements already
// on screen at load are marked straight away, so nothing above the fold blinks.
export default function ScrollReveal() {
    const pathname = usePathname();

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const root = document.documentElement;
        const items = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-revealed])'));

        items.forEach((el) => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) el.setAttribute('data-revealed', '');
        });
        root.classList.add('reveal-ready');

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.setAttribute('data-revealed', '');
                    observer.unobserve(entry.target);
                });
            },
            { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
        );
        items.forEach((el) => {
            if (!el.hasAttribute('data-revealed')) observer.observe(el);
        });
        return () => observer.disconnect();
    }, [pathname]);

    return null;
}
