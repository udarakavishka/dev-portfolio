import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowLeft, GraduationCap } from 'lucide-react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { notFound } from 'next/navigation';
import { getAllResearch, getResearchBySlug } from '@/lib/research';
import Navbar from '@/components/Navbar';
import { BreadcrumbSchema } from '@/components/StructuredData';
import { createMdxComponents } from '@/lib/mdx-components';
import styles from '../../projects/[slug]/project.module.css';
import type { Metadata } from 'next';
import { absoluteUrl, SITE_URL } from '@/lib/seo';

const mdxComponents = createMdxComponents(styles.contentImage);

export function generateStaticParams() {
    return getAllResearch().map((research) => ({
        slug: research.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const research = getResearchBySlug(slug);

    if (!research) {
        return {
            title: 'Research Not Found',
            description: 'The requested research page could not be found.',
        };
    }

    const researchUrl = absoluteUrl(`/research/${slug}`);
    const title = `${research.title} | Research`;
    const description = research.excerpt || `Research by Udara Nalawansa: ${research.title}.`;
    const images = research.cover ? [{ url: research.cover, width: 2400, height: 1254, alt: research.title }] : undefined;

    return {
        title,
        description,
        authors: [{ name: 'Udara Nalawansa', url: absoluteUrl('/') }],
        openGraph: {
            type: 'article',
            url: researchUrl,
            title,
            description,
            siteName: 'Udara Nalawansa Portfolio',
            images,
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            creator: '@udaranalawansa',
            images: research.cover ? [research.cover] : undefined,
        },
        alternates: {
            canonical: researchUrl,
        },
    };
}

export default async function ResearchDetail({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const research = getResearchBySlug(slug);

    if (!research) {
        notFound();
    }

    return (
        <>
            <BreadcrumbSchema items={[
                { name: 'Home', url: SITE_URL },
                { name: 'Research', url: '/#research' },
                { name: research.title, url: `/research/${slug}` }
            ]} />
            <Navbar />
            <main className={styles.project}>
                <div className={styles.container}>
                    <Link href="/#research" className={styles.backLink}>
                        <ArrowLeft size={18} />
                        Back to Research
                    </Link>

                    <article>
                        <header className={styles.header}>
                            <h1 className={styles.title}>{research.title}</h1>
                            <div className={styles.meta}>
                                {research.period && (
                                    <div className={styles.metaItem}>
                                        <Calendar size={16} />
                                        <span>{research.period}</span>
                                    </div>
                                )}
                                {research.institution && (
                                    <div className={styles.metaItem}>
                                        <GraduationCap size={16} />
                                        <span>{research.institution}</span>
                                    </div>
                                )}
                            </div>
                            {research.techStack.length > 0 && (
                                <div className={styles.techStack}>
                                    {research.techStack.map((tech) => (
                                        <span key={tech} className={styles.techBadge}>
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            )}
                            {research.cover && (
                                <Image
                                    src={research.cover}
                                    alt={`${research.title} summary card`}
                                    width={2400}
                                    height={1254}
                                    priority
                                    sizes="(max-width: 760px) 100vw, 720px"
                                    className={styles.contentImage}
                                    style={{ width: '100%', height: 'auto' }}
                                />
                            )}
                        </header>

                        <div className={styles.content}>
                            <MDXRemote
                                source={research.content}
                                components={mdxComponents}
                                options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
                            />
                        </div>
                    </article>
                </div>
            </main>
        </>
    );
}
