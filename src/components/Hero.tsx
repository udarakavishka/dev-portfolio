'use client';

import Image from 'next/image';
import { ArrowDown, ArrowUpRight, Plus } from 'lucide-react';
import styles from './Hero.module.css';
import { heroData } from '@/data/content';
import ViewCounter from './ViewCounter';
import { scrollToTarget } from './motion/SmoothScroll';

const [firstName, ...restOfName] = heroData.name.split(' ');
const lastName = restOfName.join(' ');

// Staggered entrance as a CSS animation, so the name and portrait paint with the HTML
// instead of waiting for hydration (they are the page's LCP elements).
const rise = (delay: number) => ({ style: { animationDelay: `${delay}s` } });

// Cyber brutalist poster: giant condensed name on the left, the collage portrait on the right,
// and a cream "introduction" card under the portrait.
export default function Hero() {
    const { tagline, bio, techStack, socialLinks, roles } = heroData;

    const handleJump = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
        if (scrollToTarget(target)) e.preventDefault();
    };

    return (
        <section id="about" className={`${styles.hero} frame`}>
            <div className={styles.meta}>
                <span>
                    Software engineer
                    <br />
                    Cloud &amp; DevOps
                </span>
                <Plus className={styles.metaCross} size={22} strokeWidth={1.5} aria-hidden="true" />
                <span>
                    Colombo, LK
                    <br />
                    06.93° N 79.86° E
                </span>
                <span className={styles.metaRight}>
                    <ViewCounter />
                    <b>udaradev.me</b>
                </span>
            </div>

            <div className={styles.grid}>
                <div className={styles.nameCol}>
                    <p className={`${styles.rise} ${styles.kicker}`} {...rise(0)}>
                        <span>{roles[0]}</span>
                        <span>{roles[1]}</span>
                    </p>
                    <h1 className={styles.name}>
                        <span className={`${styles.rise} ${styles.first}`} {...rise(0)}>
                            {firstName}
                        </span>
                        <span className={`${styles.rise} ${styles.last}`} {...rise(0.08)}>
                            {lastName}
                        </span>
                    </h1>
                    <p className={`${styles.rise} ${styles.portfolio}`} {...rise(0.16)}>
                        Portfolio
                        <ArrowUpRight className={styles.portfolioArrow} aria-hidden="true" />
                    </p>
                </div>

                <figure className={`${styles.rise} ${styles.portrait}`} {...rise(0)}>
                    <Image
                        src="/profile-collage.jpg"
                        alt="Udara Nalawansa in a black suit, in front of a green circle"
                        width={928}
                        height={1152}
                        priority
                        sizes="(min-width: 900px) 40vw, 100vw"
                        className={styles.photo}
                    />
                </figure>

                <div className={`${styles.rise} ${styles.pitch}`} {...rise(0.24)}>
                    <p className={styles.tagline}>{tagline}</p>
                    <div className={styles.actions}>
                        <a href="#projects" className="btn-solid" onClick={(e) => handleJump(e, '#projects')}>
                            View work
                            <ArrowUpRight size={16} aria-hidden="true" />
                        </a>
                        <a href="/Udara_Nalawansa.pdf" target="_blank" rel="noopener noreferrer" className="pill-button">
                            Résumé.pdf
                            <ArrowDown size={16} aria-hidden="true" />
                        </a>
                    </div>
                    <ul className={styles.stack} aria-label="Core stack">
                        {techStack.map((tech) => (
                            <li key={tech.name}>
                                <span
                                    className="tech-icon"
                                    style={{ '--icon': `url(/icons/tech/${tech.icon}.svg)` } as React.CSSProperties}
                                    aria-hidden="true"
                                />
                                {tech.name}
                            </li>
                        ))}
                    </ul>
                </div>

                <aside className={`${styles.rise} ${styles.intro}`} {...rise(0.3)} aria-labelledby="intro-title">
                    <span className={styles.introArrow} aria-hidden="true">↘</span>
                    <h2 id="intro-title" className={styles.introTitle}>Introduction</h2>
                    <p className={styles.introText}>{bio}</p>
                    <ul className={styles.roles}>
                        {roles.slice(0, 4).map((role) => (
                            <li key={role}>{role}</li>
                        ))}
                    </ul>
                    <div className={styles.introFoot}>
                        <div className={styles.social}>
                            {socialLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={link.label}
                                >
                                    <link.icon size={18} />
                                </a>
                            ))}
                        </div>
                        <a href="#contact" className={styles.introLink} onClick={(e) => handleJump(e, '#contact')}>
                            Say hello
                            <ArrowUpRight size={14} aria-hidden="true" />
                        </a>
                    </div>
                </aside>
            </div>
        </section>
    );
}
