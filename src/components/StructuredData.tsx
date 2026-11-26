import { absoluteUrl, defaultDescription, PERSON_ID, PERSON_NAME, SITE_NAME, SITE_URL, WEBSITE_ID } from '@/lib/seo';

// One list so every Person node points at the same profiles.
const PERSON_SAME_AS = [
  "https://github.com/udaraKavishka",
  "https://www.linkedin.com/in/udaranalawansa/",
  "https://www.facebook.com/udara.nalawansa/",
  "https://instagram.com/_udara27"
];

function JsonLd({ schema }: { schema: Record<string, unknown> }) {
  const json = JSON.stringify(schema).replace(/</g, '\\u003c');

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

export function PersonSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: PERSON_NAME,
    alternateName: "Udara Kavishka Nalawansa",
    url: SITE_URL,
    email: "hello@udaradev.me",
    image: absoluteUrl('/profile.jpg'),
    jobTitle: "Associate Software Engineer",
    worksFor: {
      "@type": "Organization",
      name: "Xaventra"
    },
    description: defaultDescription,
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "University of Jaffna",
      sameAs: "https://www.jfn.ac.lk/"
    },
    sameAs: PERSON_SAME_AS,
    knowsAbout: [
      "DevOps",
      "Docker",
      "Kubernetes",
      "AWS",
      "CI/CD",
      "Terraform",
      "Ansible",
      "Jenkins",
      "Python",
      "Go",
      "TypeScript",
      "React",
      "Next.js",
      "FastAPI",
      "Flask",
      "PostgreSQL",
      "MLOps",
      "Infrastructure as Code",
      "Cloud Computing",
      "Microservices"
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "LK"
    }
  };

  return <JsonLd schema={schema} />;
}

export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    url: SITE_URL,
    description: "Professional portfolio showcasing DevOps engineering projects, cloud infrastructure work, Kubernetes deployments, CI/CD automation, and software development.",
    author: {
      "@type": "Person",
      "@id": PERSON_ID,
      name: PERSON_NAME
    },
    inLanguage: "en-US"
  };

  return <JsonLd schema={schema} />;
}

type ProfilePageSchemaProps = {
  projects: ProjectItem[];
  posts?: Array<{
    title: string;
    slug: string;
    date?: string;
  }>;
};

export function ProfilePageSchema({ projects, posts = [] }: ProfilePageSchemaProps) {
  const dateModified = posts
    .map((post) => post.date)
    .filter((date): date is string => Boolean(date))
    .sort()
    .at(-1);
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/#profile-page`,
    url: SITE_URL,
    name: "Udara Nalawansa - Software Engineer Portfolio",
    isPartOf: {
      "@id": WEBSITE_ID
    },
    ...(dateModified && { dateModified }),
    // The full Person node is emitted by PersonSchema; reference it here.
    mainEntity: { "@id": PERSON_ID },
    hasPart: [
      ...projects.slice(0, 6).map((project) => ({
        "@type": "SoftwareSourceCode",
        name: project.title,
        description: project.description,
        programmingLanguage: project.techStack,
        ...(project.githubUrl && { codeRepository: project.githubUrl }),
        ...(project.liveUrl && { url: project.liveUrl }),
        author: { "@id": PERSON_ID }
      })),
      ...posts
        .slice(0, 3)
        .map((post) => ({
          "@type": "BlogPosting",
          headline: post.title,
          url: absoluteUrl(`/blog/${post.slug}`),
          datePublished: post.date,
          author: { "@id": PERSON_ID }
        }))
    ]
  };

  return <JsonLd schema={schema} />;
}

type ArticleSchemaProps = {
  title: string;
  publishedAt: string;
  modifiedAt?: string;
  excerpt?: string;
  imageUrl?: string;
  tags?: string[];
  slug: string;
};

export function ArticleSchema({ title, publishedAt, modifiedAt, excerpt, imageUrl, tags, slug }: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${absoluteUrl(`/blog/${slug}`)}#article`,
    headline: title,
    description: excerpt || title,
    datePublished: publishedAt,
    author: {
      "@type": "Person",
      "@id": PERSON_ID,
      name: PERSON_NAME,
      url: SITE_URL
    },
    isPartOf: { "@id": WEBSITE_ID },
    image: imageUrl || absoluteUrl(`/blog/${slug}/opengraph-image`),
    url: absoluteUrl(`/blog/${slug}`),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/blog/${slug}`)
    },
    ...(tags?.length && { keywords: tags.join(", ") }),
    ...(modifiedAt && { dateModified: modifiedAt }),
  };

  return <JsonLd schema={schema} />;
}

type BreadcrumbItem = { name: string; url: string };

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url)
    }))
  };

  return <JsonLd schema={schema} />;
}

type ProjectItem = {
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
};

export function ProjectsSchema({ projects }: { projects: ProjectItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Software Projects by Udara Nalawansa",
    itemListElement: projects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SoftwareSourceCode",
        name: project.title,
        description: project.description,
        programmingLanguage: project.techStack,
        ...(project.githubUrl && { codeRepository: project.githubUrl }),
        ...(project.liveUrl && { url: project.liveUrl }),
        author: {
          "@type": "Person",
          "@id": PERSON_ID,
          name: PERSON_NAME,
          url: SITE_URL
        }
      }
    }))
  };

  return <JsonLd schema={schema} />;
}

type CaseStudySchemaProps = {
  title: string;
  excerpt?: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  slug: string;
};

export function CaseStudySchema({ title, excerpt, techStack, githubUrl, liveUrl, slug }: CaseStudySchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${absoluteUrl(`/projects/${slug}`)}#case-study`,
    name: title,
    description: excerpt || title,
    url: absoluteUrl(`/projects/${slug}`),
    about: {
      "@type": "SoftwareSourceCode",
      name: title,
      programmingLanguage: techStack,
      ...(githubUrl && { codeRepository: githubUrl }),
      ...(liveUrl && { url: liveUrl }),
    },
    author: {
      "@type": "Person",
      "@id": PERSON_ID,
      name: PERSON_NAME,
      url: SITE_URL
    }
  };

  return <JsonLd schema={schema} />;
}

type ResearchSchemaProps = {
  title: string;
  excerpt?: string;
  date?: string;
  institution?: string;
  slug: string;
};

export function ResearchSchema({ title, excerpt, date, institution, slug }: ResearchSchemaProps) {
  const url = absoluteUrl(`/research/${slug}`);
  const schema = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    "@id": `${url}#research`,
    headline: title,
    description: excerpt || title,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    ...(date && { datePublished: date }),
    ...(institution && { sourceOrganization: { "@type": "CollegeOrUniversity", name: institution } }),
    author: { "@id": PERSON_ID },
    isPartOf: { "@id": WEBSITE_ID }
  };

  return <JsonLd schema={schema} />;
}

export function BlogListingSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": absoluteUrl('/blog'),
    name: "DevOps, Cloud and ML Engineering Blog",
    description: "Notes by Udara Nalawansa on Kubernetes, Terraform, CI/CD, RAG and ML research, plus lessons from a software engineering internship.",
    url: absoluteUrl('/blog'),
    author: {
      "@type": "Person",
      "@id": PERSON_ID,
      name: PERSON_NAME,
      url: SITE_URL
    },
    isPartOf: {
      "@id": WEBSITE_ID
    }
  };

  return <JsonLd schema={schema} />;
}
