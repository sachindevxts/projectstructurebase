import { useState } from 'react';
import { PfPageHeader } from './shared';
export default function SystemStatesPage() {
  const [toast, setToast] = useState(true);
  return (
    <div className="pf-page">
      <PfPageHeader
        title="Error, Empty & System States"
        subtitle="Design reference for all PeopleFlow HR loading, empty, error, and unauthorized states"
      />
      <h3 className="pf-section-label">FULL-PAGE ERROR STATES</h3>
      <div className="pf-state-grid">
        {[
          ['🛡', 'Access Denied', 'You don’t have permission to view this page.'],
          [
            '404',
            'Page Not Found',
            'The page you’re looking for doesn’t exist or may have been moved.',
          ],
          ['⚠', 'Something Went Wrong', 'We encountered an unexpected error. Please try again.'],
        ].map((s) => (
          <section className="pf-card pf-state">
            <strong>{s[0]}</strong>
            <h2>{s[1]}</h2>
            <p>{s[2]}</p>
            <button className="pf-button">Dashboard</button>
          </section>
        ))}
      </div>
      <h3 className="pf-section-label">EMPTY STATES</h3>
      <div className="pf-state-grid">
        {[
          ['♟', 'No Employees Yet'],
          ['↪', 'No Allocations Found'],
          ['⌕', 'No Results for “react native”'],
          ['▰', 'No Bench Employees'],
          ['▤', 'No Data for This Period'],
          ['🔒', 'Permission Required'],
        ].map((s) => (
          <section className="pf-card pf-state">
            <strong>{s[0]}</strong>
            <h2>{s[1]}</h2>
            <p>
              No matching data is currently available. Adjust your filters or create a new record.
            </p>
          </section>
        ))}
      </div>
      <h3 className="pf-section-label">INLINE ERRORS & TOAST NOTIFICATIONS</h3>
      <div className="pf-two-column">
        <section className="pf-card pf-form-card">
          <h2>Form Validation States</h2>
          <div className="pf-overallocation">● 3 errors prevented saving</div>
          <label>
            Work Email *<input className="invalid" value="invalid-email" readOnly />
            <small className="error">Enter a valid email address</small>
          </label>
          <label>
            First Name
            <input className="valid" value="Aditi" readOnly />
            <small className="success">Looks good!</small>
          </label>
        </section>
        <section className="pf-card">
          <h2>Toast Notifications</h2>
          {toast && (
            <div className="pf-toast success">
              <b>✓ Allocation Created</b>
              <span>Aditi Mehra has been allocated to NovaBank Portal at 70%.</span>
              <button onClick={() => setToast(false)}>×</button>
            </div>
          )}
          <div className="pf-toast warning">
            <b>⚠ Allocation Extended</b>
            <span>Release date moved to Sep 15.</span>
          </div>
          <div className="pf-toast danger">
            <b>● Save Failed</b>
            <span>Could not save employee record.</span>
          </div>
        </section>
      </div>
    </div>
  );
}
