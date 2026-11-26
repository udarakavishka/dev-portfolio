import { getAllPosts, getPostBySlug } from '@/lib/posts';

export const dynamic = 'force-static';

export function generateStaticParams() {
    return getAllPosts().map((post) => ({ slug: post.slug }));
}

// Plain-Markdown copy of a post for AI agents and other tools; the page links it as rel="alternate".
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) return new Response('Not found', { status: 404 });
    return new Response(`# ${post.title}\n\n${post.content.trim()}\n`, {
        headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
    });
}
