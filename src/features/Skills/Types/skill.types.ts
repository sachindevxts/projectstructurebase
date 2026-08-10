export interface Skill {
  id: string;
  name: string;
  category: string;
  employees: number;
  popularity?: number;
  demand: 'High' | 'Medium' | 'Low' | 'Critical';
  coverage: number;
  gap: 'Covered' | 'Partial' | 'Gap';
  status: 'Active' | 'Inactive';
  description: string;
  aliases: string[];
  designations: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface SkillCategory {
  name: string;
  count: number;
  color: string;
}

export interface SkillStats {
  totalSkills: number;
  mappedEmployees: number;
  gapsIdentified: number;
  highDemand: number;
  categories: number;
}

export type DialogMode = 'add' | 'edit' | 'view' | null;
export type DemandLevel = 'High' | 'Medium' | 'Low' | 'Critical';
export type GapStatus = 'Covered' | 'Partial' | 'Gap';
