import type React from 'react';

export type ModalSize = 'sm' | 'md' | 'lg' | 'full';

export interface ModalProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  isOpen: boolean;
  onClose: () => void;
  size?: ModalSize;
  title?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}
