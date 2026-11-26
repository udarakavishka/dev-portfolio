import { ArrowUpRight, Crown, Flag, Linkedin, Newspaper, Trophy, Users, UsersRound, type LucideIcon } from 'lucide-react';
import styles from './Clubs.module.css';
import { clubsData } from '@/data/content';
import SectionHeading from './motion/SectionHeading';

// Leadership roles get a card each, ordered by weight; every other role is listed as a membership.
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

const pad = (n: number) => String(n).padStart(2, '0');

export default function Clubs() {
    return (
        <section id="clubs" className={`${styles.clubs} frame`}>
            <div className="gutter">
                <SectionHeading
                    index="07"
                    label="Off duty"
                    meta={`${clubsData.length} clubs & teams`}
                    title={<>Leadership &amp; <em>community</em></>}
                />
            </div>

            <ol className={styles.lead}>
                {leadership.map((club, index) => {
                    const Icon = club.icon;
                    const [main, ...rest] = club.role.split(', ');
                    return (
                        <li key={club.name} className={styles.card} data-reveal style={{ '--i': index } as React.CSSProperties}>
                            <div className={styles.cardTop}>
                                <span>/{pad(index + 1)}</span>
                                <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
                            </div>
                            <p className={styles.role}>{main}</p>
                            {rest.length > 0 && <p className={styles.roleNote}>{rest.join(', ')}</p>}
                            <p className={styles.club}>{club.name}</p>
                            {club.description && <p className={styles.desc}>{club.description}</p>}
                            <span className={styles.scope}>{club.scope}</span>
                        </li>
                    );
                })}
            </ol>

            <div className={styles.members}>
                <p className={styles.membersHead}>Member of</p>
                <ul className={styles.memberList}>
                    {memberships.map((club) => (
                        <li key={club.name}>
                            <span className={styles.memberName}>{club.name}</span>
                            <span className={styles.memberScope}>{club.scope}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <a href="https://www.linkedin.com/in/udaranalawansa/" target="_blank" rel="noopener noreferrer" className={styles.linkedin}>
                <span>
                    <Linkedin size={16} aria-hidden="true" />
                    Full experience on LinkedIn
                </span>
                <ArrowUpRight size={16} aria-hidden="true" />
            </a>
        </section>
    );
}
