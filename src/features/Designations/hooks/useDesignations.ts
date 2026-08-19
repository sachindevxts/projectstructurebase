import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Designation } from '../types/designation.types';
import { designationService } from '../services/designationService';

export const useDesignations = () => {
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDesignations = useCallback(async () => {
    try {
      setLoading(true);
      setDesignations(await designationService.getAllDesignations());
      setError(null);
    } catch (err) {
      setError('Failed to load designations');
      console.error('Error loading designations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDesignations();
  }, [loadDesignations]);

  const createDesignation = useCallback(async (designation: Omit<Designation, 'id'>) => {
    try {
      const created = await designationService.createDesignation(designation);
      setDesignations((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      setError('Failed to create designation');
      console.error('Error creating designation:', err);
      return null;
    }
  }, []);

  const updateDesignation = useCallback(async (id: string, updates: Partial<Designation>) => {
    try {
      const updated = await designationService.updateDesignation(id, updates);
      if (updated) setDesignations((prev) => prev.map((item) => (item.id === id ? updated : item)));
      return updated;
    } catch (err) {
      setError('Failed to update designation');
      console.error('Error updating designation:', err);
      return null;
    }
  }, []);

  const deleteDesignation = useCallback(async (id: string) => {
    try {
      const deleted = await designationService.deleteDesignation(id);
      if (deleted) setDesignations((prev) => prev.filter((item) => item.id !== id));
      return deleted;
    } catch (err) {
      setError('Failed to delete designation');
      console.error('Error deleting designation:', err);
      return false;
    }
  }, []);

  const stats = useMemo(() => designationService.getDesignationStats(designations), [designations]);

  return {
    designations,
    loading,
    error,
    stats,
    loadDesignations,
    createDesignation,
    updateDesignation,
    deleteDesignation,
  };
};
