import styles from './Setup.module.css';
import { setupData } from '@/data/content';
import SectionHeading from './motion/SectionHeading';

const pad = (n: number) => String(n).padStart(2, '0');

// Three spec sheets side by side: hardware, software, services.
export default function Setup() {
    const total = setupData.reduce((sum, group) => sum + group.items.length, 0);

    return (
        <section id="setup" className={`${styles.setup} frame`}>
            <div className="gutter">
                <SectionHeading index="06" label="Setup" meta={`${total} entries`} title={<>Where the work <em>happens</em></>} />
            </div>

            <div className={styles.grid}>
                {setupData.map((group, index) => {
                    const Icon = group.icon;
                    return (
                        <div key={group.title} className={`${styles.col} ${index === 1 ? styles.paper : ''}`} data-reveal style={{ '--i': index } as React.CSSProperties}>
                            <div className={styles.head}>
                                <span className={styles.no}>/{pad(index + 1)}</span>
                                <h3>{group.title}</h3>
                                <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
                            </div>
                            <dl className={styles.list}>
                                {group.items.map((item) => (
                                    <div key={item.name} className={styles.item}>
                                        <dt>{item.name}</dt>
                                        <dd>{item.value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
