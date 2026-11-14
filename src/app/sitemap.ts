import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/posts'
import { getAllCaseStudies } from '@/lib/projects'
import { getAllResearch } from '@/lib/research'
import { SITE_URL } from '@/lib/seo'

function toDate(value?: string): Date | null {
  if (!value) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function newest(dates: Array<Date | null>): Date {
  const valid = dates.filter((date): date is Date => date !== null)
  if (valid.length === 0) return new Date()
  return valid.reduce((latest, date) => (date > latest ? date : latest))
}

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
  const caseStudies = getAllCaseStudies()
  const research = getAllResearch()

  const blogPages: MetadataRoute.Sitemap = posts
    .map((post) => ({ post, lastModified: toDate(post.updated) ?? toDate(post.date) }))
    .filter(({ lastModified }) => lastModified !== null)
    .map(({ post, lastModified }) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: lastModified as Date,
      changeFrequency: 'monthly' as const,
      priority: post.pinned ? 0.8 : 0.7,
    }))

  const projectPages: MetadataRoute.Sitemap = caseStudies
    .map((project) => ({ project, lastModified: toDate(project.date) }))
    .filter(({ lastModified }) => lastModified !== null)
    .map(({ project, lastModified }) => ({
      url: `${SITE_URL}/projects/${project.slug}`,
      lastModified: lastModified as Date,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))

  const researchPages: MetadataRoute.Sitemap = research
    .map((item) => ({ item, lastModified: toDate(item.date) }))
    .filter(({ lastModified }) => lastModified !== null)
    .map(({ item, lastModified }) => ({
      url: `${SITE_URL}/research/${item.slug}`,
      lastModified: lastModified as Date,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))

  const latestPost = newest(blogPages.map((page) => page.lastModified as Date))
  const latestContent = newest([
    latestPost,
    ...projectPages.map((page) => page.lastModified as Date),
    ...researchPages.map((page) => page.lastModified as Date),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: latestContent,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: latestPost,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]

  return [...staticPages, ...researchPages, ...projectPages, ...blogPages]
}
