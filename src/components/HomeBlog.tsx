'use client';

import { useRef } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Clock } from 'lucide-react';
import type { Post } from '@/lib/posts';
import { CATEGORIES } from '@/lib/categories';
import styles from './HomeBlog.module.css';
import SectionHeading from './motion/SectionHeading';
import Magnetic from './motion/Magnetic';
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from '@/lib/gsap';

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

export default function HomeBlog({ posts }: HomeBlogProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const latestPosts = posts.slice(0, 5);

    // Featured cover wipes open from the right edge, then settles from a slight zoom.
    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            mm.add(MOTION_OK, () => {
                const image = sectionRef.current?.querySelector(`.${styles.featuredImage}`);
                if (!image) return;
                gsap.timeline({ scrollTrigger: { trigger: image, start: 'top 85%', once: true } })
                    .fromTo(image, { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', duration: 1.2, ease: 'expo.inOut' })
                    .fromTo(image.querySelector('img'), { scale: 1.25 }, { scale: 1, duration: 1.6, ease: 'expo.out' }, 0.1);
            });
            // Touch screens: the post row in the middle of the screen takes the hover look.
            mm.add(`${MOTION_OK} and (hover: none)`, () => {
                gsap.utils.toArray<HTMLElement>(`.${styles.row}`).forEach((row) => {
                    ScrollTrigger.create({
                        trigger: row,
                        start: 'top 60%',
                        end: 'bottom 40%',
                        toggleClass: { targets: row, className: styles.rowFocus },
                    });
                });
            });
        },
        { scope: sectionRef }
    );

    if (latestPosts.length === 0) {
        return null;
    }

    const [featured, ...rest] = latestPosts;

    return (
        <section id="blog" ref={sectionRef} className={styles.blog}>
            <div className={styles.container}>
                <SectionHeading
                    index="07"
                    label="writing"
                    title={<>Notes from <em>the cluster</em></>}
                    lede="Write-ups on Kubernetes, autoscaling, RAG systems and the mistakes worth sharing."
                />

                <motion.article
                    className={`${styles.featured} ${featured.mainImage ? styles.featuredWithImage : ''}`}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
                >
                    <div className={styles.featuredBody}>
                        <div className={styles.featuredMeta}>
                            <span className={styles.featuredLabel}>latest</span>
                            {featured.category && <span className={styles.category}>{categoryLabel(featured.category)}</span>}
                            {featured.readTime && (
                                <span className={styles.readTime}>
                                    <Clock size={13} aria-hidden="true" />
                                    {shortReadTime(featured.readTime)}
                                </span>
                            )}
                        </div>
                        <h3 className={styles.featuredTitle}>
                            <Link href={`/blog/${featured.slug}`} className={styles.featuredLink}>
                                {featured.title}
                            </Link>
                        </h3>
                        {featured.excerpt && <p className={styles.excerpt}>{featured.excerpt}</p>}
                        <div className={styles.featuredFoot}>
                            <span className={styles.date}>{formatDate(featured.date)}</span>
                            <span className={styles.readMore}>
                                Read post
                                <ArrowRight size={16} aria-hidden="true" />
                            </span>
                        </div>
                    </div>
                    {featured.mainImage && (
                        <div className={styles.featuredImage}>
                            <Image
                                src={featured.mainImage}
                                alt={featured.mainImageAlt ?? ''}
                                fill
                                sizes="(max-width: 768px) 100vw, 480px"
                                className={styles.featuredImg}
                            />
                        </div>
                    )}
                </motion.article>

                <ul className={styles.list}>
                    {rest.map((post, index) => (
                        <motion.li
                            key={post.slug}
                            initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
                            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{ delay: [0, 0.06, 0.1, 0.13][index % 4], duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                        >
                            <Link href={`/blog/${post.slug}`} className={styles.row}>
                                <span className={styles.rowDate}>{formatDate(post.date)}</span>
                                <span className={styles.rowTitle}>{post.title}</span>
                                <span className={styles.rowMeta}>
                                    {post.category && <span className={styles.category}>{categoryLabel(post.category)}</span>}
                                    {post.readTime && <span className={styles.rowRead}>{shortReadTime(post.readTime)}</span>}
                                </span>
                                <ArrowUpRight size={18} className={styles.rowArrow} aria-hidden="true" />
                            </Link>
                        </motion.li>
                    ))}
                </ul>

                <div className={styles.viewMoreContainer}>
                    {/* No prefetch: the blog index carries the full-text search index for every post */}
                    <Magnetic>
                        <Link href="/blog" prefetch={false} className="pill-button">
                            <span>All posts</span>
                            <ArrowRight size={18} aria-hidden="true" />
                        </Link>
                    </Magnetic>
                </div>
            </div>
        </section>
    );
}
