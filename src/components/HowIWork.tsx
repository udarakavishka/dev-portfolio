import Link from 'next/link';
import styles from './HowIWork.module.css';
import SectionHeading from './motion/SectionHeading';

interface HowIWorkProps {
    postCount: number;
}

// Line icons drawn on a 44px grid in the accent colour.
const ICONS: Record<string, React.ReactNode> = {
    build: (
        <>
            <rect x="6" y="6" width="32" height="32" />
            <path d="M6 18h32M18 18v20" />
        </>
    ),
    ship: <path d="M6 30h32M10 30l4-14h16l4 14M22 16V6M22 6l6 5" />,
    scale: (
        <>
            <rect x="4" y="26" width="10" height="12" className={styles.fill} />
            <rect x="17" y="16" width="10" height="22" />
            <rect x="30" y="6" width="10" height="32" strokeDasharray="3 3" />
        </>
    ),
    automate: (
        <>
            <circle cx="22" cy="22" r="14" />
            <path d="M22 8v6M22 30v6M8 22h6M30 22h6" />
            <rect x="18" y="18" width="8" height="8" className={styles.fill} />
        </>
    ),
    product: (
        <>
            <circle cx="22" cy="22" r="15" />
            <circle cx="22" cy="22" r="8" />
            <rect x="19" y="19" width="6" height="6" className={styles.fill} />
            <path d="M33 11l6-6M35 5h4v4" />
        </>
    ),
    learn: (
        <>
            <path d="M6 34L18 14l8 12 6-8 6 16z" />
            <rect x="30" y="4" width="6" height="6" className={styles.fill} />
        </>
    ),
};

export default function HowIWork({ postCount }: HowIWorkProps) {
    const modules = [
        { icon: 'build', title: 'Build end to end', text: 'Database, API and UI, one owner.' },
        { icon: 'ship', title: 'Ship on rails', text: 'CI/CD, migrations and checks before every merge.' },
        { icon: 'scale', title: 'Scale ahead', text: 'Containers, Kubernetes, and forecasting the load.' },
        { icon: 'automate', title: 'Automate it', text: 'Infrastructure as code. No snowflake servers.' },
        {
            icon: 'product',
            title: 'Think product',
            text: 'Start from the user’s problem, not the ticket, and ship what moves the product.',
            href: '/blog/product-mindset-software-engineer',
        },
        { icon: 'learn', title: 'Learn in public', text: `${postCount} posts written from real work.`, href: '/blog' },
    ];

    return (
        <section id="principles" className={`${styles.how} frame`}>
            <div className="gutter">
                <SectionHeading index="01" label="How I work" meta={`${modules.length} modules`} />
            </div>
            <ol className={styles.grid}>
                {modules.map((m, index) => {
                    const body = (
                        <>
                            <svg viewBox="0 0 44 44" className={styles.icon} aria-hidden="true">
                                {ICONS[m.icon]}
                            </svg>
                            <span className={styles.text}>
                                <span className={styles.title}>{m.title}</span>
                                <span className={styles.desc}>{m.text}</span>
                                {m.href && <span className={styles.more}>Read more ↗</span>}
                            </span>
                        </>
                    );
                    return (
                        <li key={m.icon} className={styles.item} data-reveal style={{ '--i': index } as React.CSSProperties}>
                            {m.href ? (
                                <Link href={m.href} className={styles.cell}>
                                    {body}
                                </Link>
                            ) : (
                                <div className={styles.cell}>{body}</div>
                            )}
                        </li>
                    );
                })}
            </ol>
        </section>
    );
}
