import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Allocation, AllocationStats } from '../Types/allocation.types';
import { allocationService } from '../Services/allocationService';

export const useAllocations = () => {
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAllocations = useCallback(async (isActive: () => boolean = () => true) => {
    try {
      setLoading(true);
      const data = await allocationService.getAllAllocations();
      if (!isActive()) return;
      setAllocations(data);
      setError(null);
    } catch (err) {
      if (!isActive()) return;
      setError('Failed to load allocations');
      console.error('Error loading allocations:', err);
    } finally {
      if (isActive()) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let active = true;
    void loadAllocations(() => active);

    return () => {
      active = false;
    };
  }, [loadAllocations]);

  const createAllocation = useCallback(async (data: any) => {
    try {
      const newAllocation = await allocationService.createAllocation(data);
      setAllocations((prev) => [newAllocation, ...prev]);
      return newAllocation;
    } catch (err) {
      setError('Failed to create allocation');
      console.error('Error creating allocation:', err);
      return null;
    }
  }, []);

  const updateAllocation = useCallback(async (id: string, updates: Partial<Allocation>) => {
    try {
      const updatedAllocation = await allocationService.updateAllocation(id, updates);
      if (updatedAllocation) {
        setAllocations((prev) => prev.map((a) => (a.id === id ? updatedAllocation : a)));
      }
      return updatedAllocation;
    } catch (err) {
      setError('Failed to update allocation');
      console.error('Error updating allocation:', err);
      return null;
    }
  }, []);

  const deleteAllocation = useCallback(async (id: string) => {
    try {
      const success = await allocationService.deleteAllocation(id);
      if (success) {
        setAllocations((prev) => prev.filter((a) => a.id !== id));
      }
      return success;
    } catch (err) {
      setError('Failed to delete allocation');
      console.error('Error deleting allocation:', err);
      return false;
    }
  }, []);

  const stats = useMemo(() => allocationService.getAllocationStats(allocations), [allocations]);

  return {
    allocations,
    loading,
    error,
    stats,
    loadAllocations,
    createAllocation,
    updateAllocation,
    deleteAllocation,
  };
};
