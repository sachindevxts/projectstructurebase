import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Employee, EmployeeStats } from '../Types/employee.types';
import { employeeService } from '../Services/employeeService';

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit' | 'view' | null>(null);

  const loadEmployees = useCallback(async (isActive: () => boolean = () => true) => {
    try {
      setLoading(true);
      const data = await employeeService.getAllEmployees();
      if (!isActive()) return;
      setEmployees(data);
      setError(null);
    } catch (err) {
      if (!isActive()) return;
      setError('Failed to load employees');
      console.error('Error loading employees:', err);
    } finally {
      if (isActive()) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let active = true;
    void loadEmployees(() => active);

    return () => {
      active = false;
    };
  }, [loadEmployees]);

  const createEmployee = useCallback(async (employeeData: Omit<Employee, 'id'>) => {
    try {
      const newEmployee = await employeeService.createEmployee(employeeData);
      setEmployees((prev) => [newEmployee, ...prev]);
      return newEmployee;
    } catch (err) {
      setError('Failed to create employee');
      console.error('Error creating employee:', err);
      return null;
    }
  }, []);

  const updateEmployee = useCallback(async (id: string, updates: Partial<Employee>) => {
    try {
      const updatedEmployee = await employeeService.updateEmployee(id, updates);
      if (updatedEmployee) {
        setEmployees((prev) => prev.map((e) => (e.id === id ? updatedEmployee : e)));
      }
      return updatedEmployee;
    } catch (err) {
      setError('Failed to update employee');
      console.error('Error updating employee:', err);
      return null;
    }
  }, []);

  const deleteEmployee = useCallback(async (id: string) => {
    try {
      const success = await employeeService.deleteEmployee(id);
      if (success) {
        setEmployees((prev) => prev.filter((e) => e.id !== id));
        setSelectedRows((prev) => prev.filter((rowId) => rowId !== id));
      }
      return success;
    } catch (err) {
      setError('Failed to delete employee');
      console.error('Error deleting employee:', err);
      return false;
    }
  }, []);

  const stats = useMemo(() => employeeService.getEmployeeStats(employees), [employees]);

  const toggleSelection = useCallback((id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  }, []);

  const toggleAllSelection = useCallback((filteredIds: string[]) => {
    setSelectedRows((prev) => {
      const allSelected = filteredIds.every((id) => prev.includes(id));
      if (allSelected) {
        return prev.filter((id) => !filteredIds.includes(id));
      } else {
        return [...prev, ...filteredIds.filter((id) => !prev.includes(id))];
      }
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedRows([]);
  }, []);

  const openDialog = useCallback((mode: 'add' | 'edit' | 'view', employee?: Employee) => {
    setSelectedEmployee(employee || null);
    setDialogMode(mode);
  }, []);

  const closeDialog = useCallback(() => {
    setDialogMode(null);
    setSelectedEmployee(null);
  }, []);

  return {
    employees,
    loading,
    error,
    stats,
    selectedRows,
    selectedEmployee,
    dialogMode,
    loadEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    toggleSelection,
    toggleAllSelection,
    clearSelection,
    openDialog,
    closeDialog,
  };
};
