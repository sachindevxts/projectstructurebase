import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { fetchDashboard } from '@/redux/actions';
import { CardSkeleton } from '@/components/common/Skeleton/CardSkeleton';
import { PageSkeleton } from '@/components/common/Skeleton/PageSkeleton';

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const dashboard = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    if (!dashboard.initialized) {
      dispatch(fetchDashboard());
    }
  }, [dashboard.initialized, dispatch]);

  if (dashboard.loading && !dashboard.initialized) {
    return <PageSkeleton />;
  }

  return (
    <div className="page">
      <h1>Dashboard</h1>
      {dashboard.loading ? <CardSkeleton /> : null}
      {dashboard.error ? (
        <p className="state state--error">
          {dashboard.error.message ?? 'Failed to load dashboard.'}
        </p>
      ) : null}
      {dashboard.initialized && !dashboard.error ? (
        <div className="card-grid">
          <div className="card">
            <h2>Total products</h2>
            <p>{dashboard.data.totalProducts}</p>
          </div>
          <div className="card">
            <h2>Total users</h2>
            <p>{dashboard.data.totalUsers}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
