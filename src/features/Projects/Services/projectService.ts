import type { Project, ProjectStats } from '../Types/project.types';
import projectsData from '@/dummyJson/projects/project-list.json';

class ProjectService {
  private projects: Project[] = [];

  constructor() {
    this.projects = projectsData.projects as Project[];
  }

  getAllProjects(): Project[] {
    return this.projects;
  }

  getProjectById(id: string): Project | undefined {
    return this.projects.find(p => p.id === id);
  }

  getProjectStats(): ProjectStats {
    const projects = this.projects;
    const total = projects.length;
    const active = projects.filter(p => p.status === 'Active').length;
    const atRisk = projects.filter(p => p.status === 'At Risk').length;
    const completed = projects.filter(p => p.status === 'Completed').length;

    return { total, active, atRisk, completed };
  }

  filterProjects(search: string): Project[] {
    if (!search) return this.projects;
    const searchLower = search.toLowerCase();
    return this.projects.filter(p =>
      p.name.toLowerCase().includes(searchLower) ||
      p.client.toLowerCase().includes(searchLower)
    );
  }

  createProject(project: Omit<Project, 'id'>): Project {
    const newProject = {
      ...project,
      id: `PRJ-${Date.now()}`,
    };
    this.projects = [newProject, ...this.projects];
    return newProject;
  }

  updateProject(id: string, updates: Partial<Project>): Project | null {
    const index = this.projects.findIndex(p => p.id === id);
    if (index === -1) return null;

    const updatedProject = { ...this.projects[index], ...updates };
    this.projects[index] = updatedProject;
    return updatedProject;
  }

  deleteProject(id: string): boolean {
    const initialLength = this.projects.length;
    this.projects = this.projects.filter(p => p.id !== id);
    return this.projects.length < initialLength;
  }
}

export const projectService = new ProjectService();