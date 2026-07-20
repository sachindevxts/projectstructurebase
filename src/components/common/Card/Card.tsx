import React, { forwardRef } from 'react';
import type { CardProps } from './Card.types';
import { classNames } from '../classNames';
import '../styles/_tokens.scss';
import './Card.scss';

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    variant = 'default',
    padding = 'md',
    loading = false,
    selected = false,
    className,
    children,
    ...rest
  },
  ref,
) {
  const classes = classNames(
    'card',
    `card--${variant}`,
    `card--padding-${padding}`,
    selected && 'card--selected',
    className,
  );

  return (
    <div ref={ref} className={classes} {...rest} aria-busy={loading}>
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => (
  <div className={classNames('card-header', className)} {...rest}>
    {children}
  </div>
);

export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => (
  <div className={classNames('card-body', className)} {...rest}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => (
  <div className={classNames('card-footer', className)} {...rest}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...rest
}) => (
  <h3 className={classNames('card-title', className)} {...rest}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => (
  <div className={classNames('card-description', className)} {...rest}>
    {children}
  </div>
);

export default Card;
