import { Rss } from 'lucide-react';
import styles from '@/app/blog/blog.module.css';

interface BlogHeaderProps {
    // Two lines of the giant title; the second prints in green
    lineOne: string;
    lineTwo: string;
    subtitle: string;
    postCount: number;
    // Crumb after "/blog", e.g. a category label
    crumb?: string;
}

// Poster header for the blog pages: giant two-line title, subtitle, post count and RSS.
export default function BlogHeader({ lineOne, lineTwo, subtitle, postCount, crumb }: BlogHeaderProps) {
    return (
        <header className={styles.header}>
            <div className={styles.meta}>
                <span>
                    /blog{crumb && <span className={styles.crumb}> / {crumb}</span>}
                </span>
                <span className={styles.metaRule} aria-hidden="true" />
                <span>Notes · research · self-learning</span>
            </div>
            <div className={styles.headGrid}>
                <div className={styles.titleCol}>
                    <h1 className={styles.title}>
                        <span className={styles.lineOne}>{lineOne}</span>
                        <span className={styles.lineTwo}>{lineTwo}</span>
                    </h1>
                    <p className={styles.subtitle}>{subtitle}</p>
                </div>
                <div className={styles.stat}>
                    <span className={styles.statNum}>{postCount}</span>
                    <span className={styles.statLabel}>{postCount === 1 ? 'post' : 'posts'} written from real work</span>
                    <a href="/rss.xml" className={styles.feedLink}>
                        <Rss size={14} aria-hidden="true" />
                        RSS feed
                    </a>
                </div>
            </div>
        </header>
    );
}
