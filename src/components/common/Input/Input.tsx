import React, { forwardRef } from 'react';
import type { InputProps } from './Input.types';
import { classNames } from '../classNames';
import '../styles/_tokens.scss';
import './Input.scss';

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, helperText, error = null, size = 'md', status = 'default', className, ...rest },
  ref,
) {
  const classes = classNames('input', `input--${size}`, error ? 'input--error' : null, className);
  const describedBy = error ? 'error-text' : helperText ? 'helper-text' : undefined;

  return (
    <div className="form-field">
      {label ? <label className="label">{label}</label> : null}
      <input
        ref={ref}
        className={classes}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        {...rest}
      />
      {helperText ? (
        <div id="helper-text" className="helper">
          {helperText}
        </div>
      ) : null}
      {error ? (
        <div id="error-text" className="error-text">
          {error}
        </div>
      ) : null}
    </div>
  );
});

export default Input;
