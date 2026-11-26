import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/posts';
import { CATEGORIES } from '@/lib/categories';
import BlogList from '@/components/BlogList';
import Navbar from '@/components/Navbar';
import BlogHeader from '@/components/BlogHeader';
import { BreadcrumbSchema } from '@/components/StructuredData';
import { absoluteUrl } from '@/lib/seo';
import styles from '../../blog.module.css';

// One crawlable page per blog category; the list is the same BlogList as /blog, pre-filtered.
export function generateStaticParams() {
    return CATEGORIES.map((category) => ({ slug: category.slug }));
}

const findCategory = (slug: string) => CATEGORIES.find((category) => category.slug === slug);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const category = findCategory(slug);
    if (!category) return { title: 'Category Not Found' };
    const url = absoluteUrl(`/blog/category/${slug}`);
    return {
        title: `${category.title} | Blog`,
        description: category.description,
        openGraph: { title: `${category.title} | Udara Nalawansa Blog`, description: category.description, url, type: 'website', images: ['/screenshot.png'] },
        alternates: { canonical: url },
    };
}

export default async function BlogCategory({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const category = findCategory(slug);
    if (!category) notFound();
    const posts = getAllPosts();

    return (
        <>
            <BreadcrumbSchema items={[
                { name: 'Home', url: '/' },
                { name: 'Blog', url: '/blog' },
                { name: category.title, url: `/blog/category/${slug}` },
            ]} />
            <Navbar />
            <main className={styles.blog}>
                <div className={styles.container}>
                    <BlogHeader
                        lineOne={category.title.split(' ')[0]}
                        lineTwo={category.title.split(' ').slice(1).join(' ') || 'notes'}
                        subtitle={category.description}
                        postCount={posts.filter((post) => post.category === slug).length}
                        crumb={category.label}
                    />
                    <div className={styles.body}>
                        <BlogList posts={posts} initialCategory={slug} />
                    </div>
                </div>
            </main>
        </>
    );
}
