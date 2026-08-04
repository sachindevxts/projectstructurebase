import { useCallback, useMemo, useState } from 'react';
import { INITIAL_ALLOCATION_FORM } from '../constants/allocationForm.constants';
import { allocationFormService } from '../services/allocationFormService';
import type { AllocationFormValues } from '../types/allocationForm.types';

export const useAllocationForm = (initialValues?: Partial<AllocationFormValues>) => {
  const [values, setValues] = useState<AllocationFormValues>({ ...INITIAL_ALLOCATION_FORM, ...initialValues });
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const employees = useMemo(() => allocationFormService.getEmployees(), []);
  const projects = useMemo(() => allocationFormService.getProjects(), []);
  const capacityPreview = useMemo(() => allocationFormService.getCapacityPreview(values), [values]);

  const updateField = useCallback(<K extends keyof AllocationFormValues>(key: K, value: AllocationFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const saveAllocation = useCallback(async () => {
    const validationErrors = allocationFormService.validate(values);
    setErrors(validationErrors);
    if (validationErrors.length) return null;

    try {
      setSaving(true);
      return allocationFormService.save(values);
    } finally {
      setSaving(false);
    }
  }, [values]);

  return { values, errors, saving, employees, projects, capacityPreview, updateField, saveAllocation };
};
