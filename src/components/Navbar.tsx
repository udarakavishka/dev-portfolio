'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react';
import { Menu, X, Moon, Sun } from 'lucide-react';
import styles from './Navbar.module.css';
import { scrollToTarget } from './motion/SmoothScroll';
import { applyTheme, getTheme, toggleTheme as toggleThemeState, THEME_EVENT, type Theme } from '@/lib/theme';

const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#journey', label: 'Journey' },
    { href: '#projects', label: 'Projects' },
    { href: '#research', label: 'Research' },
    { href: '/blog', label: 'Blog' },
    { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const { scrollYProgress } = useScroll();
    const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40, mass: 0.3 });

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Track whichever home page section crosses the middle of the viewport; sections
    // without a nav link (Skills, Education, ...) clear the highlight.
    useEffect(() => {
        const sections = Array.from(document.querySelectorAll<HTMLElement>('main section[id]'));
        if (sections.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveSection(entry.target.id);
                });
            },
            { rootMargin: '-45% 0px -50% 0px' }
        );
        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, []);

    // Sync from the shared theme source: apply the stored/current theme on mount,
    // and follow any change made elsewhere (e.g. the terminal `theme` command).
    useEffect(() => {
        let initial = getTheme();
        try {
            const stored = localStorage.getItem('theme') as Theme | null;
            if (stored === 'dark' || stored === 'light') initial = stored;
        } catch {
            /* ignore */
        }

        const onThemeChange = (e: Event) => {
            setTheme((e as CustomEvent<Theme>).detail);
        };
        window.addEventListener(THEME_EVENT, onThemeChange);
        // applyTheme dispatches THEME_EVENT synchronously, syncing state via the listener above.
        applyTheme(initial);
        return () => window.removeEventListener(THEME_EVENT, onThemeChange);
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen]);

    const toggleTheme = () => {
        setTheme(toggleThemeState());
    };

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith('#')) {
            e.preventDefault();

            // Check if we're on a blog page
            const currentPath = window.location.pathname;
            if (currentPath.startsWith('/blog')) {
                router.push('/' + href);
                setIsOpen(false);
            } else {
                // We're on home page, just scroll
                if (scrollToTarget(href)) {
                    setIsOpen(false);
                }
            }
        } else if (href.startsWith('/')) {
            // For internal routes like /blog, use Next.js navigation
            setIsOpen(false);
        }
    };

    const themeIcon = (
        <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
                key={theme}
                className={styles.themeIcon}
                initial={{ opacity: 0, scale: 0.6, rotate: -60, filter: 'blur(2px)' }}
                animate={{ opacity: 1, scale: 1, rotate: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.6, rotate: 60, filter: 'blur(2px)' }}
                transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
            >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </motion.span>
        </AnimatePresence>
    );

    return (
        <>
            <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
                <div className={styles.bar}>
                    <Link href="/" className={styles.logo}>
                        <span className={styles.prompt}>$</span> udaradev.sh
                    </Link>

                    <div className={styles.desktop}>
                        {navLinks.map((link) => {
                            const active = activeSection === link.href.slice(1);
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    prefetch={false}
                                    className={`${styles.link} ${active ? styles.active : ''}`}
                                    aria-current={active ? 'location' : undefined}
                                    onClick={(e) => handleNavClick(e, link.href)}
                                >
                                    {active && (
                                        <motion.span
                                            layoutId="nav-pill"
                                            className={styles.pill}
                                            transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
                                        />
                                    )}
                                    <span className={styles.linkLabel}>{link.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    <div className={styles.actions}>
                        <button onClick={toggleTheme} className={styles.iconButton} aria-label="Toggle theme">
                            {themeIcon}
                        </button>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`${styles.iconButton} ${styles.menuButton}`}
                            aria-label={isOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={isOpen}
                            aria-controls="mobile-menu"
                        >
                            {isOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>

                    <motion.span className={styles.progress} style={{ scaleX: progress }} aria-hidden="true" />
                </div>
            </nav>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            key="scrim"
                            className={styles.scrim}
                            onClick={() => setIsOpen(false)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, transition: { duration: 0.2 } }}
                            transition={{ duration: 0.25 }}
                        />
                        <motion.div
                            key="sheet"
                            id="mobile-menu"
                            className={styles.mobileMenu}
                            initial={{ opacity: 0, y: -16, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -12, scale: 0.98, transition: { duration: 0.18 } }}
                            transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
                        >
                            {navLinks.map((link, index) => {
                                const active = activeSection === link.href.slice(1);
                                return (
                                    <motion.span
                                        key={link.href}
                                        initial={{ opacity: 0, y: -6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.03 + index * 0.03, duration: 0.25 }}
                                    >
                                        <Link
                                            href={link.href}
                                            prefetch={false}
                                            className={`${styles.mobileLink} ${active ? styles.active : ''}`}
                                            aria-current={active ? 'location' : undefined}
                                            onClick={(e) => handleNavClick(e, link.href)}
                                        >
                                            <span className={styles.mobileIndex} aria-hidden="true">
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                            {link.label}
                                        </Link>
                                    </motion.span>
                                );
                            })}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
