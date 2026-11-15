'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import styles from './Research.module.css';
import { heroData, researchData } from '@/data/content';
import SectionHeading from './motion/SectionHeading';
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from '@/lib/gsap';

// Each research entry is laid out like the first page of a paper: header, byline, rule,
// numbered contributions and keywords on the left, the cover as Figure 1 on the right.
export default function Research() {
    const sectionRef = useRef<HTMLElement>(null);

    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            // Touch screens: the paper in the middle of the screen gets the hover look.
            mm.add(`${MOTION_OK} and (hover: none)`, () => {
                gsap.utils.toArray<HTMLElement>(`.${styles.paper}`).forEach((paper) => {
                    ScrollTrigger.create({
                        trigger: paper,
                        start: 'top 55%',
                        end: 'bottom 45%',
                        toggleClass: { targets: paper, className: styles.paperFocus },
                    });
                });
            });
            mm.add(MOTION_OK, () => {
                gsap.utils.toArray<HTMLElement>(`.${styles.paper}`).forEach((paper) => {
                    const tl = gsap.timeline({
                        defaults: { ease: 'expo.out' },
                        scrollTrigger: { trigger: paper, start: 'top 85%', once: true },
                    });
                    tl.from(paper, { y: 24, autoAlpha: 0, duration: 0.7 })
                        .from(paper.querySelector(`.${styles.rule}`), { scaleX: 0, duration: 0.9, ease: 'expo.inOut' }, 0.15)
                        .from(paper.querySelectorAll(`.${styles.finding}`), { y: 10, autoAlpha: 0, stagger: 0.06, duration: 0.5 }, 0.3)
                        .from(paper.querySelector(`.${styles.figureFrame}`), { autoAlpha: 0, duration: 0.6 }, 0.3);
                });
            });
        },
        { scope: sectionRef }
    );

    return (
        <section id="research" ref={sectionRef} className={styles.research}>
            <div className={styles.container}>
                <SectionHeading
                    index="05"
                    label="research"
                    title={<>Teaching autoscalers to <em>see load coming</em></>}
                    lede="Undergraduate research: forecasting CPU demand with hybrid neural networks so Kubernetes scales before the spike, not after it."
                />
                <div className={styles.list}>
                    {researchData.map((item) => (
                        <article key={item.slug} className={styles.paper}>
                            <header className={styles.header}>
                                <div className={styles.meta}>
                                    <span className={styles.kind}>{item.title}</span>
                                    <span className={styles.period}>{item.period}</span>
                                </div>
                                <h3 className={styles.title}>
                                    {/* Stretched over the whole paper so any click opens the research page */}
                                    <Link href={`/research/${item.slug}`} className={styles.titleLink}>
                                        {item.focus}
                                    </Link>
                                </h3>
                                <p className={styles.byline}>
                                    <span className={styles.author}>{heroData.name}</span>
                                    <span className={styles.institution}>{item.institution}</span>
                                </p>
                                <span className={styles.rule} aria-hidden="true" />
                            </header>

                            <div className={styles.columns}>
                                <div className={styles.text}>
                                    <p className={styles.label}>Contributions</p>
                                    <ol className={styles.findings}>
                                        {item.highlights.map((highlight, index) => (
                                            <li key={highlight} className={styles.finding}>
                                                <span className={styles.cite} aria-hidden="true">
                                                    [{index + 1}]
                                                </span>
                                                <span>{highlight}</span>
                                            </li>
                                        ))}
                                    </ol>
                                    {item.tags && (
                                        <div className={styles.keywords}>
                                            <p className={styles.label}>Keywords</p>
                                            <ul className={styles.keywordList}>
                                                {item.tags.map((tag) => (
                                                    <li key={tag} className={styles.keyword}>
                                                        {tag}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <figure className={styles.figure}>
                                    <div className={styles.figureFrame}>
                                        <span className={styles.sweep} aria-hidden="true" />
                                        <Image
                                            src={item.cover}
                                            alt=""
                                            width={1294}
                                            height={1130}
                                            sizes="(max-width: 860px) 100vw, 520px"
                                            className={styles.figureImage}
                                        />
                                    </div>
                                    <figcaption className={styles.caption}>
                                        <span className={styles.figLabel}>Fig. 1</span> {item.title}
                                    </figcaption>
                                </figure>
                            </div>

                            <footer className={styles.footer}>
                                <span className={styles.path} aria-hidden="true">
                                    udaradev.me/research/{item.slug}
                                </span>
                                <span className={styles.more} aria-hidden="true">
                                    Read the research
                                    <ArrowRight size={16} />
                                </span>
                            </footer>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
