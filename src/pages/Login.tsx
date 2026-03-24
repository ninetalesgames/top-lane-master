import { useState } from 'react';
import logo from '../assets/logo.png';

type LoginPageProps = {
  isAnonymous: boolean;
  userEmail: string | null;
  authBusy: boolean;
  onBack: () => void;
  onGoogleSignIn: () => void;
  onEmailSignUp: (email: string, password: string) => void;
  onEmailLogIn: (email: string, password: string) => void;
  onSignOut: () => void;
};

export default function LoginPage({
  isAnonymous,
  userEmail,
  authBusy,
  onBack,
  onGoogleSignIn,
  onEmailSignUp,
  onEmailLogIn,
  onSignOut
}: LoginPageProps) {
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      return;
    }

    if (mode === 'signup') {
      onEmailSignUp(cleanEmail, cleanPassword);
    } else {
      onEmailLogIn(cleanEmail, cleanPassword);
    }
  };

  return (
    <div className="page-shell opponent-page">
      <header className="app-header">
        <div className="header-left">
          <button className="logo-button" onClick={onBack}>
            <img src={logo} alt="Home" className="app-logo" />
          </button>

          <div>
            <p className="page-subtitle">Account • Save your notes</p>
          </div>
        </div>

        <button className="secondary-button small-button" onClick={onBack}>
          Back to Landing
        </button>
      </header>

      <main className="content-width matchup-layout">
        <section className="panel-card matchup-hero-card">
          <div className="matchup-hero-top">
            <div>
              <span className="section-label">Account</span>
              <h1 className="page-title">Save your notes</h1>
              <p className="page-description">
                Keep your matchup notes safe and access them again later from the same account.
              </p>
            </div>
          </div>
        </section>

        <section className="notes-grid">
          <article className="panel-card note-block">
            <h3>Quickest option</h3>
            <p className="page-description" style={{ marginBottom: '1rem' }}>
              Use Google to save this guest account instantly.
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={onGoogleSignIn}
              disabled={authBusy}
            >
              Continue with Google
            </button>
          </article>

          <article className="panel-card note-block">
            <h3>Email account</h3>

            <div className="mode-toggle" style={{ marginBottom: '1rem' }}>
              <button
                type="button"
                className={`mode-button ${mode === 'signup' ? 'mode-button-active' : ''}`}
                onClick={() => setMode('signup')}
              >
                Create Account
              </button>
              <button
                type="button"
                className={`mode-button ${mode === 'login' ? 'mode-button-active' : ''}`}
                onClick={() => setMode('login')}
              >
                Log In
              </button>
            </div>

            <div
              style={{
                display: 'grid',
                gap: '0.85rem'
              }}
            >
              <input
                type="email"
                className="champion-search"
                placeholder="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={authBusy}
              />

              <input
                type="password"
                className="champion-search"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={authBusy}
              />

              <button
                type="button"
                className="primary-button"
                onClick={handleSubmit}
                disabled={authBusy}
              >
                {mode === 'signup' ? 'Create with Email' : 'Log In with Email'}
              </button>
            </div>
          </article>

          <article className="panel-card note-block note-block-full">
            <h3>Current account</h3>

            {userEmail ? (
              <>
                <p className="page-description" style={{ marginBottom: '1rem' }}>
                  Signed in as <strong>{userEmail}</strong>
                </p>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={onSignOut}
                  disabled={authBusy}
                >
                  Sign Out
                </button>
              </>
            ) : isAnonymous ? (
              <p className="page-description">
                You are currently using a guest account. Creating or linking an account now will
                keep your notes tied to this same profile.
              </p>
            ) : (
              <p className="page-description">No account detected.</p>
            )}
          </article>
        </section>
      </main>
    </div>
  );
}