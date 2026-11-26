import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Projects from '@/components/Projects';
import Research from '@/components/Research';
import Skills from '@/components/Skills';
import Contact from '@/components/Contact';
import Journey from '@/components/Journey';
import HowIWork from '@/components/HowIWork';
import Barricade from '@/components/Barricade';
import Clubs from '@/components/Clubs';
import Setup from '@/components/Setup';
import HomeBlog from '@/components/HomeBlog';
import { PersonSchema, WebsiteSchema, ProfilePageSchema, ProjectsSchema } from '@/components/StructuredData';
import { getAllPosts } from '@/lib/posts';
import { projectsData } from '@/data/content';
import { defaultDescription, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Udara Nalawansa | Software Engineer in Sri Lanka',
  description: defaultDescription,
  alternates: {
    canonical: SITE_URL,
    types: {
      'application/rss+xml': [
        { url: '/rss.xml', title: 'Udara Nalawansa — Blog' },
      ],
    },
  },
  openGraph: {
    title: 'Udara Nalawansa | Software Engineer in Sri Lanka',
    description: defaultDescription,
    url: SITE_URL,
    type: 'website',
    images: [
      {
        url: '/screenshot.png',
        width: 1200,
        height: 630,
        alt: 'Udara Nalawansa DevOps and cloud engineer portfolio',
      },
    ],
  },
};

export default function Home() {
  const posts = getAllPosts();

  return (
    <>
      <PersonSchema />
      <WebsiteSchema />
      <ProfilePageSchema projects={projectsData} posts={posts} />
      <ProjectsSchema projects={projectsData} />
      <Navbar />
      <main>
        <Hero />
        <HowIWork postCount={posts.length} />
        <Barricade from="01" to="02" />
        <Journey />
        <Barricade from="02" to="03" paper />
        <Projects />
        <Barricade from="03" to="04" />
        <Research />
        <Barricade from="04" to="05" paper />
        <Skills />
        <Barricade from="05" to="06" />
        <Setup />
        <Barricade from="06" to="07" paper />
        <Clubs />
        <Barricade from="07" to="08" />
        <HomeBlog posts={posts.slice(0, 5)} />
        <Barricade from="08" to="09" paper />
        <Contact />
      </main>
    </>
  );
}
