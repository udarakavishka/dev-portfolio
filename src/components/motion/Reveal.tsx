'use client';

import { motion, type HTMLMotionProps } from 'motion/react';

type Tag = 'div' | 'article' | 'li' | 'section' | 'p' | 'ul';

interface RevealProps extends HTMLMotionProps<'div'> {
    as?: Tag;
    delay?: number;
    /** Distance travelled, in px. Use a negative x via `from` for side entrances. */
    y?: number;
    x?: number;
}

// The one scroll-entrance used across the home page: rise, un-blur, fade. Plays once.
// Reduced motion: MotionConfig reducedMotion="user" drops the transform, leaving the fade.
export default function Reveal({ as = 'div', delay = 0, y = 28, x = 0, children, ...rest }: RevealProps) {
    const Component = motion[as] as typeof motion.div;
    return (
        <Component
            initial={{ opacity: 0, y, x, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, x: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay, ease: [0.23, 1, 0.32, 1] }}
            {...rest}
        >
            {children}
        </Component>
    );
}
