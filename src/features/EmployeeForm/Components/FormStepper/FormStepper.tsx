import React from 'react';
import { Step, StepLabel, Stepper } from '@mui/material';
import { EMPLOYEE_FORM_STEPS } from '../../constants/employeeForm.constants';
import styles from './FormStepper.module.scss';

interface FormStepperProps {
  activeStep: number;
  onStepChange: (step: number) => void;
}

export const FormStepper = ({ activeStep, onStepChange }: FormStepperProps) => (
  <Stepper activeStep={activeStep} alternativeLabel className={styles.stepper}>
    {EMPLOYEE_FORM_STEPS.map((step, index) => (
      <Step key={step.label} onClick={() => onStepChange(index)} className={styles.step}>
        <StepLabel>{step.label}</StepLabel>
      </Step>
    ))}
  </Stepper>
);
