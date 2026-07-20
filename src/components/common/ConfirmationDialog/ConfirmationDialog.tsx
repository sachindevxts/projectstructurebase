import React from 'react';
import Modal from '../Modal/Modal';
import { Button } from '../Button';
import './ConfirmationDialog.scss';

export interface ConfirmationDialogProps {
  isOpen?: boolean;
  open?: boolean;
  title?: React.ReactNode;
  message?: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger' | 'success';
  loading?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
  loading = false,
}) => {
  return (
    <Modal
      isOpen={open ?? isOpen ?? false}
      onClose={onCancel}
      title={title}
      footer={
        <div className="confirmation-dialog__actions">
          <Button variant="secondary" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button variant={confirmVariant} loading={loading} onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      }
    >
      <div>{message}</div>
    </Modal>
  );
};

export default ConfirmationDialog;
