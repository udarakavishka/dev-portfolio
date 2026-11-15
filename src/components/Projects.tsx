'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { ExternalLink, Github, ArrowRight, ArrowUpRight, FileText } from 'lucide-react';
import styles from './Projects.module.css';
import { projectsData } from '@/data/content';
import SectionHeading from './motion/SectionHeading';
import TiltCard from './motion/TiltCard';
import Magnetic from './motion/Magnetic';
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from '@/lib/gsap';

// Tech names that have a logo in public/icons/tech/, shown on the showcase cover.
const TECH_LOGOS: Record<string, string> = {
    Python: 'python',
    FastAPI: 'fastapi',
    Streamlit: 'streamlit',
    'WhatsApp Cloud API': 'whatsapp',
    'Meta Webhooks': 'meta',
    Kubernetes: 'kubernetes',
    Ollama: 'ollama',
    Flask: 'flask',
    PostgreSQL: 'postgresql',
    Docker: 'docker',
    'Node.js': 'nodedotjs',
    'Express.js': 'express',
    MongoDB: 'mongodb',
    'Next.js': 'nextdotjs',
    React: 'react',
    TypeScript: 'typescript',
};

type Project = (typeof projectsData)[number];

const pad = (n: number) => String(n).padStart(2, '0');
const hrefOf = (project: Project) =>
    project.caseStudySlug ? `/projects/${project.caseStudySlug}` : project.liveUrl ?? project.githubUrl;

function Badges({ project }: { project: Project }) {
    return (
        <>
            {project.isOngoing && (
                <span className={styles.ongoingBadge}>
                    <span className={styles.ongoingDot}></span>
                    Ongoing
                </span>
            )}
            {project.liveUrl && (
                <span className={styles.liveBadge}>
                    <span className={styles.liveDot}></span>
                    Live
                </span>
            )}
        </>
    );
}

function Links({ project }: { project: Project }) {
    return (
        <div className={styles.links}>
            {project.caseStudySlug && (
                <Link href={`/projects/${project.caseStudySlug}`} className={styles.linkPill}>
                    <FileText size={15} aria-hidden="true" />
                    Case study
                </Link>
            )}
            <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.linkPill}
                aria-label={`${project.title} on GitHub`}
            >
                <Github size={15} aria-hidden="true" />
                Code
            </a>
            {project.liveUrl && (
                <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.linkPill}
                    aria-label={`${project.title} live site`}
                >
                    <ExternalLink size={15} aria-hidden="true" />
                    Live
                </a>
            )}
        </div>
    );
}

