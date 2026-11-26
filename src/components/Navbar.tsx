'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import styles from './Navbar.module.css';
import { scrollToTarget } from './motion/SmoothScroll';

const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#journey', label: 'Journey' },
    { href: '#projects', label: 'Work' },
    { href: '#research', label: 'Research' },
    { href: '/blog', label: 'Blog' },
    { href: '#contact', label: 'Contact' },
];

// Colombo time for the header readout; empty on the server so hydration matches.
function useColomboTime() {
    const [time, setTime] = useState('');
    useEffect(() => {
        const format = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Asia/Colombo',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        });
        const tick = () => setTime(format.format(new Date()));
        tick();
        const id = window.setInterval(tick, 1000);
        return () => window.clearInterval(id);
    }, []);
    return time;
}

export default function Navbar() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const time = useColomboTime();
    const { scrollYProgress } = useScroll();
    const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40, mass: 0.3 });

    // Track whichever home page section crosses the middle of the viewport.
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

    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen]);

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith('#')) {
            e.preventDefault();
            // Off the home page, go home first; on it, just scroll.
            if (window.location.pathname !== '/') {
                router.push('/' + href);
                setIsOpen(false);
            } else if (scrollToTarget(href)) {
                setIsOpen(false);
            }
        } else {
            setIsOpen(false);
        }
    };

    return (
        <>
            <nav className={styles.navbar}>
                <div className={styles.bar}>
                    <Link href="/" className={styles.logo} aria-label="Udara Nalawansa, home">
                        <span className={styles.logoMark}>UDARA_</span>
                        <span className={styles.logoVer} aria-hidden="true">v26</span>
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
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>

                    <div className={styles.clock} aria-label="Local time in Colombo">
                        <span>
                            SYS_TIME <b>{time || '--:--:--'}</b>
                        </span>
                        <span>COLOMBO · UTC+5:30</span>
                    </div>

                    <Link href="#contact" prefetch={false} className={styles.cta} onClick={(e) => handleNavClick(e, '#contact')}>
                        Hire me
                        <ArrowUpRight size={16} aria-hidden="true" />
                    </Link>

                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={styles.menuButton}
                        aria-label={isOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={isOpen}
                        aria-controls="mobile-menu"
                    >
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    <motion.span className={styles.progress} style={{ scaleX: progress }} aria-hidden="true" />
                </div>
            </nav>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="sheet"
                        id="mobile-menu"
                        className={styles.mobileMenu}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
                        transition={{ duration: 0.2 }}
                    >
                        {navLinks.map((link, index) => {
                            const active = activeSection === link.href.slice(1);
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    prefetch={false}
                                    className={`${styles.mobileLink} ${active ? styles.active : ''}`}
                                    aria-current={active ? 'location' : undefined}
                                    onClick={(e) => handleNavClick(e, link.href)}
                                >
                                    <span className={styles.mobileIndex} aria-hidden="true">
                                        /{String(index + 1).padStart(2, '0')}
                                    </span>
                                    {link.label}
                                </Link>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
