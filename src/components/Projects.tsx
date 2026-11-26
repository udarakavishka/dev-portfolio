import Link from 'next/link';
import { ArrowUpRight, ExternalLink, FileText, Github } from 'lucide-react';
import styles from './Projects.module.css';
import { projectsData } from '@/data/content';
import SectionHeading from './motion/SectionHeading';

type Project = (typeof projectsData)[number];

// The first four projects in content.ts are featured; reorder the array to change them.
const FEATURED_COUNT = 4;

const pad = (n: number) => String(n).padStart(2, '0');

// Case study first, then the live site, then the code.
const hrefOf = (p: Project) => (p.caseStudySlug ? `/projects/${p.caseStudySlug}` : p.liveUrl ?? p.githubUrl ?? '#');

function PrimaryLink({ project, className, label, children }: { project: Project; className: string; label?: string; children: React.ReactNode }) {
    const href = hrefOf(project);
    if (project.caseStudySlug) {
        return (
            <Link href={href} className={className} aria-label={label}>
                {children}
            </Link>
        );
    }
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={className} aria-label={label}>
            {children}
        </a>
    );
}

// Case study / Code / Live, whichever the project has.
function ProjectLinks({ project }: { project: Project }) {
    return (
        <span className={styles.links}>
            {project.caseStudySlug && (
                <Link href={`/projects/${project.caseStudySlug}`} className={styles.linkPill}>
                    <FileText size={13} aria-hidden="true" />
                    Case study
                </Link>
            )}
            {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.linkPill} aria-label={`${project.title} on GitHub`}>
                    <Github size={13} aria-hidden="true" />
                    Code
                </a>
            )}
            {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={styles.linkPill} aria-label={`${project.title} live site`}>
                    <ExternalLink size={13} aria-hidden="true" />
                    Live
                </a>
            )}
        </span>
    );
}

// Pixel cells for a project's cover, seeded by its id so server and client agree.
function cellsFor(id: number) {
    let seed = id * 7919 + 17;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const cells: { x: number; y: number; o: number }[] = [];
    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 16; x++) {
            const v = rnd();
            const weight = x / 16 + (1 - y / 10) * 0.6;
            if (v * weight > 0.55) cells.push({ x, y, o: 0.3 + v * 0.7 });
        }
    }
    return cells;
}

// A pixel-block cover generated from the project's id, with its icon and first word printed on it.
function Thumb({ project }: { project: Project }) {
    const cells = cellsFor(project.id);
    const word = project.title.split(' ')[0].toUpperCase();
    const size = Math.min(30, 148 / (word.length * 0.5));
    const Icon = project.icon;
    return (
        <>
            <svg viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" className={styles.thumbArt} aria-hidden="true">
                {cells.map((c) => (
                    <rect key={`${c.x}-${c.y}`} x={c.x * 10} y={c.y * 10} width="10" height="10" fill="var(--accent-primary)" opacity={c.o.toFixed(2)} />
                ))}
                <text x="7" y="93" className={styles.thumbWord} fontSize={size}>
                    {word}
                </text>
            </svg>
            <Icon className={styles.thumbIcon} size={18} strokeWidth={1.75} aria-hidden="true" />
        </>
    );
}

function Badges({ project }: { project: Project }) {
    if (!project.liveUrl && !project.isOngoing) return null;
    return (
        <span className={styles.badges}>
            {project.liveUrl && <span className={styles.badgeLive}>Live</span>}
            {project.isOngoing && <span className={styles.badgeOngoing}>Ongoing</span>}
        </span>
    );
}

export default function Projects() {
    const featured = projectsData.slice(0, FEATURED_COUNT);
    const archive = projectsData.slice(FEATURED_COUNT);

    return (
        <section id="projects" className={`${styles.projects} frame`}>
            <div className="gutter">
                <SectionHeading
                    index="03"
                    label="Selected work"
                    meta={`${projectsData.length} projects`}
                    title={<>Things I&apos;ve <em>built and shipped</em></>}
                />
            </div>

            <div className={styles.grid}>
                <ol className={styles.featured}>
                    {featured.map((project, index) => (
                        <li key={project.id} className={styles.row} data-reveal style={{ '--i': index } as React.CSSProperties}>
                            <span className={styles.num} aria-hidden="true">{pad(index + 1)}</span>
                            <PrimaryLink project={project} className={styles.thumb} label={project.title}>
                                <Thumb project={project} />
                            </PrimaryLink>
                            <div className={styles.body}>
                                <h3 className={styles.title}>
                                    <PrimaryLink project={project} className={styles.titleLink}>
                                        {project.title}
                                    </PrimaryLink>
                                    <Badges project={project} />
                                </h3>
                                {project.subtitle && <p className={styles.sub}>{project.subtitle}</p>}
                                <p className={styles.desc}>{project.description}</p>
                                <p className={styles.stack}>{project.techStack.join(' / ')}</p>
                                <ProjectLinks project={project} />
                            </div>
                            <PrimaryLink project={project} className={styles.arrow} label={`Open ${project.title}`}>
                                <ArrowUpRight size={18} aria-hidden="true" />
                            </PrimaryLink>
                        </li>
                    ))}
                </ol>

                <div className={styles.archive}>
                    <p className={styles.archiveHead}>Full archive</p>
                    <ol className={styles.archiveList} start={FEATURED_COUNT + 1}>
                        {archive.map((project, index) => (
                            <li key={project.id} className={styles.archiveRow} data-reveal style={{ '--i': index } as React.CSSProperties}>
                                <span className={styles.archiveNo}>{pad(index + FEATURED_COUNT + 1)}</span>
                                <span className={styles.archiveMain}>
                                    <PrimaryLink project={project} className={styles.archiveTitle}>
                                        {project.title}
                                    </PrimaryLink>
                                    <span className={styles.archiveSub}>{project.subtitle}</span>
                                </span>
                                <span className={styles.archiveIcons}>
                                    {project.githubUrl && (
                                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} on GitHub`}>
                                            <Github size={15} />
                                        </a>
                                    )}
                                    {project.liveUrl && (
                                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} live site`} className={styles.liveIcon}>
                                            <ExternalLink size={15} />
                                        </a>
                                    )}
                                </span>
                            </li>
                        ))}
                    </ol>
                    <a href="https://github.com/udaraKavishka" target="_blank" rel="noopener noreferrer" className={styles.more}>
                        More projects on GitHub
                        <ArrowUpRight size={16} aria-hidden="true" />
                    </a>
                </div>
            </div>
        </section>
    );
}
