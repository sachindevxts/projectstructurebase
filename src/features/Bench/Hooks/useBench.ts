import { useState, useEffect, useCallback, useMemo } from 'react';
import type { BenchEmployee, BenchStats, BenchSkill } from '../Types/bench.types';
import { benchService } from '../Services/benchService';

export const useBench = () => {
  const [employees, setEmployees] = useState<BenchEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBenchEmployees = useCallback(async (isActive: () => boolean = () => true) => {
    try {
      setLoading(true);
      const data = await benchService.getBenchEmployees();
      if (!isActive()) return;
      setEmployees(data);
      setError(null);
    } catch (err) {
      if (!isActive()) return;
      setError('Failed to load bench data');
      console.error('Error loading bench data:', err);
    } finally {
      if (isActive()) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let active = true;
    void loadBenchEmployees(() => active);

    return () => {
      active = false;
    };
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
