import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Project, ProjectStats } from '../Types/project.types';
import { projectService } from '../Services/projectService';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      const data = projectService.getAllProjects();
      setProjects(data);
      setError(null);
    } catch (err) {
      setError('Failed to load projects');
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createProject = useCallback(async (projectData: Omit<Project, 'id'>) => {
    try {
      const newProject = projectService.createProject(projectData);
      setProjects(prev => [newProject, ...prev]);
      return newProject;
    } catch (err) {
      setError('Failed to create project');
      console.error('Error creating project:', err);
      return null;
    }
  }, []);

  const updateProject = useCallback(async (id: string, updates: Partial<Project>) => {
    try {
      const updatedProject = projectService.updateProject(id, updates);
      if (updatedProject) {
        setProjects(prev => prev.map(p => p.id === id ? updatedProject : p));
      }
      return updatedProject;
    } catch (err) {
      setError('Failed to update project');
      console.error('Error updating project:', err);
      return null;
    }
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    try {
      const success = projectService.deleteProject(id);
      if (success) {
        setProjects(prev => prev.filter(p => p.id !== id));
      }
      return success;
    } catch (err) {
      setError('Failed to delete project');
      console.error('Error deleting project:', err);
      return false;
    }
  }, []);

  const stats = useMemo(() => projectService.getProjectStats(), [projects]);

  return {
    projects,
    loading,
    error,
    stats,
    loadProjects,
    createProject,
    updateProject,
    deleteProject,
  };
};