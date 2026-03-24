import logo from '../assets/logo.png';

type LandingPageProps = {
  onEnter: () => void;
  onOpenLogin: () => void;
  userEmail: string | null;
  onSignOut: () => void;
  authBusy: boolean;
};

export default function LandingPage({
  onEnter,
  onOpenLogin,
  userEmail,
  onSignOut,
  authBusy
}: LandingPageProps) {
  return (
    <>
      <header className="topbar">
        <div className="brand">
          <img src={logo} alt="Top Lane Matchup Master logo" className="app-logo" />
        </div>

        <div className="auth-panel">
          {userEmail ? (
            <div className="auth-user-box">
              <button
                className="secondary-button small-button"
                onClick={onOpenLogin}
                disabled={authBusy}
              >
                Account
              </button>

              <button
                className="secondary-button small-button"
                onClick={onSignOut}
                disabled={authBusy}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              className="secondary-button small-button"
              onClick={onOpenLogin}
              disabled={authBusy}
            >
              Save your notes
            </button>
          )}
        </div>
      </header>

      <main className="hero">
        <section className="hero-card">
          <span className="badge">Personal matchup notes • Built for top lane</span>

          <h1>
            Build your own
            <br />
            top lane matchup knowledge
          </h1>

          <p className="hero-text">
            You do not remember matchups by reading guides.
            <br />
            You remember them by writing.
            <br />
            This is a personal system for saving what actually happened in your games, so your
            matchup knowledge gets sharper over time.
          </p>

          <div className="hero-actions">
            <button className="primary-button" onClick={onEnter}>
              Start Building Matchups
            </button>

            <a
              href="https://discord.gg/AFax92JABr"
              target="_blank"
              rel="noopener noreferrer"
              className="secondary-button"
            >
              Join Discord
            </a>
          </div>
        </section>
      </main>

      <section className="info-section">
        <div className="info-grid">
          <article className="info-card">
            <h2>What it is</h2>
            <p>
              A focused website for top lane players who want to store and improve their own
              matchup notes instead of relying on generic advice. Think of it as your personal
              matchup notebook, but built for League.
            </p>
          </article>

          <article className="info-card">
            <h2>How it works</h2>
            <p>
              Pick your champion, pick the enemy champion, then save what actually worked. Your
              notes are structured into early game, late game, and key spikes, so they stay fast to
              update and easy to review.
            </p>
          </article>

          <article className="info-card">
            <h2>Why top lane</h2>
            <p>
              Top lane is one of the most matchup heavy roles in the game. Small details matter,
              and learning from your own games is often more valuable than copying random online
              tips.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}