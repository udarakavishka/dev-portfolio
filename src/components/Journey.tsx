import { Fragment } from 'react';
import styles from './Journey.module.css';
import EducationMedia from './EducationMedia';
import { educationData, experienceData } from '@/data/content';
import SectionHeading from './motion/SectionHeading';

const pad = (n: number) => String(n).padStart(2, '0');

// Puts a link on the product's name wherever it appears in the description.
function Description({ text, product }: { text: string; product?: { name: string; url: string } }) {
    if (!product || !text.includes(product.name)) return <>{text}</>;
    const parts = text.split(product.name);
    return (
        <>
            {parts.map((part, i) => (
                <Fragment key={i}>
                    {part}
                    {i < parts.length - 1 && (
                        <a href={product.url} target="_blank" rel="noopener noreferrer" className={styles.textLink}>
                            {product.name}
                        </a>
                    )}
                </Fragment>
            ))}
        </>
    );
}

// First sentence of a highlight is the bold lead a skimmer reads.
function Highlight({ text }: { text: string }) {
    const cut = text.indexOf('. ');
    if (cut === -1) return <span>{text}</span>;
    return (
        <span>
            <strong className={styles.lead}>{text.slice(0, cut + 1)}</strong>
            {text.slice(cut + 1)}
        </span>
    );
}

// Work on the left as the feature module, education stacked on the right.
export default function Journey() {
    return (
        <section id="journey" className={`${styles.journey} frame`}>
            <div className="gutter">
                <SectionHeading
                    index="02"
                    label="Journey"
                    meta="Classroom → production"
                    title={<>From classroom to <em>production</em></>}
                />
            </div>

            <div className={styles.grid}>
                <div className={styles.work}>
                    {experienceData.map((item, index) => {
                        const current = item.period.includes('Present');
                        return (
                            <article key={item.role + item.company} id={index === 0 ? 'experience' : undefined} className={styles.job} data-reveal>
                                <div className={styles.jobTop}>
                                    <span className={current ? styles.live : styles.past}>
                                        {current ? 'Active process' : 'Completed'}
                                    </span>
                                    <span>{item.period.replace(' - ', ' → ')}</span>
                                </div>
                                <h3 className={styles.role}>{item.role}</h3>
                                <p className={styles.org}>
                                    {item.link ? (
                                        <a href={item.link} target="_blank" rel="noopener noreferrer" className={styles.textLink}>
                                            {item.company}
                                        </a>
                                    ) : (
                                        item.company
                                    )}
                                </p>
                                {item.description && (
                                    <p className={styles.desc}>
                                        <Description text={item.description} product={item.product} />
                                    </p>
                                )}
                                {item.highlights && (
                                    <ol className={styles.highlights}>
                                        {item.highlights.map((highlight, i) => (
                                            <li key={i} data-reveal style={{ '--i': i } as React.CSSProperties}>
                                                <span className={styles.no} aria-hidden="true">{pad(i + 1)}</span>
                                                <Highlight text={highlight} />
                                            </li>
                                        ))}
                                    </ol>
                                )}
                                {item.tags && (
                                    <ul className={styles.tags}>
                                        {item.tags.map((tag) => (
                                            <li key={tag}>{tag}</li>
                                        ))}
                                    </ul>
                                )}
                            </article>
                        );
                    })}
                </div>

                <div className={styles.edu} id="education">
                    {educationData.map((item, index) => {
                        const [title, badge] = item.degree.split(' - ');
                        return (
                            <article key={item.degree} className={styles.eduItem} data-reveal style={{ '--i': index } as React.CSSProperties}>
                                <div className={styles.eduTop}>
                                    <span>{pad(index + 1)} / education</span>
                                    <span>{item.period}</span>
                                </div>
                                {badge && <span className={styles.badge}>{badge}</span>}
                                <h3 className={styles.eduTitle}>{title}</h3>
                                <p className={styles.inst}>{item.institution}</p>
                                {item.description && <p className={styles.eduDesc}>{item.description}</p>}
                                {item.media?.length ? <EducationMedia eduIndex={index} /> : null}
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
