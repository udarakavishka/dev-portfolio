import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/posts'
import { getAllCaseStudies } from '@/lib/projects'
import { getAllResearch } from '@/lib/research'
import { SITE_URL } from '@/lib/seo'
import { CATEGORIES } from '@/lib/categories'

function toDate(value?: string): Date | null {
  if (!value) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function newest(dates: Array<Date | null | undefined>): Date | undefined {
  const valid = dates.filter((date): date is Date => date instanceof Date)
  // No dated content: omit lastmod rather than claim the build time.
  if (valid.length === 0) return undefined
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
    }))

  const projectPages: MetadataRoute.Sitemap = caseStudies
    .map((project) => ({ project, lastModified: toDate(project.date) }))
    .filter(({ lastModified }) => lastModified !== null)
    .map(({ project, lastModified }) => ({
      url: `${SITE_URL}/projects/${project.slug}`,
      lastModified: lastModified as Date,
    }))

  const researchPages: MetadataRoute.Sitemap = research
    .map((item) => ({ item, lastModified: toDate(item.date) }))
    .filter(({ lastModified }) => lastModified !== null)
    .map(({ item, lastModified }) => ({
      url: `${SITE_URL}/research/${item.slug}`,
      lastModified: lastModified as Date,
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
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: latestPost,
    },
  ]

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((category) => ({
    url: `${SITE_URL}/blog/category/${category.slug}`,
    lastModified: newest(
      posts
        .filter((post) => post.category === category.slug)
        .map((post) => toDate(post.updated) ?? toDate(post.date))
    ),
  }))

  return [...staticPages, ...categoryPages, ...researchPages, ...projectPages, ...blogPages]
}
