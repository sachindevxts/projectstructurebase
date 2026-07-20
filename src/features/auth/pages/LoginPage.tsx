import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { login } from '@/redux/actions';
import { ROUTES } from '@/constants';

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const authState = useAppSelector((state) => state.auth);
  const [form, setForm] = useState({ email: 'admin@example.com', password: 'password' });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const succeeded = await dispatch(login(form));
    if (succeeded) {
      const from =
        (location.state as { from?: { pathname?: string } } | undefined)?.from?.pathname ??
        ROUTES.DASHBOARD;
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="login-page">
      <form className="login-page__card" onSubmit={handleSubmit}>
        <h1>Welcome back</h1>
        <p>Use the demo account to continue.</p>
        <label>
          Email
          <input
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
          />
        </label>
        {authState.error ? <p className="text-error">{authState.error.message}</p> : null}
        <button type="submit" disabled={authState.isLoading}>
          {authState.isLoading ? 'Signing in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
