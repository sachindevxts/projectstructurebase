import type { Skill, SkillStats } from '../Types/skill.types';
import { unwrapApiData, type ApiEnvelope } from '@/api/apiResponse';
import { api } from '@/api/client/apiClient';
import { API_ENDPOINTS } from '@/constants/api.constants';

let skillsCache: Skill[] = [];

async function getAllSkills(): Promise<Skill[]> {
  const response = await api.get<ApiEnvelope<Skill[]>>(API_ENDPOINTS.SKILLS);
  skillsCache = unwrapApiData(response.data);
  return skillsCache;
}

interface SkillFilters {
  search?: string;
  category?: string;
  demand?: string;
}

function getSkillById(id: string): Skill | undefined {
  return skillsCache.find((skill) => skill.id === id);
}

async function createSkill(skill: Omit<Skill, 'id'>): Promise<Skill> {
  const response = await api.post<ApiEnvelope<Skill>>(API_ENDPOINTS.SKILLS, skill);
  const created = unwrapApiData(response.data);
  await getAllSkills();
  return created;
}

async function updateSkill(id: string, updates: Partial<Skill>): Promise<Skill | null> {
  const response = await api.patch<ApiEnvelope<Skill>>(`${API_ENDPOINTS.SKILLS}/${id}`, updates);
  const updated = unwrapApiData(response.data);
  await getAllSkills();
  return updated;
}

async function deleteSkill(id: string): Promise<boolean> {
  await api.delete(`${API_ENDPOINTS.SKILLS}/${id}`);
  skillsCache = skillsCache.filter((skill) => skill.id !== id);
  return true;
}

function getSkillStats(skills = skillsCache): SkillStats {
  const categories = new Set(skills.map((skill) => skill.category));

  return {
    totalSkills: skills.length,
    mappedEmployees: skills.reduce((sum, skill) => sum + skill.employees, 0),
    gapsIdentified: skills.filter((skill) => skill.gap === 'Gap').length,
    highDemand: skills.filter((skill) => skill.demand === 'High' || skill.demand === 'Critical').length,
    categories: categories.size,
  };
}

function filterSkills(filters: SkillFilters, skills = skillsCache): Skill[] {
  let filtered = [...skills];

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (skill) =>
        skill.name.toLowerCase().includes(searchLower) ||
        skill.description.toLowerCase().includes(searchLower),
    );
  }

  if (filters.category && filters.category !== 'All') {
    filtered = filtered.filter((skill) => skill.category === filters.category);
  }

  if (filters.demand && filters.demand !== 'All Demand') {
    if (filters.demand === 'Gap') {
      filtered = filtered.filter((skill) => skill.gap === 'Gap');
    } else {
      filtered = filtered.filter((skill) => skill.demand === filters.demand?.replace(' Demand', ''));
    }
  }

  return filtered;
}

function exportToCsv(skills: Skill[]): string {
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

function getCoverageChartSkills(skillNames: string[]): Skill[] {
  return skillNames
    .map((name) => skillsCache.find((skill) => skill.name === name))
    .filter((skill): skill is Skill => Boolean(skill));
}

export const skillService = {
  getAllSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
  getSkillStats,
  filterSkills,
  exportToCsv,
  getCoverageChartSkills,
};
