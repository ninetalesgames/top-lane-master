import logo from '../assets/logo.png';

type LandingPageProps = {
  onEnter: () => void;
};

export default function LandingPage({ onEnter }: LandingPageProps) {
  return (
    <>
      <header className="topbar">
        <div className="brand">
          <img src={logo} alt="Top Lane Matchup Master logo" className="app-logo" />
        </div>

        <a href="#about" className="topbar-link">
          About
        </a>
      </header>

      <main className="hero">
        <section className="hero-card">
          <span className="badge">Website based • Personal notes • Top lane only</span>

          <h1>
            Build your own
            <br />
            top lane matchup knowledge
          </h1>

          <p className="hero-text">
            This is not a guide telling you how to play.
            <br />
            It is a personal system for tracking what you learn in each matchup, so you can
            refine your understanding over time and become harder to beat in lane.
          </p>

          <div className="hero-actions">
            <button className="primary-button" onClick={onEnter}>
              Enter Matchups
            </button>
            <a href="#about" className="secondary-button">
              Learn More
            </a>
          </div>
        </section>
      </main>

      <section id="about" className="info-section">
        <div className="info-grid">
          <article className="info-card">
            <h2>What it is</h2>
            <p>
              A focused website for top lane players who want to store and improve their own
              matchup notes instead of relying on generic advice.
            </p>
          </article>

          <article className="info-card">
            <h2>How it works</h2>
            <p>
              Pick your champion, pick the enemy champion, then view or update your structured
              matchup notes such as early game, level 6 spike, trading patterns, mistakes to avoid,
              and win condition.
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