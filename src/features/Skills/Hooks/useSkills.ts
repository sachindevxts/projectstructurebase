import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Skill, DialogMode } from '../Types/skill.types';
import { skillService } from '../Services/skillService';

export const useSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = useCallback(async () => {
    try {
      setLoading(true);
      const data = await skillService.getAllSkills();
      setSkills(data);
      setError(null);
    } catch (err) {
      setError('Failed to load skills');
      console.error('Error loading skills:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSkill = useCallback(async (skillData: Omit<Skill, 'id'>) => {
    try {
      const newSkill = await skillService.createSkill(skillData);
      setSkills(prev => [newSkill, ...prev]);
      return newSkill;
    } catch (err) {
      setError('Failed to create skill');
      console.error('Error creating skill:', err);
      return null;
    }
  }, []);

  const updateSkill = useCallback(async (id: string, updates: Partial<Skill>) => {
    try {
      const updatedSkill = await skillService.updateSkill(id, updates);
      if (updatedSkill) {
        setSkills(prev => prev.map(s => s.id === id ? updatedSkill : s));
      }
      return updatedSkill;
    } catch (err) {
      setError('Failed to update skill');
      console.error('Error updating skill:', err);
      return null;
    }
  }, []);

  const deleteSkill = useCallback(async (id: string) => {
    try {
      const success = await skillService.deleteSkill(id);
      if (success) {
        setSkills(prev => prev.filter(s => s.id !== id));
        setSelectedRows(prev => prev.filter(rowId => rowId !== id));
      }
      return success;
    } catch (err) {
      setError('Failed to delete skill');
      console.error('Error deleting skill:', err);
      return false;
    }
  }, []);

  const openDialog = useCallback((mode: Exclude<DialogMode, null>, skill?: Skill) => {
    setSelectedSkill(skill ?? null);
    setDialogMode(mode);
  }, []);

  const closeDialog = useCallback(() => {
    setDialogMode(null);
    setSelectedSkill(null);
  }, []);

  const toggleSelection = useCallback((id: string) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  }, []);

  const toggleAllSelection = useCallback((filteredIds: string[]) => {
    setSelectedRows(prev => {
      const allSelected = filteredIds.every(id => prev.includes(id));
      if (allSelected) {
        return prev.filter(id => !filteredIds.includes(id));
      } else {
        return [...prev, ...filteredIds.filter(id => !prev.includes(id))];
      }
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedRows([]);
  }, []);

  const stats = useMemo(() => skillService.getSkillStats(skills), [skills]);

  return {
    skills,
    loading,
    error,
    selectedSkill,
    dialogMode,
    selectedRows,
    stats,
    loadSkills,
    createSkill,
    updateSkill,
    deleteSkill,
    openDialog,
    closeDialog,
    toggleSelection,
    toggleAllSelection,
    clearSelection,
    setSelectedRows,
  };
};
