import { ImageResponse } from 'next/og';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { PERSON_NAME } from '@/lib/seo';

// Share card for posts without a cover image, in the same style as the site card (../../opengraph-image.tsx).
export const alt = 'Blog post by Udara Nalawansa';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#191724',
          color: '#faf4ed',
          padding: 72,
          fontFamily: 'Arial',
        }}
      >
        <div style={{ fontSize: 28, color: '#ebbcba' }}>udaradev.me/blog</div>
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1 }}>{post?.title ?? 'Blog'}</div>
        <div style={{ fontSize: 30, color: '#9ccfd8' }}>{PERSON_NAME}</div>
      </div>
    ),
    size
  );
}
