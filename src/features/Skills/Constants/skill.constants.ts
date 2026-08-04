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
  Frontend: '#3B82F6',
  Backend: '#22C55E',
  DevOps: '#F59E0B',
  Design: '#8B5CF6',
  QA: '#EF4444',
  Data: '#EC4899',
  'Soft Skills': '#14B8A6',
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