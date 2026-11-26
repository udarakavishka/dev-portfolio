'use client';

import { MotionConfig } from 'motion/react';
import SmoothScroll from './motion/SmoothScroll';
import ScrollReveal from './motion/ScrollReveal';

// Lets motion follow the visitor's "reduce motion" OS setting, and runs smooth scrolling site-wide.
export default function MotionProvider({ children }: { children: React.ReactNode }) {
    return (
        <MotionConfig reducedMotion="user">
            <SmoothScroll />
            {children}
            <ScrollReveal />
        </MotionConfig>
    );
}
