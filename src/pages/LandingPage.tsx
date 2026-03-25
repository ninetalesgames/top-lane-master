import logo from '../assets/logo.png';
import { topLaneChampions } from '../data/topLaneChampions';
import type { ChampionMastery } from '../utils/mastery';

type LandingPageProps = {
  onEnter: () => void;
  onOpenLogin: () => void;
  userEmail: string | null;
  onSignOut: () => void;
  authBusy: boolean;
  mastery: ChampionMastery[];
};
const getRankClassName = (rank: string) => {
  switch (rank) {
    case 'Challenger':
      return 'mastery-rank-challenger';
    case 'Master':
      return 'mastery-rank-master';
    case 'Diamond':
      return 'mastery-rank-diamond';
    case 'Emerald':
      return 'mastery-rank-emerald';
    case 'Platinum':
      return 'mastery-rank-platinum';
    case 'Gold':
      return 'mastery-rank-gold';
    case 'Silver':
      return 'mastery-rank-silver';
    case 'Bronze':
      return 'mastery-rank-bronze';
    default:
      return 'mastery-rank-iron';
  }
};
const getChampionDisplayData = (championKey: string) => {
  const match = topLaneChampions.find(
    (champion) => champion.name.toLowerCase().replace(/\s+/g, '_') === championKey
  );

  if (!match) {
    return {
      name: championKey.replace(/_/g, ' '),
      image: null
    };
  }

  return {
    name: match.name,
    image: match.image
  };
};

export default function LandingPage({
  onEnter,
  onOpenLogin,
  userEmail,
  onSignOut,
  authBusy,
  mastery
}: LandingPageProps) {
  const topMastery = mastery.filter((item) => item.count > 0).slice(0, 3);

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

      {topMastery.length > 0 && (
        <section className="info-section">
          <div className="info-grid">
            <article className="info-card" style={{ gridColumn: '1 / -1' }}>
              <h2>Your Top Mastery Champions</h2>

              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  flexWrap: 'wrap',
                  marginTop: '1rem'
                }}
              >
                {topMastery.map((item) => {
                  const champion = getChampionDisplayData(item.champion);

                  return (
                    <div
                      key={item.champion}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.85rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '14px',
                        padding: '0.8rem 1rem',
                        minWidth: '220px'
                      }}
                    >
                      {champion.image && (
                        <img
                          src={`https://ddragon.leagueoflegends.com/cdn/15.11.1/img/champion/${champion.image}.png`}
                          alt={champion.name}
                          style={{
                            width: 42,
                            height: 42,
                            borderRadius: '10px'
                          }}
                        />
                      )}

                      <div>
                        <div style={{ fontWeight: 700, marginBottom: '0.15rem' }}>
                          {champion.name}
                        </div>
                        <div
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    marginTop: '0.2rem'
  }}
>
  <span
    className={`champion-mastery-rank ${getRankClassName(item.rank)}`}
  >
    {item.rank}
  </span>

  <span style={{ fontSize: '0.85rem', opacity: 0.85 }}>
    {item.percentage}%
  </span>
</div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.72 }}>
                          {item.count}/{item.total} matchups saved
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>
          </div>
        </section>
      )}

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