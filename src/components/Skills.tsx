'use client';

import { useRef } from 'react';
import { motion, type Variants } from 'motion/react';
import { GitBranch } from 'lucide-react';
import styles from './Skills.module.css';
import { skillsData } from '@/data/content';
import SectionHeading from './motion/SectionHeading';
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from '@/lib/gsap';

// Lines print top to bottom like a file being written, values pop in after their key.
const file: Variants = { hidden: {}, show: { transition: { delayChildren: 0.35, staggerChildren: 0.09 } } };
const line: Variants = {
    hidden: { opacity: 0, x: -10, clipPath: 'inset(0 100% 0 0)' },
    show: { opacity: 1, x: 0, clipPath: 'inset(0 0% 0 0)', transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] } },
};

const groups = Array.from(new Set(skillsData.map((s) => s.category))).map((category) => ({
    category,
    skills: skillsData.filter((s) => s.category === category),
}));

export default function Skills() {
    const sectionRef = useRef<HTMLElement>(null);

    // The editor window settles in once; its lines then print one by one.
    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            // Touch screens: the YAML line in the middle of the screen lights up, values in sequence.
            mm.add(`${MOTION_OK} and (hover: none)`, () => {
                gsap.utils.toArray<HTMLElement>(`.${styles.line}`).forEach((line) => {
                    ScrollTrigger.create({
                        trigger: line,
                        start: 'top 55%',
                        end: 'bottom 45%',
                        toggleClass: { targets: line, className: styles.lineFocus },
                    });
                });
            });
            mm.add(MOTION_OK, () => {
                gsap.from(`.${styles.stage}`, {
                    y: 24,
                    autoAlpha: 0,
                    duration: 0.7,
                    ease: 'expo.out',
                    scrollTrigger: { trigger: `.${styles.stage}`, start: 'top 85%', once: true },
                });
            });
        },
        { scope: sectionRef }
    );

    return (
        <section id="skills" ref={sectionRef} className={styles.skills}>
            <div className={styles.container}>
                <SectionHeading
                    index="04"
                    label="stack"
                    title={<>The tools behind <em>the pipeline</em></>}
                    lede="What I reach for to build, ship and run software, written the way I would commit it."
                />
                <div className={styles.stage}>
                <motion.div
                    className={styles.editor}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-120px' }}
                    variants={file}
                >
                    <div className={styles.tabBar}>
                        <span className={styles.dots} aria-hidden="true">
                            <span />
                            <span />
                            <span />
                        </span>
                        <span className={styles.tab}>stack.yaml</span>
                    </div>

                    <div className={styles.code}>
                        <motion.div className={styles.line} variants={line}>
                            <span className={styles.lineNo} aria-hidden="true">1</span>
                            <p className={styles.comment}># tools I use to build, ship and run software</p>
                        </motion.div>
                        {groups.map((group, index) => (
                            <motion.div key={group.category} className={styles.line} variants={line}>
                                <span className={styles.lineNo} aria-hidden="true">{index + 2}</span>
                                <h3 className={styles.key}>
                                    {group.category}
                                    <span className={styles.punct}>:</span>
                                </h3>
                                <ul className={styles.values}>
                                    {group.skills.map((skill) => (
                                        <li key={skill.name} className={styles.value}>
                                            {skill.icon ? (
                                                <span
                                                    className={styles.logo}
                                                    style={{ '--logo': `url(/icons/tech/${skill.icon}.svg)` } as React.CSSProperties}
                                                    aria-hidden="true"
                                                />
                                            ) : (
                                                <span className={styles.logoFallback} aria-hidden="true">
                                                    {skill.name[0]}
                                                </span>
                                            )}
                                            {skill.name}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                        <motion.div className={styles.line} variants={line} aria-hidden="true">
                            <span className={styles.lineNo}>{groups.length + 2}</span>
                            <span className={styles.cursor} />
                        </motion.div>
                    </div>

                    <div className={styles.statusBar}>
                        <span className={styles.status}>
                            <span className={styles.liveDot} aria-hidden="true" />
                            <GitBranch size={12} aria-hidden="true" />
                            main
                        </span>
                        <span className={styles.status}>{skillsData.length} entries</span>
                        <span className={`${styles.status} ${styles.statusRight}`}>YAML · UTF-8 · LF</span>
                    </div>
                </motion.div>
                </div>
            </div>
        </section>
    );
}
