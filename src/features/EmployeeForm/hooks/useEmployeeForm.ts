import { useCallback, useEffect, useState } from 'react';
import { INITIAL_EMPLOYEE_FORM } from '../constants/employeeForm.constants';
import { employeeFormService } from '../services/employeeFormService';
import type { EmployeeFormValues } from '../types/employeeForm.types';

export const useEmployeeForm = (
  employeeId?: string,
  initialValues?: Partial<EmployeeFormValues>,
) => {
  const [values, setValues] = useState<EmployeeFormValues>({ ...INITIAL_EMPLOYEE_FORM, ...initialValues });
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(Boolean(employeeId));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!employeeId) return;
    let active = true;

    const loadEmployee = async () => {
      try {
        setLoading(true);
        const employee = await employeeFormService.getEmployee(employeeId);
        if (!active) return;
        if (employee) {
          setValues({ ...INITIAL_EMPLOYEE_FORM, ...employee });
          setErrors([]);
        } else {
          setErrors(['Employee not found']);
        }
      } catch {
        if (active) setErrors(['Failed to load employee']);
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadEmployee();

    return () => {
      active = false;
    };
  }, [employeeId]);

  const updateField = useCallback(<K extends keyof EmployeeFormValues>(key: K, value: EmployeeFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const nextStep = useCallback(() => setActiveStep((step) => Math.min(step + 1, 2)), []);
  const previousStep = useCallback(() => setActiveStep((step) => Math.max(step - 1, 0)), []);

  const saveEmployee = useCallback(async () => {
    const validationErrors = employeeFormService.validate(values);
    setErrors(validationErrors);
    if (validationErrors.length) return null;

    try {
      setSaving(true);
      return employeeFormService.save(values, employeeId);
    } finally {
      setSaving(false);
    }
  }, [employeeId, values]);

  return {
    values,
    activeStep,
    errors,
    loading,
    saving,
    updateField,
    setActiveStep,
    nextStep,
    previousStep,
    saveEmployee,
  };
};
