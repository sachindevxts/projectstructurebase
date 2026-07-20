import React, { forwardRef } from 'react';
import type { ButtonProps } from './Button.types';
import { classNames } from '../classNames';
import '../styles/_tokens.scss';
import '../styles/_mixins.scss';
import './Button.scss';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    loadingText,
    leftIcon,
    rightIcon,
    children,
    className,
    disabled,
    ...rest
  },
  ref,
) {
  const isDisabled = disabled || loading;
  const classes = classNames(
    'button',
    `button--${variant}`,
    `button--${size}`,
    fullWidth && 'button--full-width',
    loading && 'button--loading',
    className,
  );

  return (
    <button ref={ref} className={classes} disabled={isDisabled} aria-busy={loading} {...rest}>
      {loading && leftIcon ? null : leftIcon}
      {loading ? (loadingText ?? children) : children}
      {rightIcon}
    </button>
  );
});

export default Button;
