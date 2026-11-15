import type { ReactNode } from 'react';
import SplitReveal from './SplitReveal';
import Reveal from './Reveal';

interface SectionHeadingProps {
    index: string;
    label: string;
    title: ReactNode;
    lede?: ReactNode;
    id?: string;
}

// "> 02 / projects" eyebrow, display title that rises line by line, optional lede.
export default function SectionHeading({ index, label, title, lede, id }: SectionHeadingProps) {
    return (
        <header className="section-head">
            <Reveal as="p" className="section-eyebrow" y={10}>
                <span aria-hidden="true">&gt; {index} /</span> {label}
            </Reveal>
            <SplitReveal as="h2" id={id} className="section-heading">
                {title}
            </SplitReveal>
            {lede && (
                <Reveal as="p" className="section-lede" delay={0.15} y={16}>
                    {lede}
                </Reveal>
            )}
        </header>
    );
}
