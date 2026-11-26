import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const researchDirectory = path.join(process.cwd(), 'research');

export interface ResearchPage {
    slug: string;
    title: string;
    date: string;
    period?: string;
    institution?: string;
    excerpt?: string;
    // Shorter search title / description when the visible ones are too long
    seoTitle?: string;
    seoDescription?: string;
    cover?: string;
    techStack: string[];
}

export interface ResearchPageWithContent extends ResearchPage {
    content: string;
}

function parseResearch(fileName: string): ResearchPageWithContent {
    const slug = fileName.replace(/\.mdx?$/, '');
    const fileContents = fs.readFileSync(path.join(researchDirectory, fileName), 'utf8');
    const { data, content } = matter(fileContents);

    return {
        slug,
        title: data.title ?? slug,
        date: data.date ?? '',
        period: data.period,
        institution: data.institution,
        excerpt: data.excerpt,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        cover: data.cover,
        techStack: data.techStack ?? [],
        content,
    };
}

export function getAllResearch(): ResearchPage[] {
    if (!fs.existsSync(researchDirectory)) {
        return [];
    }

    return fs
        .readdirSync(researchDirectory)
        .filter((fileName) => /\.mdx?$/.test(fileName))
        .map((fileName) => {
            const { content, ...research } = parseResearch(fileName);
            void content;
            return research;
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getResearchBySlug(slug: string): ResearchPageWithContent | null {
    for (const ext of ['.mdx', '.md']) {
        const fileName = `${slug}${ext}`;
        if (fs.existsSync(path.join(researchDirectory, fileName))) {
            return parseResearch(fileName);
        }
    }
    return null;
}
