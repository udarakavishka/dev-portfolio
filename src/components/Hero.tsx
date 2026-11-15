'use client';

import dynamic from 'next/dynamic';
import { useReducedMotion } from 'motion/react';
import { ArrowRight, FileText, MapPin } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './Hero.module.css';
import { heroData } from '@/data/content';
import ViewCounter from './ViewCounter';
import Magnetic from './motion/Magnetic';
import { scrollToTarget } from './motion/SmoothScroll';
import { gsap, useGSAP, MOTION_OK } from '@/lib/gsap';

// The 3D cluster is decoration: its own chunk, loaded after first paint, never during SSR.
const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false });

const [firstName, ...restOfName] = heroData.name.split(' ');
const lastName = restOfName.join(' ');

// Staggered entrance for each hero row. A CSS animation, so the name and photo paint
// with the HTML instead of waiting for hydration (they are the page's LCP elements).
const rise = (delay: number) => ({ style: { animationDelay: `${delay}s` } });

export default function Hero() {
    const { tagline, bio, techStack, profileImage, socialLinks, roles } = heroData;
    const reduceMotion = useReducedMotion();
    const heroRef = useRef<HTMLElement>(null);
    const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [showScene, setShowScene] = useState(false);

    // Mount the 3D scene once the browser is idle, and only when motion and data allow it.
    useEffect(() => {
        if (reduceMotion) return;
        const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
        if (conn?.saveData) return;
        const ric = window.requestIdleCallback
            ? (cb: () => void) => window.requestIdleCallback(cb, { timeout: 1500 })
            : (cb: () => void) => window.setTimeout(cb, 600);
        const id = ric(() => setShowScene(true));
        return () => (window.cancelIdleCallback ?? window.clearTimeout)(id);
    }, [reduceMotion]);

    useEffect(() => {
        // Reduced motion: show the first role, no typing. Set after mount so SSR markup matches.
        if (reduceMotion) {
            const frame = requestAnimationFrame(() => setDisplayedText(roles[0]));
            return () => cancelAnimationFrame(frame);
        }
        const currentRole = roles[currentRoleIndex];
        const typingSpeed = isDeleting ? 50 : 100;
        const pauseTime = isDeleting ? 1000 : 2000;

        if (!isDeleting && displayedText === currentRole) {
            const timeout = setTimeout(() => setIsDeleting(true), pauseTime);
            return () => clearTimeout(timeout);
        }

        if (isDeleting && displayedText === '') {
            const timeout = setTimeout(() => {
                setIsDeleting(false);
                setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
            }, pauseTime);
            return () => clearTimeout(timeout);
        }

        const timeout = setTimeout(() => {
            setDisplayedText(
                isDeleting
                    ? currentRole.substring(0, displayedText.length - 1)
                    : currentRole.substring(0, displayedText.length + 1)
            );
        }, typingSpeed);

        return () => clearTimeout(timeout);
    }, [displayedText, isDeleting, currentRoleIndex, roles, reduceMotion]);

    // Text and portrait stay put while you scroll; only the backdrop graph fades as the hero leaves.
    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            mm.add(MOTION_OK, () => {
                gsap.to(`.${styles.scene}`, {
                    autoAlpha: 0,
                    ease: 'none',
                    scrollTrigger: { trigger: heroRef.current, start: 'center top', end: 'bottom top', scrub: true },
                });
            });
        },
        { scope: heroRef }
    );

    // The backdrop glow follows the pointer (or a dragging finger); written straight to CSS
    // variables so it never re-renders.
    const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
        const hero = heroRef.current;
        if (!hero) return;
        const rect = hero.getBoundingClientRect();
        hero.style.setProperty('--glow-x', `${e.clientX - rect.left}px`);
        hero.style.setProperty('--glow-y', `${e.clientY - rect.top}px`);
    };

    const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (scrollToTarget('#contact')) e.preventDefault();
    };

    return (
        <section id="about" ref={heroRef} className={styles.hero} onPointerMove={handlePointerMove}>
            <div className={styles.backdrop} aria-hidden="true" />
            <div className={styles.scene} aria-hidden="true">
                {showScene && <HeroScene />}
            </div>
            <div className={styles.container}>
                <div className={styles.layout}>
                    <div className={styles.main}>
                        <p className={`${styles.rise} ${styles.eyebrow}`} {...rise(0)}>
                            <span className={styles.statusDot} aria-hidden="true" />
                            <span className={styles.prompt} aria-hidden="true">$</span> whoami
                        </p>

                        <h1 className={styles.name}>
                            <span className={styles.nameLine}>
                                <span className={`${styles.nameInner} ${styles.firstName}`} {...rise(0.05)}>
                                    {firstName}
                                </span>
                            </span>
                            <span className={styles.nameLine}>
                                <span className={`${styles.nameInner} ${styles.lastName}`} {...rise(0.14)}>
                                    {lastName}
                                    <span className={styles.blockCursor} aria-hidden="true" />
                                </span>
                            </span>
                        </h1>

                        <p className={`${styles.rise} ${styles.roleLine}`} {...rise(0.28)}>
                            <span className={styles.prompt} aria-hidden="true">❯</span>
                            <span className={styles.role} aria-hidden="true">
                                {displayedText}
                                <span className={styles.caret} />
                            </span>
                            <span className={styles.visuallyHidden}>{roles.join(', ')}</span>
                        </p>

                        <div className={`${styles.rise} ${styles.copy}`} {...rise(0.36)}>
                            <p className={styles.tagline}>{tagline}</p>
                            <p className={styles.bio}>{bio}</p>
                        </div>

                        <div className={`${styles.rise} ${styles.actions}`} {...rise(0.44)}>
                            <Magnetic>
                                <a
                                    href="/Udara_Nalawansa.pdf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.primaryCta}
                                >
                                    <FileText size={18} aria-hidden="true" />
                                    View resume
                                </a>
                            </Magnetic>
                            <Magnetic strength={0.2}>
                                <a href="#contact" className={styles.secondaryCta} onClick={handleContactClick}>
                                    Contact
                                    <ArrowRight size={18} aria-hidden="true" className={styles.ctaArrow} />
                                </a>
                            </Magnetic>
                            <div className={styles.social}>
                                {socialLinks.map((link) => (
                                    <Magnetic key={link.label} strength={0.4} max={6}>
                                        <a
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.socialLink}
                                            aria-label={link.label}
                                        >
                                            <link.icon size={18} />
                                        </a>
                                    </Magnetic>
                                ))}
                            </div>
                        </div>
                    </div>

                    <figure className={`${styles.rise} ${styles.portrait}`} {...rise(0.2)}>
                        <div className={styles.photoFrame}>
                            <div className={styles.photoWrap}>
                                <Image
                                    src={profileImage}
                                    alt="Udara Nalawansa, DevOps engineer and full stack developer"
                                    fill
                                    loading="eager"
                                    priority
                                    sizes="(min-width: 1024px) 380px, 96px"
                                    className={styles.photo}
                                />
                                <span className={styles.scanline} aria-hidden="true" />
                            </div>
                            <span className={styles.corners} aria-hidden="true" />
                            <figcaption className={styles.caption}>
                                <span className={styles.fileName}>~/udara.jpg</span>
                                <span className={styles.location}>
                                    <MapPin size={13} aria-hidden="true" />
                                    Colombo, LK
                                </span>
                                <ViewCounter />
                            </figcaption>
                        </div>
                    </figure>
                </div>

                <div className={`${styles.rise} ${styles.stack}`} {...rise(0.52)}>
                    <span className={styles.stackLabel}>stack</span>
                    <div className={styles.marquee}>
                        {[0, 1].map((copy) => (
                            <ul key={copy} className={styles.stackList} aria-hidden={copy === 1 ? true : undefined}>
                                {techStack.map((tech) => (
                                    <li key={tech.name} className={styles.stackItem}>
                                        <span
                                            className={styles.stackIcon}
                                            style={{ '--icon': `url(/icons/tech/${tech.icon}.svg)` } as React.CSSProperties}
                                            aria-hidden="true"
                                        />
                                        {tech.name}
                                    </li>
                                ))}
                            </ul>
                        ))}
                    </div>
                </div>
            </div>

            <span className={`${styles.rise} ${styles.scrollCue}`} {...rise(0.9)} aria-hidden="true">
                <span className={styles.scrollCueLine} />
                scroll
            </span>
        </section>
    );
}
