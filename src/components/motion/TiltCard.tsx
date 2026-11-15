'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, type HTMLMotionProps } from 'motion/react';

interface TiltCardProps extends Omit<HTMLMotionProps<'article'>, 'children'> {
    children: ReactNode;
    /** Max tilt in degrees. */
    max?: number;
}

// Card that leans toward a fine pointer on a spring and carries a soft spotlight under it.
// The spotlight sits at z-index -1: give the card `isolation: isolate` so it paints above the
// card background but below the content.
// Values go straight to motion values (no React re-render, no CSS-variable cascade).
export default function TiltCard({ children, max = 5, style, ...rest }: TiltCardProps) {
    const reduceMotion = useReducedMotion();
    const ref = useRef<HTMLElement>(null);
    const rx = useMotionValue(0);
    const ry = useMotionValue(0);
    const px = useMotionValue(50);
    const py = useMotionValue(50);
    const glow = useMotionValue(0);
    const srx = useSpring(rx, { stiffness: 180, damping: 20 });
    const sry = useSpring(ry, { stiffness: 180, damping: 20 });
    const sglow = useSpring(glow, { stiffness: 200, damping: 30 });
    const spotlight = useMotionTemplate`radial-gradient(420px circle at ${px}% ${py}%, var(--accent-glow), transparent 65%)`;

    const onMove = (e: React.PointerEvent<HTMLElement>) => {
        if (reduceMotion || e.pointerType !== 'mouse' || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width;
        const ny = (e.clientY - r.top) / r.height;
        ry.set((nx - 0.5) * 2 * max);
        rx.set(-(ny - 0.5) * 2 * max);
        px.set(nx * 100);
        py.set(ny * 100);
        glow.set(1);
    };
    const onLeave = () => {
        rx.set(0);
        ry.set(0);
        glow.set(0);
    };

    return (
        <motion.article
            ref={ref}
            onPointerMove={onMove}
            onPointerLeave={onLeave}
            style={{ rotateX: srx, rotateY: sry, transformPerspective: 1000, ...style }}
            {...rest}
        >
            <motion.span
                aria-hidden="true"
                style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 'inherit',
                    pointerEvents: 'none',
                    background: spotlight,
                    opacity: sglow,
                    zIndex: -1,
                }}
            />
            {children}
        </motion.article>
    );
}
