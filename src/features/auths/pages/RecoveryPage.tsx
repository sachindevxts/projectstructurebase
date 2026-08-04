import { Link, useLocation } from 'react-router-dom';
export default function RecoveryPage() {
  const reset = useLocation().pathname.includes('reset');
  return (
    <div className="pf-recovery">
      <form className="pf-card">
        <div className="pf-login__brand">
          <span>♟</span> PeopleFlow HR
        </div>
        <h1>{reset ? 'Reset password' : 'Forgot password?'}</h1>
        <p>
          {reset
            ? 'Choose a strong new password for your account.'
            : 'Enter your work email and we’ll send password reset instructions.'}
        </p>
        <label>
          Work Email
          <input defaultValue="admin@acmecorp.com" />
        </label>
        {reset && (
          <>
            <label>
              New Password
              <input type="password" />
            </label>
            <label>
              Confirm Password
              <input type="password" />
            </label>
          </>
        )}
        <button className="pf-button">{reset ? 'Reset Password' : 'Send Reset Link'}</button>
        <Link to="/login">← Back to sign in</Link>
      </form>
    </div>
  );
}
