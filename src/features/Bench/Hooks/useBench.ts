import { useState, useEffect, useCallback, useMemo } from 'react';
import type { BenchEmployee, BenchStats, BenchSkill } from '../Types/bench.types';
import { benchService } from '../Services/benchService';

export const useBench = () => {
  const [employees, setEmployees] = useState<BenchEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBenchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const data = await benchService.getBenchEmployees();
      setEmployees(data);
      setError(null);
    } catch (err) {
      setError('Failed to load bench data');
      console.error('Error loading bench data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBenchEmployees();
  }, [loadBenchEmployees]);

  const stats = useMemo(() => benchService.getBenchStats(employees), [employees]);
  const skills = useMemo(() => benchService.getBenchSkills(employees), [employees]);

  return {
    employees,
    loading,
    error,
    stats,
    skills,
    loadBenchEmployees,
  };
};
