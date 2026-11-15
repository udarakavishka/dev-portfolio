'use client';

import { motion } from 'motion/react';
import { Linkedin, ArrowRight, Crown, Newspaper, Trophy, Flag, Users, UsersRound, UserRound, type LucideIcon } from 'lucide-react';
import styles from './Clubs.module.css';
import { clubsData } from '@/data/content';
import SectionHeading from './motion/SectionHeading';
import Magnetic from './motion/Magnetic';
import { useRef } from 'react';
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from '@/lib/gsap';

// Leadership roles get a row each, ordered by weight; every other role is grouped under "Member".
const LEADERSHIP_ORDER: { match: string; icon: LucideIcon }[] = [
    { match: 'President', icon: Crown },
    { match: 'Chief Editor', icon: Newspaper },
    { match: 'Colours', icon: Trophy },
    { match: 'Representative', icon: Flag },
    { match: 'Committee', icon: UsersRound },
    { match: 'Board', icon: Users },
];

// A role can name two ranks ("Committee Member, … Representative"); the first one in the order wins.
const rankOf = (role: string) => LEADERSHIP_ORDER.findIndex(({ match }) => role.includes(match));
const leadership = clubsData
    .filter((club) => rankOf(club.role) >= 0)
    .sort((a, b) => rankOf(a.role) - rankOf(b.role))
    .map((club) => ({ ...club, icon: LEADERSHIP_ORDER[rankOf(club.role)].icon }));
const memberships = clubsData
    .filter((club) => !leadership.some((lead) => lead.name === club.name))
    .sort((a, b) => (a.scope === b.scope ? 0 : a.scope === 'University' ? -1 : 1));

// "Committee Member, University of Vavuniya Representative" prints the first part large, the rest small.
const splitRole = (role: string) => {
    const [main, ...rest] = role.split(', ');
    return { main, rest: rest.join(', ') };
};

const EASE = [0.23, 1, 0.32, 1] as const;
const rowMotion = (index: number) => ({
    initial: { opacity: 0, y: 28, filter: 'blur(6px)' },
    whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.8, ease: EASE, delay: (index % 4) * 0.06 },
});

// Roles wall: each row reads "ROLE ········ club, what it was, scope", like a credits roll.
export default function Clubs() {
    const sectionRef = useRef<HTMLElement>(null);

    // Touch screens get no hover, so the row crossing the middle of the screen takes the hover look.
    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            mm.add(`${MOTION_OK} and (hover: none)`, () => {
                gsap.utils.toArray<HTMLElement>(`.${styles.row}`).forEach((row) => {
                    ScrollTrigger.create({
                        trigger: row,
                        start: 'top 60%',
                        end: 'bottom 40%',
                        toggleClass: { targets: row, className: styles.rowFocus },
                    });
                });
            });
        },
        { scope: sectionRef }
    );
    const handleViewExperience = () => {
        window.open('https://www.linkedin.com/in/udaranalawansa/', '_blank');
    };

    return (
        <section id="clubs" ref={sectionRef} className={styles.clubs}>
            <div className={styles.container}>
                <SectionHeading
                    index="06"
                    label="clubs"
                    title={<>Leading <em>outside</em> the terminal</>}
                    lede="Societies, teams and editorial roles across university and school."
                />

                <ul className={styles.wall}>
                    {leadership.map((club, index) => {
                        const Icon = club.icon;
                        const { main, rest } = splitRole(club.role);
                        return (
                            <motion.li key={club.name} className={styles.row} {...rowMotion(index)}>
                                <div className={styles.roleCell}>
                                    <span className={styles.roleIcon} aria-hidden="true">
                                        <Icon size={18} />
                                    </span>
                                    <div className={styles.roleText}>
                                        <p className={styles.role}>{main}</p>
                                        {rest && <p className={styles.roleExtra}>{rest}</p>}
                                    </div>
                                    <motion.span
                                        className={styles.leader}
                                        aria-hidden="true"
                                        initial={{ scaleX: 0 }}
                                        whileInView={{ scaleX: 1 }}
                                        viewport={{ once: true, margin: '-60px' }}
                                        transition={{ duration: 1, ease: EASE, delay: 0.25 + (index % 4) * 0.06 }}
                                    />
                                </div>
                                <div className={styles.clubCell}>
                                    <h3 className={styles.org}>{club.name}</h3>
                                    {club.description && <p className={styles.description}>{club.description}</p>}
                                </div>
                                <span className={styles.scope}>{club.scope}</span>
                            </motion.li>
                        );
                    })}

                    <motion.li className={`${styles.row} ${styles.memberRow}`} {...rowMotion(leadership.length)}>
                        <div className={styles.roleCell}>
                            <span className={styles.roleIcon} aria-hidden="true">
                                <UserRound size={18} />
                            </span>
                            <div className={styles.roleText}>
                                <p className={styles.role}>Member</p>
                                <p className={styles.roleExtra}>{memberships.length} clubs</p>
                            </div>
                            <motion.span
                                className={styles.leader}
                                aria-hidden="true"
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                viewport={{ once: true, margin: '-60px' }}
                                transition={{ duration: 1, ease: EASE, delay: 0.25 }}
                            />
                        </div>
                        <ul className={styles.memberList}>
                            {memberships.map((club, index) => (
                                <motion.li
                                    key={club.name}
                                    className={styles.member}
                                    initial={{ opacity: 0, x: 16 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: '-40px' }}
                                    transition={{ duration: 0.7, ease: EASE, delay: 0.1 + index * 0.06 }}
                                >
                                    <div className={styles.clubCell}>
                                        <h3 className={styles.memberOrg}>{club.name}</h3>
                                        {club.description && <p className={styles.description}>{club.description}</p>}
                                    </div>
                                    <span className={styles.scope}>{club.scope}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.li>
                </ul>

                <div className={styles.viewMoreContainer}>
                    <Magnetic>
                        <button onClick={handleViewExperience} className="pill-button">
                            <Linkedin size={18} aria-hidden="true" />
                            <span>Full experience on LinkedIn</span>
                            <ArrowRight size={18} aria-hidden="true" />
                        </button>
                    </Magnetic>
                </div>
            </div>
        </section>
    );
}
