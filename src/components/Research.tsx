import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import styles from './Research.module.css';
import { researchData } from '@/data/content';
import SectionHeading from './motion/SectionHeading';

export default function Research() {
    return (
        <section id="research" className={`${styles.research} frame`}>
            <div className="gutter">
                <SectionHeading
                    index="04"
                    label="Research"
                    meta="Undergraduate research"
                    title={<>Scale before <em>the spike</em></>}
                />
            </div>

            <div className={styles.grid}>
                <div className={styles.papers}>
                    {researchData.map((item) => (
                        <Link key={item.slug} href={`/research/${item.slug}`} className={styles.paper} data-reveal>
                            <div className={styles.text}>
                                <div className={styles.top}>
                                    <span className={styles.badge}>{item.title}</span>
                                    <span>{item.period}</span>
                                </div>
                                <h3 className={styles.focus}>{item.focus}</h3>
                                <p className={styles.inst}>{item.institution}</p>
                                <p className={styles.label}>Contributions</p>
                                <ol className={styles.findings}>
                                    {item.highlights.map((highlight, index) => (
                                        <li key={highlight}>
                                            <span className={styles.cite} aria-hidden="true">[{index + 1}]</span>
                                            <span>{highlight}</span>
                                        </li>
                                    ))}
                                </ol>
                                {item.tags && <p className={styles.label}>Keywords</p>}
                                {item.tags && (
                                    <ul className={styles.tags}>
                                        {item.tags.map((tag) => (
                                            <li key={tag}>{tag}</li>
                                        ))}
                                    </ul>
                                )}
                                <span className={styles.more}>
                                    Read the research
                                    <ArrowUpRight size={16} aria-hidden="true" />
                                </span>
                            </div>
                            <figure className={styles.figure}>
                                <Image
                                    src={item.cover}
                                    alt=""
                                    width={1294}
                                    height={1130}
                                    sizes="(max-width: 900px) 100vw, 420px"
                                    className={styles.image}
                                />
                                <figcaption>Fig. 1 / {item.slug}</figcaption>
                            </figure>
                        </Link>
                    ))}
                </div>

            </div>
        </section>
    );
}