// Desktop: a list of projects with one large panel pinned beside it. The panel shows whichever
// row sits at the reading line (or is hovered / focused). Mobile: each row opens into its own card.
export default function Projects() {
    const sectionRef = useRef<HTMLElement>(null);
    const [active, setActive] = useState(0);

    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            // The row crossing the middle of the viewport drives the panel while scrolling.
            mm.add('(min-width: 1024px)', () => {
                gsap.utils.toArray<HTMLElement>(`.${styles.row}`).forEach((row, index) => {
                    ScrollTrigger.create({
                        trigger: row,
                        start: 'top 55%',
                        end: 'bottom 55%',
                        onToggle: (self) => self.isActive && setActive(index),
                    });
                });
            });
            mm.add(`${MOTION_OK} and (min-width: 1024px)`, () => {
                gsap.fromTo(
                    `.${styles.stageFrame}`,
                    { clipPath: 'inset(12% 8% 12% 8% round 28px)', opacity: 0.4 },
                    {
                        clipPath: 'inset(0% 0% 0% 0% round 28px)',
                        opacity: 1,
                        duration: 1.2,
                        ease: 'expo.out',
                        scrollTrigger: { trigger: `.${styles.showcase}`, start: 'top 75%', once: true },
                    }
                );
            });
            mm.add(`${MOTION_OK} and (min-width: 1024px)`, () => {
                gsap.from(`.${styles.row}`, {
                    y: 28,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'expo.out',
                    stagger: { each: 0.05, ease: 'power1.in' },
                    clearProps: 'transform',
                    scrollTrigger: { trigger: `.${styles.list}`, start: 'top 85%', once: true },
                });
            });
            // Phones and tablets: each card arrives on its own, its tech labels cascade in after it,
            // and the card crossing the middle of the screen takes focus (hover never fires on touch).
            mm.add(`${MOTION_OK} and (max-width: 1023px)`, () => {
                gsap.utils.toArray<HTMLElement>(`.${styles.row}`).forEach((row) => {
                    gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 88%', once: true } })
                        .from(row, { y: 32, autoAlpha: 0, duration: 0.7, ease: 'expo.out', clearProps: 'transform' })
                        .from(
                            row.querySelectorAll(`.${styles.rowDetail} .${styles.techBadge}`),
                            { y: 8, autoAlpha: 0, duration: 0.4, ease: 'expo.out', stagger: 0.035 },
                            0.25
                        );
                    ScrollTrigger.create({
                        trigger: row,
                        start: 'top 62%',
                        end: 'bottom 38%',
                        toggleClass: { targets: row, className: styles.rowFocus },
                    });
                });
            });
        },
        { scope: sectionRef }
    );

    const handleViewMore = () => {
        window.open('https://github.com/udaraKavishka', '_blank');
    };

    return (
        <section id="projects" ref={sectionRef} className={styles.projects}>
            <div className={styles.container}>
                <SectionHeading
                    index="03"
                    label="projects"
                    title={<>Things I&apos;ve <em>built and shipped</em></>}
                    lede="AI assistants, RAG pipelines, cloud platforms and the tooling around them. Pick a project for the case study or the code."
                />

                <div className={styles.showcase}>
                    <ol className={styles.list}>
                        {projectsData.map((project, index) => {
                            const Icon = project.icon;
                            const href = hrefOf(project);
                            const isActive = index === active;
                            const rowLogos = project.techStack.filter((tech) => TECH_LOGOS[tech]).slice(0, 3);
                            const external = !project.caseStudySlug;
                            return (
                                <li
                                    key={project.id}
                                    className={`${styles.row} ${isActive ? styles.rowActive : ''}`}
                                    onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(index)}
                                    onFocus={() => setActive(index)}
                                >
                                    {/* Mobile only: a small generated cover so each card has a face */}
                                    <div className={styles.rowCover} aria-hidden="true">
                                        <span className={styles.rowCoverIndex}>{pad(index + 1)}</span>
                                        <span className={styles.rowCoverIcon}>
                                            <Icon strokeWidth={1.5} />
                                            <span className={`${styles.orbit} ${styles.rowOrbit}`}>
                                                <span className={styles.orbitDot} />
                                            </span>
                                        </span>
                                        {rowLogos.length > 0 && (
                                            <span className={styles.rowCoverLogos}>
                                                {rowLogos.map((tech) => (
                                                    <span key={tech} className={styles.coverLogo}>
                                                        <span
                                                            className={styles.coverLogoMark}
                                                            style={{ '--logo': `url(/icons/tech/${TECH_LOGOS[tech]}.svg)` } as React.CSSProperties}
                                                        />
                                                    </span>
                                                ))}
                                            </span>
                                        )}
                                    </div>
                                    <div className={styles.rowHead}>
                                        <span className={styles.index}>{pad(index + 1)}</span>
                                        <span className={styles.rowIcon} aria-hidden="true">
                                            <Icon size={18} strokeWidth={1.75} />
                                        </span>
                                        <div className={styles.rowText}>
                                            <h3 className={styles.rowTitle}>
                                                {external ? (
                                                    <a href={href} target="_blank" rel="noopener noreferrer" className={styles.rowLink}>
                                                        {project.title}
                                                    </a>
                                                ) : (
                                                    <Link href={href} className={styles.rowLink}>
                                                        {project.title}
                                                    </Link>
                                                )}
                                            </h3>
                                            {project.subtitle && <p className={styles.rowSubtitle}>{project.subtitle}</p>}
                                        </div>
                                        <span className={styles.rowBadges}>
                                            <Badges project={project} />
                                        </span>
                                        <ArrowUpRight size={18} className={styles.rowArrow} aria-hidden="true" />
                                    </div>

                                    {/* Mobile only: the details live inside the row */}
                                    <div className={styles.rowDetail}>
                                        <p className={styles.description}>{project.description}</p>
                                        <ul className={styles.techStack}>
                                            {project.techStack.map((tech) => (
                                                <li key={tech} className={styles.techBadge}>
                                                    {tech}
                                                </li>
                                            ))}
                                        </ul>
                                        <Links project={project} />
                                    </div>
                                </li>
                            );
                        })}
                    </ol>

                    {/* Desktop only: every project panel is rendered, one is shown at a time */}
                    <div className={styles.stage}>
                        <TiltCard className={styles.stageFrame} max={2.5}>
                            <div className={styles.counter} aria-hidden="true">
                                <span key={active} className={styles.counterNow}>{pad(active + 1)}</span>
                                <span className={styles.counterTotal}>/ {pad(projectsData.length)}</span>
                            </div>
                            {projectsData.map((project, index) => {
                                const Icon = project.icon;
                                const logos = project.techStack.filter((tech) => TECH_LOGOS[tech]).slice(0, 4);
                                const isActive = index === active;
                                return (
                                    <article
                                        key={project.id}
                                        className={`${styles.panel} ${isActive ? styles.panelActive : ''}`}
                                        aria-hidden={!isActive}
                                        inert={!isActive}
                                    >
                                        <div className={styles.cover} aria-hidden="true">
                                            <span className={styles.coverIcon}>
                                                <Icon strokeWidth={1.5} />
                                                <span className={styles.orbit}>
                                                    <span className={styles.orbitDot} />
                                                </span>
                                            </span>
                                            {logos.length > 0 && (
                                                <span className={styles.coverLogos}>
                                                    {logos.map((tech) => (
                                                        <span key={tech} className={styles.coverLogo}>
                                                            <span
                                                                className={styles.coverLogoMark}
                                                                style={{ '--logo': `url(/icons/tech/${TECH_LOGOS[tech]}.svg)` } as React.CSSProperties}
                                                            />
                                                        </span>
                                                    ))}
                                                </span>
                                            )}
                                        </div>
                                        <div className={styles.panelBody}>
                                            <div className={styles.panelTop}>
                                                <Badges project={project} />
                                            </div>
                                            <h3 className={styles.panelTitle}>{project.title}</h3>
                                            {project.subtitle && <p className={styles.panelSubtitle}>{project.subtitle}</p>}
                                            <p className={styles.description}>{project.description}</p>
                                            <ul className={styles.techStack}>
                                                {project.techStack.map((tech) => (
                                                    <li key={tech} className={styles.techBadge}>
                                                        {tech}
                                                    </li>
                                                ))}
                                            </ul>
                                            <Links project={project} />
                                        </div>
                                    </article>
                                );
                            })}
                        </TiltCard>
                    </div>
                </div>

                <div className={styles.viewMoreContainer}>
                    <Magnetic>
                        <button onClick={handleViewMore} className="pill-button">
                            <span>More projects on GitHub</span>
                            <ArrowRight size={18} aria-hidden="true" />
                        </button>
                    </Magnetic>
                </div>
            </div>
        </section>
    );
}
