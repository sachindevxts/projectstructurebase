import { useCallback, useState } from 'react';
import { INITIAL_EMPLOYEE_FORM } from '../constants/employeeForm.constants';
import { employeeFormService } from '../services/employeeFormService';
import type { EmployeeFormValues } from '../types/employeeForm.types';

export const useEmployeeForm = (initialValues?: Partial<EmployeeFormValues>) => {
  const [values, setValues] = useState<EmployeeFormValues>({ ...INITIAL_EMPLOYEE_FORM, ...initialValues });
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

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
      return employeeFormService.save(values);
    } finally {
      setSaving(false);
    }
  }, [values]);

  return { values, activeStep, errors, saving, updateField, setActiveStep, nextStep, previousStep, saveEmployee };
};
