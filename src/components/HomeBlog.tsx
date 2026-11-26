import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Post } from '@/lib/posts';
import { CATEGORIES } from '@/lib/categories';
import styles from './HomeBlog.module.css';
import SectionHeading from './motion/SectionHeading';

interface HomeBlogProps {
    posts: Post[];
}

function formatDate(date: string) {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

function categoryLabel(slug?: string) {
    return CATEGORIES.find((category) => category.slug === slug)?.label ?? slug;
}

function shortReadTime(readTime?: string) {
    return readTime?.replace(/\s*read$/i, '');
}

const pad = (n: number) => String(n).padStart(2, '0');

// Latest post as a large card, the next ones as a numbered log.
export default function HomeBlog({ posts }: HomeBlogProps) {
    const latestPosts = posts.slice(0, 5);
    if (latestPosts.length === 0) return null;
    const [featured, ...rest] = latestPosts;

    return (
        <section id="blog" className={`${styles.blog} frame`}>
            <div className="gutter">
                <SectionHeading
                    index="08"
                    label="Signal"
                    meta="Latest from the blog"
                    title={<>Notes from <em>real work</em></>}
                />
            </div>

            <div className={styles.grid}>
                <Link href={`/blog/${featured.slug}`} className={styles.featured} data-reveal>
                    {featured.mainImage && (
                        <span className={styles.cover}>
                            <Image
                                src={featured.mainImage}
                                alt={featured.mainImageAlt ?? ''}
                                fill
                                sizes="(max-width: 1000px) 100vw, 640px"
                                className={styles.coverImage}
                            />
                        </span>
                    )}
                    <span className={styles.featuredBody}>
                        <span className={styles.meta}>
                            <span className={styles.newTag}>Latest</span>
                            {featured.category && <span>{categoryLabel(featured.category)}</span>}
                            <span>{formatDate(featured.date)}</span>
                            {featured.readTime && <span>{shortReadTime(featured.readTime)}</span>}
                        </span>
                        <span className={styles.featuredTitle}>{featured.title}</span>
                        {featured.excerpt && <span className={styles.excerpt}>{featured.excerpt}</span>}
                        <span className={styles.read}>
                            Read post
                            <ArrowUpRight size={16} aria-hidden="true" />
                        </span>
                    </span>
                </Link>

                <div className={styles.side}>
                    <ol className={styles.list}>
                        {rest.map((post, index) => (
                            <li key={post.slug} data-reveal style={{ '--i': index + 1 } as React.CSSProperties}>
                                <Link href={`/blog/${post.slug}`} className={styles.row}>
                                    <span className={styles.no}>{pad(index + 2)}</span>
                                    <span className={styles.rowBody}>
                                        <span className={styles.rowTitle}>{post.title}</span>
                                        <span className={styles.rowMeta}>
                                            {formatDate(post.date)}
                                            {post.category && ` · ${categoryLabel(post.category)}`}
                                            {post.readTime && ` · ${shortReadTime(post.readTime)}`}
                                        </span>
                                    </span>
                                    <ArrowUpRight size={16} className={styles.rowArrow} aria-hidden="true" />
                                </Link>
                            </li>
                        ))}
                    </ol>
                    <Link href="/blog" prefetch={false} className={styles.all}>
                        All posts
                        <ArrowUpRight size={16} aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
