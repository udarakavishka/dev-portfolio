'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';

interface MagneticProps {
    children: ReactNode;
    /** Share of the pointer offset the element follows. */
    strength?: number;
    /** Hard cap on travel, px. */
    max?: number;
    className?: string;
}

const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v));

// Wrapper that drifts toward a fine pointer and springs home on leave. Decorative only:
// it never moves the hit target far, and touch / reduced-motion visitors get a static element.
export default function Magnetic({ children, strength = 0.3, max = 10, className }: MagneticProps) {
    const reduceMotion = useReducedMotion();
    const ref = useRef<HTMLSpanElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.5 });
    const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.5 });

    const onMove = (e: React.PointerEvent<HTMLSpanElement>) => {
        if (reduceMotion || e.pointerType !== 'mouse' || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set(clamp((e.clientX - (r.left + r.width / 2)) * strength, max));
        y.set(clamp((e.clientY - (r.top + r.height / 2)) * strength, max));
    };
    const reset = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.span
            ref={ref}
            className={className}
            style={{ x: sx, y: sy, display: 'inline-flex' }}
            onPointerMove={onMove}
            onPointerLeave={reset}
        >
            {children}
        </motion.span>
    );
}
