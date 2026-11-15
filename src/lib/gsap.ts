'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

// Register once; every component imports gsap from here so plugins are always available.
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
    gsap.defaults({ ease: 'power3.out' });
}

// Shared media queries for gsap.matchMedia(): motion only when the visitor allows it.
export const MOTION_OK = '(prefers-reduced-motion: no-preference)';
export const REDUCED = '(prefers-reduced-motion: reduce)';
export const DESKTOP_MOTION = '(prefers-reduced-motion: no-preference) and (min-width: 1024px)';

// Strong ease-out, same curve as the --ease-out CSS token.
export const EASE_OUT = 'expo.out';

export { gsap, ScrollTrigger, SplitText, useGSAP };
