import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { AppErrorFallback } from '@/components/common/ErrorFallback/AppErrorFallback';

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return <ReactErrorBoundary FallbackComponent={AppErrorFallback}>{children}</ReactErrorBoundary>;
}
