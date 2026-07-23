import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PfPageHeader } from './shared';
const steps = ['Personal Info', 'Employment', 'Professional'];
export default function EmployeeFormPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('meera.nair@');
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [profileName, setProfileName] = useState('');
  const [showWarning, setShowWarning] = useState(true);
  const handleProfileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (profilePreview) URL.revokeObjectURL(profilePreview);
    setProfilePreview(URL.createObjectURL(file));
    setProfileName(file.name);
  };
  const removeProfile = () => {
    if (profilePreview) URL.revokeObjectURL(profilePreview);
    setProfilePreview(null);
    setProfileName('');
  };
  return (
    <div className="pf-form-page">
      <aside className="pf-stepper">
        <h3>FORM SECTIONS</h3>
        {steps.map((label, index) => (
          <button
            className={step === index ? 'active' : index < step ? 'done' : ''}
            onClick={() => setStep(index)}
            key={label}
          >
            <span>{index + 1}</span>
            {label}
          </button>
        ))}
      </aside>
      <main className="pf-form-main">
        <PfPageHeader title="Add Employee" subtitle={`Step ${step + 1} of 3 — ${steps[step]}`} />
        {showWarning && (
          <div className="pf-form-warning" role="alert">
            <span aria-hidden="true">!</span>
            <p>You have unsaved changes. Navigate away or close to discard them.</p>
            <button
              type="button"
              aria-label="Dismiss warning"
              onClick={() => setShowWarning(false)}
            >
              ×
            </button>
          </div>
        )}
        <section className="pf-card pf-form-card">
          <h2>
            {step === 0
              ? 'Personal Information'
              : step === 1
                ? 'Employment Information'
                : 'Professional Information'}
          </h2>
          <p>
            {step === 0
              ? 'Basic identity and contact details of the employee.'
              : step === 1
                ? 'Role, department, and work arrangement details.'
                : 'Skills, experience, and professional profiles.'}
          </p>
          {step === 0 && (
            <div className="pf-form-grid">
              <div className="pf-profile-upload wide">
                <div className={`pf-profile-upload__preview${profilePreview ? ' has-image' : ''}`}>
                  {profilePreview ? (
                    <img src={profilePreview} alt="Selected employee profile preview" />
                  ) : (
                    <span aria-hidden="true">
                      ♟<b>+</b>
                    </span>
                  )}
                </div>
                <div className="pf-profile-upload__details">
                  <strong>Profile Photo</strong>
                  <small>{profileName || 'JPG, PNG up to 2MB'}</small>
                  <div>
                    <label className="pf-profile-upload__button">
                      {profilePreview ? 'Change Photo' : 'Upload Photo'}
                      <input
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={handleProfileChange}
                      />
                    </label>
                    {profilePreview && (
                      <button
                        type="button"
                        className="pf-profile-upload__remove"
                        onClick={removeProfile}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <label>
                First Name *<input defaultValue="Meera" />
              </label>
              <label>
                Last Name *<input defaultValue="Nair" />
              </label>
              <label>
                Work Email *
                <input
                  className="invalid"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <small className="error">● Enter a valid work email address</small>
              </label>
              <label>
                Personal Email
                <input placeholder="personal@gmail.com" />
              </label>
              <label>
                Phone
                <input placeholder="+91 98765 43210" />
              </label>
              <label>
                Date of Birth
                <input type="date" />
              </label>
              <label>
                Gender
                <select>
                  <option>Female</option>
                </select>
              </label>
              <label>
                Address
                <input placeholder="City, State" />
              </label>
              <label>
                Emergency Contact Name
                <input placeholder="Full name" />
              </label>
              <label>
                Emergency Contact Number
                <input placeholder="+91 99999 00000" />
              </label>
            </div>
          )}
          {step === 1 && (
            <div className="pf-form-grid">
              {[
                ['Employee ID', 'EMP-248'],
                ['Department', 'Engineering'],
                ['Designation', 'React Developer'],
                ['Reporting Manager', 'Arjun Kapoor'],
                ['HR Manager', 'Preeti Agarwal'],
                ['Employment Type', 'Full-Time'],
                ['Work Mode', 'Hybrid'],
                ['Location', 'Bangalore, India'],
                ['Joining Date', '2025-07-14'],
                ['Probation End Date', '2026-01-14'],
                ['Notice Period', '30 days'],
                ['Employee Status', 'Active'],
              ].map(([label, value]) => (
                <label key={label}>
                  {label}
                  <input defaultValue={value} />
                </label>
              ))}
            </div>
          )}
          {step === 2 && (
            <div className="pf-form-grid">
              <label>
                Total Experience
                <input placeholder="e.g. 4 years 2 months" />
              </label>
              <label>
                Relevant Experience
                <input placeholder="e.g. 3 years" />
              </label>
              <label>
                Primary Skill *
                <select>
                  <option>React.js</option>
                </select>
              </label>
              <label>
                Skill Level
                <select>
                  <option>Advanced</option>
                </select>
              </label>
              <label className="wide">
                Secondary Skills
                <div className="pf-chip-input">TypeScript　 Redux　 Tailwind CSS</div>
              </label>
              <label>
                LinkedIn URL
                <input placeholder="https://linkedin.com/in/..." />
              </label>
              <label>
                GitHub URL
                <input placeholder="https://github.com/..." />
              </label>
              <div className="pf-upload wide">
                ⬆<strong>Drag & drop resume here or browse files</strong>
                <small>PDF, DOCX up to 5MB</small>
              </div>
            </div>
          )}
        </section>
      </main>
      <footer className="pf-sticky-footer">
        <span>ⓘ All fields marked * are required.</span>
        <button className="pf-button pf-button--ghost" onClick={() => navigate('/employees')}>
          Cancel
        </button>
        {step > 0 && (
          <button className="pf-button pf-button--ghost" onClick={() => setStep(step - 1)}>
            Back
          </button>
        )}
        <button className="pf-button pf-button--ghost" type="button">
          Save & Add Another
        </button>
        <button
          className="pf-button"
          onClick={() => (step < 2 ? setStep(step + 1) : navigate('/employees'))}
        >
          {step < 2 ? `Next: ${steps[step + 1]} →` : 'Save Employee'}
        </button>
      </footer>
    </div>
  );
}
