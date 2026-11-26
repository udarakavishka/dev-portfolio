import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

const disallowedPaths = ['/api/', '/_next/', '/portfolio-studio/'];

// AI search and user-triggered fetchers may read and cite the site; model-training crawlers may not.
const aiSearchBots = ['OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User'];
const aiTrainingBots = ['GPTBot', 'anthropic-ai', 'Google-Extended', 'Applebot-Extended', 'CCBot', 'cohere-ai', 'Bytespider', 'meta-externalagent', 'Diffbot'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: disallowedPaths,
      },
      {
        userAgent: aiSearchBots,
        allow: '/',
        disallow: disallowedPaths,
      },
      {
        userAgent: aiTrainingBots,
        disallow: '/',
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
