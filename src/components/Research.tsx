'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, FlaskConical } from 'lucide-react';
import styles from './Research.module.css';
import { researchData } from '@/data/content';

export default function Research() {
    const sectionRef = useRef<HTMLElement>(null);
    const reduceMotion = useReducedMotion();
    // Cover drifts up and settles from a slight zoom while the section scrolls through the viewport
    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
    const coverY = useTransform(scrollYProgress, [0, 1], [40, -40]);
    const coverScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1, 1.04]);

    return (
        <section id="research" ref={sectionRef} className={styles.research}>
            <div className={styles.container}>
                <h2 className="section-title">Research</h2>
                <div className={styles.list}>
                    {researchData.map((item, index) => (
                        <motion.article
                            key={item.slug}
                            className={styles.tile}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-80px' }}
                            transition={{ delay: index * 0.06, duration: 0.45 }}
                        >
                            <div className={styles.cover}>
                                <motion.div
                                    className={styles.coverMotion}
                                    style={reduceMotion ? undefined : { y: coverY, scale: coverScale }}
                                >
                                    <Image
                                        src={item.cover}
                                        alt=""
                                        width={1294}
                                        height={1130}
                                        sizes="(max-width: 860px) 100vw, 640px"
                                        className={styles.coverImage}
                                    />
                                </motion.div>
                            </div>
                            <div className={styles.body}>
                                <span className={styles.kind}>
                                    <FlaskConical size={14} aria-hidden="true" />
                                    {item.title}
                                </span>
                                <h3 className={styles.title}>
                                    {/* Stretched over the whole tile so any click opens the research page */}
                                    <Link href={`/research/${item.slug}`} className={styles.titleLink}>
                                        {item.focus}
                                    </Link>
                                </h3>
                                <p className={styles.org}>
                                    {item.institution}
                                    <span className={styles.period}>{item.period}</span>
                                </p>
                                <ul className={styles.highlights}>
                                    {item.highlights.map((highlight) => (
                                        <li key={highlight}>{highlight}</li>
                                    ))}
                                </ul>
                                {item.tags && (
                                    <ul className={styles.techStack}>
                                        {item.tags.map((tag) => (
                                            <li key={tag} className={styles.techBadge}>
                                                {tag}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <span className={styles.more} aria-hidden="true">
                                    Read the research
                                    <ArrowRight size={16} />
                                </span>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}
