import styles from './Skills.module.css';
import { skillsData } from '@/data/content';
import SectionHeading from './motion/SectionHeading';

const LABELS: Record<string, string> = {
    cloud_devops: 'Cloud & DevOps',
    ai_ml: 'AI & ML',
    languages: 'Languages',
    frontend: 'Frontend',
    backend_data: 'Backend & data',
    tools: 'Tools',
};

const groups = Array.from(new Set(skillsData.map((s) => s.category))).map((category) => ({
    category,
    label: LABELS[category] ?? category,
    skills: skillsData.filter((s) => s.category === category),
}));

const pad = (n: number) => String(n).padStart(2, '0');

// Green quote panel on the left, every tool as a chip grouped by area on the right.
export default function Skills() {
    return (
        <section id="skills" className={`${styles.skills} frame`}>
            <div className="gutter">
                <SectionHeading index="05" label="Stack matrix" meta={`${skillsData.length} tools`} />
            </div>

            <div className={styles.grid}>
                <div className={styles.quote} data-reveal>
                    <p className={styles.quoteText}>&ldquo;Automate the boring. Monitor the rest.&rdquo;</p>
                    <p className={styles.quoteNote}>The tools I reach for, grouped by where they sit in a system.</p>
                </div>

                <div className={styles.rows}>
                    {groups.map((group, index) => (
                        <div key={group.category} className={styles.row} data-reveal style={{ '--i': index } as React.CSSProperties}>
                            <p className={styles.label}>
                                {group.label} <b>{pad(group.skills.length)}</b>
                            </p>
                            <ul className={styles.chips}>
                                {group.skills.map((skill) => (
                                    <li key={skill.name}>
                                        {skill.icon && (
                                            <span
                                                className="tech-icon"
                                                style={{ '--icon': `url(/icons/tech/${skill.icon}.svg)` } as React.CSSProperties}
                                                aria-hidden="true"
                                            />
                                        )}
                                        {skill.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
