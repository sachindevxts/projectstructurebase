import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@acmecorp.com');
  const [password, setPassword] = useState('PeopleFlow1!');
  const [busy, setBusy] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    window.setTimeout(() => navigate('/dashboard'), 500);
  };
  return (
    <div className="pf-login">
      <section className="pf-login__hero">
        <div className="pf-login__brand">
          <span>♟</span> PeopleFlow HR
        </div>
        <div>
          <h1>
            Manage people, projects, capacity,
            <br />
            and utilization from one platform.
          </h1>
          <p>
            The workforce operations suite trusted by 1,200+ companies to keep teams staffed,
            billable, and moving.
          </p>
          <ul>
            <li>◉ Real-time resource allocation visibility</li>
            <li>▣ Project staffing & bench tracking</li>
            <li>$ Billability & utilization insights</li>
          </ul>
        </div>
        <small>© 2026 PeopleFlow HR Inc. All rights reserved.</small>
      </section>
      <section className="pf-login__form">
        <div className="pf-login__support">
          Need help?　<a>Contact Support</a>
        </div>
        <form onSubmit={submit}>
          <h1>Welcome back</h1>
          <p>Sign in to your account</p>
          <label>
            Work Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <div className="pf-login__options">
            <div>
              <input type="checkbox" defaultChecked />
              <label>Remember me</label>
            </div>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
          <button className="pf-button" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
          <div className="pf-login__divider">OR CONTINUE WITH</div>
          <div className="pf-login__social">
            <button type="button">Google</button>
            <button type="button">Microsoft</button>
          </div>
          <p className="center">
            Don’t have an account? <a>Request access</a>
          </p>
        </form>
      </section>
    </div>
  );
}
