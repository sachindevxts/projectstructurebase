import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';
import { classNames } from './classNames';
import './primitives.scss';

export type FieldSize = 'sm' | 'md' | 'lg';
export type FieldStatus = 'default' | 'error' | 'success' | 'warning';
type FieldMeta = {
  label?: string;
  helperText?: string;
  error?: string;
  status?: FieldStatus;
  fieldSize?: FieldSize;
  fullWidth?: boolean;
};

export const FormField = ({
  label,
  helperText,
  error,
  required,
  children,
  className,
}: FieldMeta & { required?: boolean; children: ReactNode; className?: string }) => {
  const id = useId();
  return (
    <div className={classNames('ds-field', className)}>
      <div className="ds-field__label">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </div>
      {children}
      {error ? (
        <div id={`${id}-error`} role="alert" className="ds-field__error">
          {error}
        </div>
      ) : helperText ? (
        <div className="ds-field__helper">{helperText}</div>
      ) : null}
    </div>
  );
};

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement> & FieldMeta
>(({ label, helperText, error, fieldSize = 'md', fullWidth, className, ...props }, ref) => (
  <FormField label={label} helperText={helperText} error={error} required={props.required}>
    <textarea
      ref={ref}
      aria-invalid={!!error}
      className={classNames(
        'ds-control',
        `ds-control--${fieldSize}`,
        fullWidth && 'ds-control--full',
        className,
      )}
      {...props}
    />
  </FormField>
));
Textarea.displayName = 'Textarea';

export const PasswordInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & FieldMeta
>(({ label, helperText, error, fieldSize = 'md', className, ...props }, ref) => {
  const [shown, setShown] = useState(false);
  return (
    <FormField label={label} helperText={helperText} error={error} required={props.required}>
      <div className="ds-input-wrap">
        <input
          ref={ref}
          type={shown ? 'text' : 'password'}
          aria-invalid={!!error}
          className={classNames('ds-control', `ds-control--${fieldSize}`, className)}
          {...props}
        />
        <button
          type="button"
          className="ds-input-action"
          aria-label={shown ? 'Hide password' : 'Show password'}
          onClick={() => setShown(!shown)}
        >
          {shown ? 'Hide' : 'Show'}
        </button>
      </div>
    </FormField>
  );
});
PasswordInput.displayName = 'PasswordInput';

export const SearchInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & FieldMeta
>(({ className, ...props }, ref) => (
  <div className="ds-input-wrap">
    <span aria-hidden="true" className="ds-search-icon">
      ⌕
    </span>
    <input
      ref={ref}
      type="search"
      className={classNames('ds-control', 'ds-control--search', className)}
      {...props}
    />
  </div>
));
SearchInput.displayName = 'SearchInput';

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement> &
    FieldMeta & { options?: Array<{ label: string; value: string | number }> }
>(({ label, helperText, error, options = [], className, ...props }, ref) => (
  <FormField label={label} helperText={helperText} error={error} required={props.required}>
    <select
      ref={ref}
      aria-invalid={!!error}
      className={classNames('ds-control', className)}
      {...props}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </FormField>
));
Select.displayName = 'Select';

const Choice = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { label?: ReactNode }
>(({ label, className, type = 'checkbox', ...props }, ref) => (
  <label className={classNames('ds-choice', className)}>
    <input ref={ref} type={type} {...props} />
    <span>{label}</span>
  </label>
));
Choice.displayName = 'Choice';
export const Checkbox = Choice;
export const Radio = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { label?: ReactNode }
>((p, r) => <Choice {...p} type="radio" ref={r} />);
Radio.displayName = 'Radio';
export const Switch = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & {
    label?: ReactNode;
    checkedIcon?: ReactNode;
    uncheckedIcon?: ReactNode;
  }
>(({ label, checkedIcon, uncheckedIcon, className, ...p }, r) => (
  <label className={classNames('ds-switch', className)}>
    <input ref={r} type="checkbox" role="switch" {...p} />
    <span className="ds-switch__track" aria-hidden="true">
      <span className="ds-switch__thumb">
        <span className="ds-switch__icon ds-switch__icon--unchecked">{uncheckedIcon}</span>
        <span className="ds-switch__icon ds-switch__icon--checked">{checkedIcon}</span>
      </span>
    </span>
    <span>{label}</span>
  </label>
));
Switch.displayName = 'Switch';

