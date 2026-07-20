import type React from 'react';

export type FieldSize = 'sm' | 'md' | 'lg';
export type FieldStatus = 'default' | 'error' | 'success' | 'warning';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  name?: string;
  helperText?: string;
  error?: string | null;
  size?: FieldSize;
  status?: FieldStatus;
}
