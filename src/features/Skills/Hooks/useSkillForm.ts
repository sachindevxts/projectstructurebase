import { useState, useCallback } from 'react';
import type { Skill } from '../types/skill.types';
import { DEFAULT_SKILL_FORM_VALUES } from '../constants/skill.constants';

interface SkillFormData {
  name: string;
  category: string;
  proficiency: string;
  demand: string;
  aliases: string;
  description: string;
  designations: string;
  active: string;
  status: string;
}

export const useSkillForm = (initialData?: Partial<SkillFormData>) => {
  const [formData, setFormData] = useState<SkillFormData>(() => ({
    ...DEFAULT_SKILL_FORM_VALUES,
    ...initialData,
    name: initialData?.name || '',
    aliases: initialData?.aliases || '',
    description: initialData?.description || '',
    designations: initialData?.designations || '',
  }));
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = useCallback(<K extends keyof SkillFormData>(
    field: K,
    value: SkillFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Skill name is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData({
      ...DEFAULT_SKILL_FORM_VALUES,
      name: '',
      aliases: '',
      description: '',
      designations: '',
    });
    setErrors({});
    setIsSubmitting(false);
  }, []);

  const populateForm = useCallback((skill: Skill) => {
    setFormData({
      category: skill.category,
      proficiency: DEFAULT_SKILL_FORM_VALUES.proficiency,
      demand: skill.demand,
      status: skill.status,
      active: skill.status === 'Active' ? 'true' : 'false',
      name: skill.name,
      aliases: Array.isArray(skill.aliases) ? skill.aliases.join(', ') : skill.aliases || '',
      description: skill.description || '',
      designations: Array.isArray(skill.designations) 
        ? skill.designations.join('|') 
        : skill.designations || '',
    });
    setErrors({});
    setIsSubmitting(false);
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    updateField,
    validateForm,
    resetForm,
    populateForm,
    setIsSubmitting,
  };
};