export type StatusVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
export const Badge = ({
  variant = 'default',
  className,
  ...p
}: HTMLAttributes<HTMLSpanElement> & { variant?: StatusVariant }) => (
  <span className={classNames('ds-badge', `ds-badge--${variant}`, className)} {...p} />
);
export const Chip = ({
  onRemove,
  ...p
}: HTMLAttributes<HTMLSpanElement> & { onRemove?: () => void }) => (
  <span className="ds-chip" {...p}>
    {p.children}
    {onRemove && (
      <button type="button" aria-label="Remove" onClick={onRemove}>
        ×
      </button>
    )}
  </span>
);
export const Alert = ({
  variant = 'info',
  title,
  dismissible,
  onDismiss,
  children,
  className,
  ...p
}: HTMLAttributes<HTMLDivElement> & {
  variant?: Exclude<StatusVariant, 'default' | 'primary'>;
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}) => (
  <div role="alert" className={classNames('ds-alert', `ds-alert--${variant}`, className)} {...p}>
    <div>
      <strong>{title}</strong>
      {children && <div>{children}</div>}
    </div>
    {dismissible && (
      <button type="button" aria-label="Dismiss" onClick={onDismiss}>
        ×
      </button>
    )}
  </div>
);
export const Divider = (p: HTMLAttributes<HTMLHRElement>) => <hr className="ds-divider" {...p} />;
export const Avatar = ({
  src,
  alt = '',
  name,
  size = 'md',
}: {
  src?: string;
  alt?: string;
  name?: string;
  size?: FieldSize;
}) => (
  <span className={classNames('ds-avatar', `ds-avatar--${size}`)}>
    {src ? (
      <img src={src} alt={alt} />
    ) : (
      <span aria-label={name}>
        {name
          ?.split(' ')
          .map((x) => x[0])
          .slice(0, 2)
          .join('')}
      </span>
    )}
  </span>
);
export const Loader = ({ label = 'Loading' }: { label?: string }) => (
  <span className="ds-loader" role="status">
    <span aria-hidden="true" />
    <span className="sr-only">{label}</span>
  </span>
);
export const Skeleton = ({ className, ...p }: HTMLAttributes<HTMLDivElement>) => (
  <div aria-hidden="true" className={classNames('ds-skeleton', className)} {...p} />
);
export const TableSkeleton = ({ columns = 4, rows = 5 }: { columns?: number; rows?: number }) => (
  <div aria-label="Loading table" role="status">
    {Array.from({ length: rows }, (_, r) => (
      <div className="ds-skeleton-row" key={r}>
        {Array.from({ length: columns }, (_, c) => (
          <Skeleton key={c} />
        ))}
      </div>
    ))}
  </div>
);
export const ListSkeleton = ({ items = 5 }: { items?: number }) => (
  <>
    {Array.from({ length: items }, (_, i) => (
      <Skeleton className="ds-skeleton--line" key={i} />
    ))}
  </>
);
export const FormSkeleton = () => (
  <div className="ds-stack">
    <Skeleton />
    <Skeleton />
    <Skeleton />
  </div>
);
export const EmptyState = ({
  title = 'Nothing here',
  description,
  action,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) => (
  <div className="ds-state">
    <h3>{title}</h3>
    {description && <p>{description}</p>}
    {action}
  </div>
);
export const ErrorState = ({
  title = 'Something went wrong',
  message,
  retry,
}: {
  title?: string;
  message?: string;
  retry?: () => void;
}) => (
  <div role="alert" className="ds-state ds-state--error">
    <h3>{title}</h3>
    {message && <p>{message}</p>}
    {retry && (
      <button type="button" onClick={retry}>
        Try again
      </button>
    )}
  </div>
);
export const PageHeader = ({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) => (
  <header className="ds-page-header">
    <div>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
    {actions && <div>{actions}</div>}
  </header>
);
export const Breadcrumb = ({ items }: { items: Array<{ label: string; href?: string }> }) => (
  <nav aria-label="Breadcrumb">
    <ol className="ds-breadcrumb">
      {items.map((x, i) => (
        <li key={`${x.label}-${i}`}>
          {x.href && i < items.length - 1 ? (
            <a href={x.href}>{x.label}</a>
          ) : (
            <span aria-current={i === items.length - 1 ? 'page' : undefined}>{x.label}</span>
          )}
        </li>
      ))}
    </ol>
  </nav>
);
export const Tooltip = ({ content, children }: { content: ReactNode; children: ReactNode }) => (
  <span className="ds-tooltip" tabIndex={0}>
    {children}
    <span role="tooltip">{content}</span>
  </span>
);
export const IconButton = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { 'aria-label': string }
>(({ className, ...p }, r) => (
  <button ref={r} type="button" className={classNames('ds-icon-button', className)} {...p} />
));
IconButton.displayName = 'IconButton';

export const Pagination = ({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) => (
  <nav aria-label="Pagination" className="ds-pagination">
    <button type="button" disabled={page <= 1} onClick={() => onChange(page - 1)}>
      Previous
    </button>
    <span>
      Page {page} of {totalPages}
    </span>
    <button type="button" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
      Next
    </button>
  </nav>
);
export const Tabs = ({
  tabs,
  active,
  onChange,
}: {
  tabs: Array<{ id: string; label: string; content: ReactNode }>;
  active: string;
  onChange: (id: string) => void;
}) => (
  <div>
    <div role="tablist" className="ds-tabs">
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={active === t.id}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
    {tabs.map(
      (t) =>
        active === t.id && (
          <div role="tabpanel" key={t.id}>
            {t.content}
          </div>
        ),
    )}
  </div>
);
export const Accordion = ({ items }: { items: Array<{ title: string; content: ReactNode }> }) => (
  <div className="ds-accordion">
    {items.map((x, i) => (
      <details key={i}>
        <summary>{x.title}</summary>
        <div>{x.content}</div>
      </details>
    ))}
  </div>
);
export const Dropdown = ({ trigger, children }: { trigger: ReactNode; children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="ds-dropdown">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {trigger}
      </button>
      {open && (
        <div role="menu" className="ds-dropdown__menu">
          {children}
        </div>
      )}
    </div>
  );
};

function useOverlay(
  open: boolean,
  onClose: () => void,
  container: React.RefObject<HTMLDivElement | null>,
) {
  useEffect(() => {
    if (!open) return;
    const before = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const nodes = container.current?.querySelectorAll<HTMLElement>(
          'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])',
        );
        if (!nodes?.length) return;
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', key);
    container.current?.focus();
    return () => {
      document.body.style.overflow = before;
      document.removeEventListener('keydown', key);
    };
  }, [open, onClose, container]);
}
export const Drawer = ({
  open,
  onClose,
  title,
  children,
  side = 'right',
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  side?: 'left' | 'right';
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useOverlay(open, onClose, ref);
  if (!open) return null;
  return (
    <div className="ds-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <aside
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={classNames('ds-drawer', `ds-drawer--${side}`)}
      >
        <header>
          <h2>{title}</h2>
          <button aria-label="Close" onClick={onClose}>
            ×
          </button>
        </header>
        {children}
      </aside>
    </div>
  );
};
