// `title` and `description` feed the /blog/category/<slug> page metadata.
export const CATEGORIES = [
    {
        slug: 'intern-diaries',
        label: 'intern diaries',
        title: 'Intern Diaries',
        description: 'Notes from a software engineering internship: real tickets, code review lessons, data model surprises and team habits.',
    },
    {
        slug: 'research-diaries',
        label: 'research diaries',
        title: 'Research Diaries',
        description: 'Notes from research on predictive Kubernetes autoscaling: forecasting models, continual learning, traces and evaluation.',
    },
    {
        slug: 'self-learn',
        label: 'self-learn',
        title: 'Self-Learning',
        description: 'Things learned outside work: side projects, RAG systems, tooling and events, written up as practical notes.',
    },
    {
        slug: 'devops-tools',
        label: 'devops & tools',
        title: 'DevOps and Tools',
        description: 'DevOps notes on Kubernetes, Terraform, ArgoCD, CI/CD and the tools around them, from hands-on setups.',
    },
] as const;

// Posts in these categories are day-to-day notes: they stay reachable under
// their own filter, but only the pinned ones surface in the "all" list.
export const ARCHIVED_CATEGORIES = new Set<string>(['intern-diaries']);
