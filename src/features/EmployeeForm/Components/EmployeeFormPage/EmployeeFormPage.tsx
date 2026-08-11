import React, { useCallback } from 'react';
import { Alert, Box, Button, Paper, Stack } from '@mui/material';
import { NavigateNext, Save as SaveIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
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
  const { values, activeStep, errors, saving, updateField, setActiveStep, nextStep, previousStep, saveEmployee } = useEmployeeForm();

  const handleSave = useCallback(async () => {
    const result = await saveEmployee();
    if (result) navigate('/employees');
  }, [navigate, saveEmployee]);

  const renderStep = () => {
    if (activeStep === 0) return <PersonalInfo values={values} onChange={updateField} />;
    if (activeStep === 1) return <EmploymentInfo values={values} onChange={updateField} />;
    return <ProfessionalInfo values={values} onChange={updateField} />;
  };

  return (
    <Box className={styles.page}>
      <PfPageHeader title="Employee Form" subtitle="Create or edit employee profile, employment, and allocation details.">
        <Button variant="outlined" onClick={() => navigate('/employees')}>Cancel</Button>
        <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} disabled={saving}>Save Employee</Button>
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
            <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} disabled={saving}>Save Employee</Button>
          )}
        </Stack>
      </Paper>
    </Box>
  );
};

export default EmployeeFormPage;

