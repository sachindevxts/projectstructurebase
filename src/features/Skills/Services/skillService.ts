import type { Skill, SkillStats } from '../Types/skill.types';
import skillData from '@/dummyJson/skills/skill-list.json';

class SkillService {
  private skills: Skill[] = [];

  constructor() {
    this.skills = skillData.skills as any[];
  }

  getAllSkills(): Skill[] {
    return this.skills;
  }

  getSkillById(id: string): Skill | undefined {
    return this.skills.find((skill) => skill.id === id);
  }

  createSkill(skill: Omit<Skill, 'id'>): Skill {
    const newSkill = {
      ...skill,
      id: `skill-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.skills = [newSkill, ...this.skills];
    return newSkill;
  }

  updateSkill(id: string, updates: Partial<Skill>): Skill | null {
    const index = this.skills.findIndex((skill) => skill.id === id);
    if (index === -1) return null;

    const updatedSkill = {
      ...this.skills[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.skills[index] = updatedSkill;
    return updatedSkill;
  }

  deleteSkill(id: string): boolean {
    const initialLength = this.skills.length;
    this.skills = this.skills.filter((skill) => skill.id !== id);
    return this.skills.length < initialLength;
  }

  getSkillStats(): SkillStats {
    const skills = this.skills;
    const categories = new Set(skills.map((s) => s.category));

    return {
      totalSkills: skills.length,
      mappedEmployees: skills.reduce((sum, s) => sum + s.employees, 0),
      gapsIdentified: skills.filter((s) => s.gap === 'Gap').length,
      highDemand: skills.filter((s) => s.demand === 'High' || s.demand === 'Critical').length,
      categories: categories.size,
    };
  }

  filterSkills(filters: SkillFilters): Skill[] {
    let filtered = [...this.skills];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(searchLower) ||
          s.description.toLowerCase().includes(searchLower),
      );
    }

    if (filters.category && filters.category !== 'All') {
      filtered = filtered.filter((s) => s.category === filters.category);
    }

    if (filters.demand && filters.demand !== 'All Demand') {
      if (filters.demand === 'Gap') {
        filtered = filtered.filter((s) => s.gap === 'Gap');
      } else {
        filtered = filtered.filter((s) => s.demand === filters.demand?.replace(' Demand', ''));
      }
    }

    return filtered;
  }

  exportToCsv(skills: Skill[]): string {
    const headers = ['Skill', 'Category', 'Employees', 'Demand', 'Coverage', 'Status'];
    const rows = skills.map((skill) => [
      skill.name,
      skill.category,
      skill.employees.toString(),
      skill.demand,
      skill.coverage.toString(),
      skill.status,
    ]);

    return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  }

  getCoverageChartSkills(skillNames: string[]): Skill[] {
    return skillNames
      .map((name) => this.skills.find((skill) => skill.name === name))
      .filter((skill): skill is Skill => Boolean(skill));
  }
}

interface SkillFilters {
  search?: string;
  category?: string;
  demand?: string;
}

export const skillService = new SkillService();
