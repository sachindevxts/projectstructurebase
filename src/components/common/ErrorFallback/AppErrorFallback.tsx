import { useNavigate } from 'react-router-dom';

export function AppErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  const navigate = useNavigate();
  return (
    <div className="error-fallback" role="alert">
      <h1>Something went wrong</h1>
      <p>We could not render this part of the app. Please try again.</p>
      <div className="error-fallback__actions">
        <button onClick={resetErrorBoundary}>Try again</button>
        <button onClick={() => navigate('/')}>Go home</button>
      </div>
    </div>
  );
}
