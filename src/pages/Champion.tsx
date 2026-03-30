import logo from '../assets/logo.png';
import { topLaneChampions } from '../data/topLaneChampions';
import type { ChampionMastery } from '../utils/mastery';

type ChampionPageProps = {
  championKey: string | null;
  mastery: ChampionMastery[];
  onBack: () => void;
  onOpenMatchup: (opponentKey: string) => void;
};

type OpponentData = {
  opponent: string;
  count: number;
};

const getRankClassName = (rank: string) => {
  switch (rank) {
    case 'Challenger': return 'mastery-rank-challenger';
    case 'Master': return 'mastery-rank-master';
    case 'Diamond': return 'mastery-rank-diamond';
    case 'Emerald': return 'mastery-rank-emerald';
    case 'Platinum': return 'mastery-rank-platinum';
    case 'Gold': return 'mastery-rank-gold';
    case 'Silver': return 'mastery-rank-silver';
    case 'Bronze': return 'mastery-rank-bronze';
    default: return 'mastery-rank-iron';
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

// 🔥 NEW: extract opponents from localStorage
const getRecordedOpponents = (championKey: string): OpponentData[] => {
  const keys = Object.keys(localStorage);
  const counts: Record<string, number> = {};

  keys.forEach((key) => {
    if (!key.startsWith('matchup_notes_')) return;

    const parts = key.replace('matchup_notes_', '').split('_');
    if (parts.length < 2) return;

    const champion = parts[0];
    const opponent = parts.slice(1).join('_');

    if (champion !== championKey) return;

    counts[opponent] = (counts[opponent] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([opponent, count]) => ({ opponent, count }))
    .sort((a, b) => b.count - a.count);
};

export default function ChampionPage({
  championKey,
  mastery,
  onBack,
  onOpenMatchup
}: ChampionPageProps) {
  if (!championKey) return null;

  const champion = getChampionDisplayData(championKey);
  const championData = mastery.find((item) => item.champion === championKey);

  const recordedMatchups = getRecordedOpponents(championKey);

  return (
    <div className="page-shell opponent-page">
      <header className="app-header">
        <div className="header-left">
          <button className="logo-button" onClick={onBack}>
            <img src={logo} alt="Home" className="app-logo" />
          </button>

          <div>
            <p className="page-subtitle">Champion Overview</p>
          </div>
        </div>

        <button className="secondary-button small-button" onClick={onBack}>
          Back to Landing
        </button>
      </header>

      <main className="content-width matchup-layout">
        <section className="panel-card matchup-hero-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {champion.image && (
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/15.11.1/img/champion/${champion.image}.png`}
                alt={champion.name}
                style={{ width: 72, height: 72, borderRadius: '18px' }}
              />
            )}

            <div>
              <span className="section-label">Champion Mastery</span>
              <h1 className="page-title">{champion.name}</h1>

              {championData && (
                <>
                  <span className={`champion-mastery-rank ${getRankClassName(championData.rank)}`}>
                    {championData.rank}
                  </span>

                  <p className="page-description">
                    {championData.percentage}% mastery • {championData.count}/{championData.total}
                  </p>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="notes-grid">
          <article className="panel-card note-block note-block-full">
            <h3>Recorded Matchups</h3>

            {recordedMatchups.length === 0 ? (
              <p className="page-description">No matchups saved yet.</p>
            ) : (
              <div style={{ display: 'grid', gap: '0.85rem', marginTop: '1rem' }}>
                {recordedMatchups.map((opponentData) => {
                  const opponent = getChampionDisplayData(opponentData.opponent);

                  return (
                    <button
                      key={opponentData.opponent}
                      className="secondary-button"
                      onClick={() => onOpenMatchup(opponentData.opponent)}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                        {opponent.image && (
                          <img
                            src={`https://ddragon.leagueoflegends.com/cdn/15.11.1/img/champion/${opponent.image}.png`}
                            alt={opponent.name}
                            style={{ width: 40, height: 40, borderRadius: '10px' }}
                          />
                        )}

                        <div>
                          <div style={{ fontWeight: 700 }}>{opponent.name}</div>
                          <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                            {opponentData.count} note(s)
                          </div>
                        </div>
                      </div>

                      <span>Open</span>
                    </button>
                  );
                })}
              </div>
            )}
          </article>
        </section>
      </main>
    </div>
  );
}