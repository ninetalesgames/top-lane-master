import logo from '../assets/logo.png';

type AccountPageProps = {
  userEmail: string | null;
  isAnonymous: boolean;
  authBusy: boolean;
  onBack: () => void;
  onSignOut: () => void;
};

export default function AccountPage({
  userEmail,
  isAnonymous,
  authBusy,
  onBack,
  onSignOut
}: AccountPageProps) {
  return (
    <div className="page-shell opponent-page">
      <header className="app-header">
        <div className="header-left">
          <button className="logo-button" onClick={onBack}>
            <img src={logo} alt="Home" className="app-logo" />
          </button>

          <div>
            <p className="page-subtitle">Account</p>
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
              <h1 className="page-title">Your account</h1>
              <p className="page-description">
                Manage the account connected to your matchup notes.
              </p>
            </div>
          </div>
        </section>

        <section className="notes-grid">
          <article className="panel-card note-block">
            <h3>Account status</h3>

            {userEmail ? (
              <>
                <p className="page-description" style={{ marginBottom: '0.75rem' }}>
                  Your notes are currently linked to:
                </p>
                <p style={{ fontSize: '1.05rem', fontWeight: 700 }}>{userEmail}</p>
              </>
            ) : isAnonymous ? (
              <p className="page-description">
                You are currently using a guest account. Your notes are temporary until you save
                them to a permanent account.
              </p>
            ) : (
              <p className="page-description">No account information available.</p>
            )}
          </article>

          <article className="panel-card note-block">
            <h3>What this means</h3>
            {userEmail ? (
              <p className="page-description">
                Your matchup notes are now saved to your account, so you can come back later and
                keep building them.
              </p>
            ) : (
              <p className="page-description">
                Guest accounts are quick to start with, but they are not meant for long term use.
                Save your notes to a permanent account from the login page.
              </p>
            )}
          </article>

          <article className="panel-card note-block note-block-full">
            <h3>Account actions</h3>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              <button
                type="button"
                className="secondary-button"
                onClick={onBack}
                disabled={authBusy}
              >
                Back to Home
              </button>

              {userEmail && (
                <button
                  type="button"
                  className="primary-button"
                  onClick={onSignOut}
                  disabled={authBusy}
                >
                  Sign Out
                </button>
              )}
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}