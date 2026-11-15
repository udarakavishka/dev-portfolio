'use client';

import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { Briefcase, GraduationCap, School } from 'lucide-react';
import styles from './Journey.module.css';
import EducationMedia from './EducationMedia';
import { educationData, experienceData } from '@/data/content';
import SectionHeading from './motion/SectionHeading';
import SplitReveal from './motion/SplitReveal';
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from '@/lib/gsap';

const yearsOf = (period: string) => period.match(/\d{4}/g) ?? [period];
const pad = (n: number) => String(n).padStart(2, '0');
const EASE = [0.23, 1, 0.32, 1] as const;

// Two chapters. Education first: a year rail
// on the left that sticks beside each entry while it scrolls, with a fill line that tracks progress.
// Then work: one feature card per role with its highlights open.
export default function Journey() {
    const sectionRef = useRef<HTMLElement>(null);
    const eduRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: eduRef, offset: ['start 70%', 'end 55%'] });
    const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            // Touch screens: the card in the middle of the screen is in focus.
            mm.add(`${MOTION_OK} and (hover: none)`, () => {
                gsap.utils.toArray<HTMLElement>(`.${styles.eduCard}, .${styles.workCard}`).forEach((card) => {
                    ScrollTrigger.create({
                        trigger: card,
                        start: 'top 60%',
                        end: 'bottom 40%',
                        toggleClass: { targets: card, className: styles.cardFocus },
                    });
                });
            });
            mm.add(MOTION_OK, () => {
                // Year dots power on as the fill line reaches them.
                gsap.utils.toArray<HTMLElement>(`.${styles.dot}`).forEach((dot) => {
                    ScrollTrigger.create({
                        trigger: dot,
                        start: 'top 60%',
                        toggleClass: { targets: dot, className: styles.dotOn },
                    });
                });
                gsap.utils.toArray<HTMLElement>(`.${styles.workCard}`).forEach((card) => {
                    gsap.from(card.querySelectorAll(`.${styles.highlight}`), {
                        y: 10,
                        autoAlpha: 0,
                        duration: 0.5,
                        ease: 'expo.out',
                        stagger: 0.06,
                        scrollTrigger: { trigger: card, start: 'top 70%', once: true },
                    });
                });
            });
        },
        { scope: sectionRef }
    );

    return (
        <section id="journey" ref={sectionRef} className={styles.journey}>
            <div className={styles.container}>
                <SectionHeading
                    index="02"
                    label="journey"
                    title={<>From classroom to <em>production</em></>}
                    lede="Where I studied, and where I work now."
                />

                {/* Chapter 01: education */}
                <div className={styles.chapter}>
                    <div className={styles.chapterHead}>
                        <span className={styles.chapterNo}>01</span>
                        <p className={styles.chapterTitle}>Education</p>
                        <span className={styles.chapterLine} aria-hidden="true" />
                        <span className={styles.chapterCount}>
                            {educationData.length} {educationData.length === 1 ? 'stop' : 'stops'}
                        </span>
                    </div>

                    <div ref={eduRef} className={styles.eduWrap}>
                        <span className={styles.rail} aria-hidden="true">
                            <motion.span className={styles.railFill} style={{ scaleY: fill }} />
                            <span className={styles.railPacket} />
                        </span>
                        <ol className={styles.eduList}>
                        {educationData.map((item, index) => {
                            const [title, badge] = item.degree.split(' - ');
                            const years = yearsOf(item.period);
                            const isDegree = Boolean(item.media?.length) || index === 0;
                            const Icon = isDegree ? GraduationCap : School;
                            return (
                                <li key={item.degree} id={index === 0 ? 'education' : undefined} className={styles.eduRow}>
                                    <div className={styles.yearCol} aria-hidden="true">
                                        <div className={styles.yearSticky}>
                                            <span className={styles.dot} />
                                            <SplitReveal as="span" by="chars" className={styles.yearBig}>
                                                {years[years.length - 1]}
                                            </SplitReveal>
                                            {years.length > 1 && <span className={styles.yearFrom}>from {years[0]}</span>}
                                        </div>
                                    </div>

                                    <motion.article
                                        className={styles.eduCard}
                                        initial={{ opacity: 0, y: 24 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: '-80px' }}
                                        transition={{ duration: 0.7, ease: EASE }}
                                    >
                                        <div className={styles.cardTop}>
                                            <span className={styles.kind}>
                                                <Icon size={14} aria-hidden="true" />
                                                {isDegree ? 'education' : 'school'}
                                            </span>
                                            {badge && <span className={styles.badge}>{badge}</span>}
                                        </div>
                                        <h3 className={styles.eduTitle}>{title}</h3>
                                        <p className={styles.org}>
                                            {item.institution}
                                            <span className={styles.period}>{item.period}</span>
                                        </p>
                                        {item.description && <p className={styles.lead}>{item.description}</p>}
                                        {item.media?.length ? <EducationMedia eduIndex={index} /> : null}
                                    </motion.article>
                                </li>
                            );
                        })}
                        </ol>
                    </div>
                </div>

                {/* Chapter 02: work */}
                <div className={styles.chapter}>
                    <div className={styles.chapterHead}>
                        <span className={styles.chapterNo}>02</span>
                        <p className={styles.chapterTitle}>Work</p>
                        <span className={styles.chapterLine} aria-hidden="true" />
                        <span className={styles.chapterCount}>
                            {experienceData.length} {experienceData.length === 1 ? 'role' : 'roles'}
                        </span>
                    </div>

                    {experienceData.map((item, index) => {
                        const current = item.period.includes('Present');
                        return (
                            <motion.article
                                key={item.role + item.company}
                                id={index === 0 ? 'experience' : undefined}
                                className={styles.workCard}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-80px' }}
                                transition={{ duration: 0.7, ease: EASE }}
                            >
                                <div className={styles.workMain}>
                                    <div className={styles.cardTop}>
                                        <span className={styles.kind}>
                                            <Briefcase size={14} aria-hidden="true" />
                                            work
                                        </span>
                                        {current && (
                                            <span className={styles.now}>
                                                <span className={styles.nowDot} />
                                                now
                                            </span>
                                        )}
                                    </div>
                                    <h3 className={styles.workTitle}>{item.role}</h3>
                                    <p className={styles.org}>
                                        {item.company}
                                        <span className={styles.period}>{item.period}</span>
                                    </p>
                                    {item.description && <p className={styles.lead}>{item.description}</p>}
                                    {item.tags && (
                                        <ul className={styles.chips}>
                                            {item.tags.map((tag) => (
                                                <li key={tag} className={styles.chip}>
                                                    {tag}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                {item.highlights && (
                                    <div className={styles.workSide}>
                                        <p className={styles.sideLabel}>highlights</p>
                                        <ol className={styles.highlights}>
                                            {item.highlights.map((highlight, i) => (
                                                <li key={i} className={styles.highlight}>
                                                    <span className={styles.highlightNo} aria-hidden="true">
                                                        {pad(i + 1)}
                                                    </span>
                                                    <span>{highlight}</span>
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                )}
                            </motion.article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
