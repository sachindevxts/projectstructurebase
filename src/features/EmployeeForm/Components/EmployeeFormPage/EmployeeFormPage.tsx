import React, { useCallback } from 'react';
import { Alert, Box, Button, Paper, Stack } from '@mui/material';
import { NavigateNext, Save as SaveIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { PageSkeleton } from '@/components/common/Skeleton/PageSkeleton';
import { PfPageHeader } from '@/features/Shared/Components/PfPageHeader/PfPageHeader';
import { EMPLOYEE_FORM_STEPS } from '../../constants/employeeForm.constants';
import { useEmployeeForm } from '../../hooks/useEmployeeForm';
import { EmploymentInfo } from '../EmploymentInfo/EmploymentInfo';
import { FormStepper } from '../FormStepper/FormStepper';
import { PersonalInfo } from '../PersonalInfo/PersonalInfo';
import { ProfessionalInfo } from '../ProfessionalInfo/ProfessionalInfo';
import styles from './EmployeeFormPage.module.scss';

export const EmployeeFormPage = () => {
  const navigate = useNavigate();
  const { employeeId } = useParams();
  const isEditMode = Boolean(employeeId);
  const {
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
  } = useEmployeeForm(employeeId);

  const handleSave = useCallback(async () => {
    const result = await saveEmployee();
    if (result) navigate('/employees');
  }, [navigate, saveEmployee]);

  const renderStep = () => {
    if (activeStep === 0) return <PersonalInfo values={values} onChange={updateField} />;
    if (activeStep === 1) return <EmploymentInfo values={values} onChange={updateField} />;
    return <ProfessionalInfo values={values} onChange={updateField} />;
  };

  if (loading) return <PageSkeleton />;

  return (
    <Box className={styles.page}>
      <PfPageHeader
        title={isEditMode ? 'Edit Employee' : 'Add Employee'}
        subtitle={
          isEditMode
            ? 'Update employee profile, employment, and allocation details.'
            : 'Create employee profile, employment, and allocation details.'
        }
      >
        <Button variant="outlined" onClick={() => navigate('/employees')}>Cancel</Button>
        <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : isEditMode ? 'Update Employee' : 'Save Employee'}
        </Button>
      </PfPageHeader>

      <Paper elevation={0} className={styles.formShell}>
        <FormStepper activeStep={activeStep} onStepChange={setActiveStep} />
        <Stack spacing={2}>
          {errors.map((error) => <Alert severity="error" key={error}>{error}</Alert>)}
          {renderStep()}
        </Stack>
        <Stack direction="row" spacing={1} justifyContent="space-between" className={styles.actions}>
          <Button onClick={previousStep} disabled={activeStep === 0}>Back</Button>
          {activeStep < EMPLOYEE_FORM_STEPS.length - 1 ? (
            <Button variant="contained" endIcon={<NavigateNext />} onClick={nextStep}>Next</Button>
          ) : (
            <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : isEditMode ? 'Update Employee' : 'Save Employee'}
            </Button>
          )}
        </Stack>
      </Paper>
    </Box>
  );
};

export default EmployeeFormPage;

