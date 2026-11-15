'use client';

import { useRef, type ElementType, type ReactNode } from 'react';
import { gsap, SplitText, useGSAP, MOTION_OK, REDUCED } from '@/lib/gsap';

interface SplitRevealProps {
    as?: ElementType;
    children: ReactNode;
    className?: string;
    id?: string;
    /** 'words' rises word by word inside masked lines; 'chars' for short display text. */
    by?: 'words' | 'chars';
    delay?: number;
    /** Play on mount instead of when scrolled into view (hero). */
    immediate?: boolean;
}

// Headline that rises out of masked lines. Text is real, server-rendered and readable before
// hydration; SplitText only enhances it, and screen readers get the unsplit text (aria: 'auto').
export default function SplitReveal({
    as: Tag = 'h2',
    children,
    className,
    id,
    by = 'words',
    delay = 0,
    immediate = false,
}: SplitRevealProps) {
    const ref = useRef<HTMLElement>(null);

    useGSAP(
        () => {
            const el = ref.current;
            if (!el) return;
            const mm = gsap.matchMedia();

            mm.add(MOTION_OK, () => {
                let split: SplitText | undefined;
                document.fonts.ready.then(() => {
                    if (!ref.current) return;
                    split = SplitText.create(el, {
                        type: by === 'chars' ? 'lines,words,chars' : 'lines,words',
                        mask: 'lines',
                        linesClass: 'split-line',
                        aria: 'auto',
                        autoSplit: true,
                        onSplit(self) {
                            const targets = by === 'chars' ? self.chars : self.words;
                            return gsap.from(targets, {
                                yPercent: 115,
                                rotate: by === 'chars' ? 0 : 2,
                                duration: by === 'chars' ? 1 : 0.9,
                                ease: 'expo.out',
                                stagger: by === 'chars' ? 0.028 : 0.045,
                                delay,
                                scrollTrigger: immediate
                                    ? undefined
                                    : { trigger: el, start: 'top 88%', once: true },
                            });
                        },
                    });
                    gsap.set(el, { autoAlpha: 1 });
                });
                return () => split?.revert();
            });

            mm.add(REDUCED, () => {
                gsap.set(el, { autoAlpha: 1 });
            });
        },
        { scope: ref, dependencies: [by, delay, immediate] }
    );

    return (
        <Tag ref={ref} id={id} className={className}>
            {children}
        </Tag>
    );
}
