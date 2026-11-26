import styles from './Barricade.module.css';

interface BarricadeProps {
    // Section numbers either side of the break, e.g. from="02" to="03"
    from: string;
    to: string;
    // Cream tape instead of green, to vary the rhythm down the page
    paper?: boolean;
}

// Gap between home sections: a strip of hazard tape across the frame with the section hand-off in the middle.
export default function Barricade({ from, to, paper = false }: BarricadeProps) {
    return (
        <div className={`${styles.barricade} ${paper ? styles.paper : ''}`} aria-hidden="true">
            <div className={styles.tape}>
                <span className={styles.stripes} />
                <span className={styles.label}>
                    /{from} <span className={styles.arrow}>→</span> /{to}
                </span>
                <span className={styles.stripes} />
            </div>
        </div>
    );
}
