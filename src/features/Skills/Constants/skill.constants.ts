export const SKILL_CATEGORIES = [
  'All',
  'Frontend',
  'Backend',
  'DevOps',
  'Design',
  'QA',
  'Data',
  'Soft Skills',
] as const;

export const CATEGORY_COLORS: Record<string, string> = {
  Frontend: 'var(--color-info)',
  Backend: 'var(--color-success-light)',
  DevOps: 'var(--color-warning-light)',
  Design: 'var(--color-accent-purple)',
  QA: 'var(--color-error)',
  Data: 'var(--color-accent-pink)',
  'Soft Skills': 'var(--color-accent-teal)',
};

export const DEMAND_LEVELS = ['Low', 'Medium', 'High', 'Critical'] as const;
export const PROFICIENCY_LEVELS = ['1–5 scale', 'Beginner / Intermediate / Expert', 'Yes / No only'] as const;

export const DEFAULT_SKILL_FORM_VALUES = {
  category: '',
  proficiency: '1–5 scale' as const,
  demand: 'Medium' as const,
  status: 'Active' as const,
  active: 'true',
};

export const CHART_SKILLS = ['React.js', 'Node.js', 'TypeScript', 'Figma', 'AWS', 'Java', 'Selenium'];
