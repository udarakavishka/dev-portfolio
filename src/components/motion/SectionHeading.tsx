import type { ReactNode } from 'react';
import SplitReveal from './SplitReveal';

interface SectionHeadingProps {
    index: string;
    label: string;
    title?: ReactNode;
    // Short note on the right end of the bar, e.g. "13 projects"
    meta?: ReactNode;
    id?: string;
}

// "/03  SELECTED WORK ------------ 13 PROJECTS" bar, then an optional condensed title.
export default function SectionHeading({ index, label, title, meta, id }: SectionHeadingProps) {
    return (
        <header className="section-head" data-reveal>
            <div className="section-bar">
                <span className="section-bar-index" aria-hidden="true">/{index}</span>
                <span>{label}</span>
                <span className="section-bar-rule" aria-hidden="true" />
                {meta && <span className="section-bar-meta">{meta}</span>}
            </div>
            {title && (
                <SplitReveal as="h2" id={id} className="section-heading">
                    {title}
                </SplitReveal>
            )}
        </header>
    );
}
