'use client';

import { useState } from 'react';
import { ArrowUpRight, Check, Loader2, RotateCcw } from 'lucide-react';
import styles from './Contact.module.css';
import { contactData } from '@/data/content';

const FIELDS = [
    { name: 'name', label: 'Name', placeholder: 'Your name' },
    { name: 'email', label: 'Email', placeholder: 'you@example.com' },
    { name: 'message', label: 'Message', placeholder: 'Hi Udara, …' },
] as const;

type FieldName = (typeof FIELDS)[number]['name'];
type Stage = 'idle' | 'running' | 'done' | 'failed';

const EMAIL = 'hello@udaradev.me';

export default function Contact() {
    const [formData, setFormData] = useState<Record<FieldName, string>>({ name: '', email: '', message: '' });
    const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
    const [stage, setStage] = useState<Stage>('idle');

    const validateForm = () => {
        const newErrors: Partial<Record<FieldName, string>> = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }
        if (!formData.message.trim()) newErrors.message = 'Message is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (stage === 'running' || !validateForm()) return;
        setStage('running');

        const ok = await fetch('https://formspree.io/f/xdkaqqnv', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        })
            .then((response) => response.ok)
            .catch((error) => {
                console.error('Error sending message:', error);
                return false;
            });

        if (ok) {
            setStage('done');
            setFormData({ name: '', email: '', message: '' });
        } else {
            setStage('failed');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const name = e.target.name as FieldName;
        setFormData((prev) => ({ ...prev, [name]: e.target.value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
        if (stage === 'done' || stage === 'failed') setStage('idle');
    };

    // Ctrl/Cmd + Enter sends from anywhere in the form.
    const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            e.currentTarget.requestSubmit();
        }
    };

    const socials = contactData.socialLinks.filter((link) => link.label !== 'Email');

    return (
        <section id="contact" className={`${styles.contact} frame`}>
            <div className={styles.top}>
                <h2 className={styles.headline}>
                    <span className={styles.lineOne} data-reveal>
                        Let&apos;s build
                        <ArrowUpRight className={styles.bigArrow} aria-hidden="true" />
                    </span>
                    <span className={styles.lineTwo} data-reveal style={{ '--i': 2 } as React.CSSProperties}>Something real.</span>
                </h2>

                <div className={styles.info} data-reveal style={{ '--i': 3 } as React.CSSProperties}>
                    <div className={styles.infoBlock}>
                        <p className={styles.infoLabel}>Contact</p>
                        <a href={`mailto:${EMAIL}`} className={styles.infoLink}>
                            {EMAIL}
                        </a>
                        <p className={styles.infoNote}>Colombo, Sri Lanka · UTC+5:30</p>
                    </div>
                    <div className={styles.infoBlock}>
                        <p className={styles.infoLabel}>Follow</p>
                        <ul className={styles.socials}>
                            {socials.map((link) => (
                                <li key={link.label}>
                                    <a href={link.href} target="_blank" rel="noopener noreferrer" className={styles.infoLink}>
                                        <link.icon size={15} aria-hidden="true" />
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className={styles.stamp} aria-hidden="true">
                        <span>Work</span>
                        <span>together</span>
                    </div>
                </div>
            </div>

            <form className={styles.form} onSubmit={handleSubmit} onKeyDown={handleKeyDown} noValidate>
                <p className={styles.formHead}>
                    <span className={styles.formIndex}>/09</span> Send a message
                </p>
                <div className={styles.fields}>
                    {FIELDS.map((field) => {
                        const id = `contact-${field.name}`;
                        const error = errors[field.name];
                        const common = {
                            id,
                            name: field.name,
                            value: formData[field.name],
                            onChange: handleChange,
                            placeholder: field.placeholder,
                            'aria-invalid': Boolean(error),
                            'aria-describedby': error ? `${id}-error` : undefined,
                            className: styles.input,
                        };
                        return (
                            <div key={field.name} className={`${styles.field} ${field.name === 'message' ? styles.fieldWide : ''}`}>
                                <label htmlFor={id} className={styles.label}>
                                    {field.label}
                                </label>
                                {field.name === 'message' ? (
                                    <textarea {...common} rows={4} />
                                ) : (
                                    <input {...common} type={field.name === 'email' ? 'email' : 'text'} autoComplete={field.name} />
                                )}
                                {error && (
                                    <span id={`${id}-error`} className={styles.error}>
                                        {error}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
                <div className={styles.submitRow}>
                    <button type="submit" className="btn-solid" disabled={stage === 'running'}>
                        {stage === 'running' && <Loader2 size={16} className={styles.spin} aria-hidden="true" />}
                        {stage === 'running' ? 'Sending' : 'Send message'}
                        {stage !== 'running' && <ArrowUpRight size={16} aria-hidden="true" />}
                    </button>
                    <span className={styles.status} role="status" aria-live="polite">
                        {stage === 'done' && (
                            <>
                                <Check size={15} aria-hidden="true" /> Message delivered. I&apos;ll get back to you soon.
                            </>
                        )}
                        {stage === 'failed' && (
                            <>
                                <RotateCcw size={15} aria-hidden="true" /> Couldn&apos;t send. Try again, or email {EMAIL}.
                            </>
                        )}
                        {stage === 'idle' && 'or Ctrl / ⌘ + Enter'}
                    </span>
                </div>
            </form>

            <footer className={styles.footer}>
                <span>© {new Date().getFullYear()} Udara Nalawansa</span>
                <span>Software · Cloud · Automation</span>
                <span>Thanks for scrolling</span>
            </footer>
            <div className={styles.hazardBand} aria-hidden="true">
                <span className="hazard" />
                <span className={styles.access}>&gt; Access granted_</span>
                <span className="hazard" />
            </div>
        </section>
    );
}
