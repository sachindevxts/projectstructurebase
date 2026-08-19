import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Department, DepartmentStats } from '../types/department.types';
import { departmentService } from '../services/departmentService';

export const useDepartments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDepartments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await departmentService.getAllDepartments();
      setDepartments(data);
      setError(null);
    } catch (err) {
      setError('Failed to load departments');
      console.error('Error loading departments:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDepartments();
  }, [loadDepartments]);

  const createDepartment = useCallback(async (departmentData: Omit<Department, 'id'>) => {
    try {
      const newDepartment = await departmentService.createDepartment(departmentData);
      setDepartments((prev) => [newDepartment, ...prev]);
      return newDepartment;
    } catch (err) {
      setError('Failed to create department');
      console.error('Error creating department:', err);
      return null;
    }
  }, []);

  const updateDepartment = useCallback(async (id: string, updates: Partial<Department>) => {
    try {
      const updatedDepartment = await departmentService.updateDepartment(id, updates);
      if (updatedDepartment) {
        setDepartments((prev) => prev.map((d) => (d.id === id ? updatedDepartment : d)));
      }
      return updatedDepartment;
    } catch (err) {
      setError('Failed to update department');
      console.error('Error updating department:', err);
      return null;
    }
  }, []);

  const deleteDepartment = useCallback(async (id: string) => {
    try {
      const success = await departmentService.deleteDepartment(id);
      if (success) {
        setDepartments((prev) => prev.filter((d) => d.id !== id));
      }
      return success;
    } catch (err) {
      setError('Failed to delete department');
      console.error('Error deleting department:', err);
      return false;
    }
  }, []);

  const stats = useMemo(() => departmentService.getDepartmentStats(departments), [departments]);

  return {
    departments,
    loading,
    error,
    stats,
    loadDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  };
};
