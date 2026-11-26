import { getAllPosts } from '@/lib/posts';
import BlogList from '@/components/BlogList';
import Reading from '@/components/Reading';
import Navbar from '@/components/Navbar';
import BlogHeader from '@/components/BlogHeader';
import Barricade from '@/components/Barricade';
import styles from './blog.module.css';
import type { Metadata } from 'next';
import { BlogListingSchema, BreadcrumbSchema } from '@/components/StructuredData';
import { absoluteUrl } from '@/lib/seo';

export const metadata: Metadata = {
    title: 'DevOps, Cloud and ML Engineering Blog',
    description: 'Notes by Udara Nalawansa on Kubernetes, Terraform, CI/CD, RAG and ML research, plus lessons from a software engineering internship.',
    openGraph: {
        title: 'DevOps, Cloud and ML Engineering Blog | Udara Nalawansa',
        description: 'Notes on Kubernetes, Terraform, CI/CD, RAG and ML research, plus lessons from a software engineering internship.',
        url: absoluteUrl('/blog'),
        type: 'website',
        images: ['/screenshot.png'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'DevOps, Cloud and ML Engineering Blog | Udara Nalawansa',
        description: 'Notes on Kubernetes, Terraform, CI/CD, RAG and ML research, plus lessons from a software engineering internship.',
        images: ['/screenshot.png'],
    },
    alternates: {
        canonical: absoluteUrl('/blog'),
        types: {
            'application/rss+xml': [
                { url: '/rss.xml', title: 'Udara Nalawansa — Blog' },
            ],
        },
    },
};

export default async function Blog() {
    const posts = getAllPosts();

    return (
        <>
            <BreadcrumbSchema items={[
                { name: 'Home', url: '/' },
                { name: 'Blog', url: '/blog' },
            ]} />
            <BlogListingSchema />
            <Navbar />
            <main className={styles.blog}>
                <div className={styles.container}>
                    <BlogHeader
                        lineOne="Notes from"
                        lineTwo="real work"
                        subtitle="DevOps, cloud and ML notes from work, research and self-learning: Kubernetes, RAG, CI/CD, and the bugs in between."
                        postCount={posts.length}
                    />
                    <div className={styles.body}>
                        <BlogList posts={posts} />
                    </div>
                </div>
                <Barricade from="blog" to="reading" />
                <div className={styles.container}>
                    <div className={styles.body}>
                        <Reading />
                    </div>
                </div>
            </main>
        </>
    );
}
