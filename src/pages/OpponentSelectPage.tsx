import { useMemo, useState } from 'react';
import type { SelectedChampion } from '../App';
import { topLaneChampions, type Champion } from '../data/topLaneChampions';
import logo from '../assets/logo.png';

type OpponentSelectPageProps = {
  selectedChampion: SelectedChampion;
  selectedOpponent: SelectedChampion;
  onSelectOpponent: (champion: Champion) => void;
  onBack: () => void;
  onContinue: () => void;
};

export default function OpponentSelectPage({
  selectedChampion,
  selectedOpponent,
  onSelectOpponent,
  onBack,
  onContinue
}: OpponentSelectPageProps) {
  const [search, setSearch] = useState('');

  const filteredChampions = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return topLaneChampions;
    }

    return topLaneChampions.filter((champion) =>
      champion.name.toLowerCase().includes(query)
    );
  }, [search]);

  return (
    <div className="page-shell">
      <header className="app-header">
        <div className="header-left">
          <button className="logo-button" onClick={onBack}>
            <img src={logo} alt="Home" className="app-logo" />
          </button>

          <div>
            <p className="page-subtitle">Step 2 of 3 • Choose your opponent</p>
          </div>
        </div>

        <button className="secondary-button small-button" onClick={onBack}>
          Back to Champion Select
        </button>
      </header>

      <main className="content-width champion-select-page">
        <section className="panel-card select-panel-card">
          <div className="select-panel-top">
            <div>
              <span className="section-label">Opponent Select</span>
              <h1 className="page-title">Who are you facing?</h1>
              <p className="page-description">
                Choose the enemy top laner to open the matchup page and view or build your notes
                for that specific lane.
              </p>
            </div>

            <div className="summary-stack">
              <div className="summary-card selected-champion-summary">
                <span className="summary-label">Your champion</span>
                {selectedChampion ? (
                  <div className="selected-champion-display">
                    <img
                      src={`https://ddragon.leagueoflegends.com/cdn/15.11.1/img/champion/${selectedChampion.image}.png`}
                      alt={selectedChampion.name}
                      className="selected-champion-image"
                    />
                    <strong className="summary-name">{selectedChampion.name}</strong>
                  </div>
                ) : (
                  <strong className="summary-name">None selected</strong>
                )}
              </div>

              <div className="summary-card selected-champion-summary">
                <span className="summary-label">Selected opponent</span>
                {selectedOpponent ? (
                  <div className="selected-champion-display">
                    <img
                      src={`https://ddragon.leagueoflegends.com/cdn/15.11.1/img/champion/${selectedOpponent.image}.png`}
                      alt={selectedOpponent.name}
                      className="selected-champion-image"
                    />
                    <strong className="summary-name">{selectedOpponent.name}</strong>
                  </div>
                ) : (
                  <strong className="summary-name">None selected</strong>
                )}
              </div>
            </div>
          </div>

          <div className="search-row">
            <input
              type="text"
              className="champion-search"
              placeholder="Search opponent..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </section>

        <section className="champion-grid-section">
          <div className="champion-grid">
            {filteredChampions.map((champion) => {
              const isSelected = selectedOpponent?.id === champion.id;
              const isSameAsPlayer = selectedChampion?.id === champion.id;

              return (
                <button
                  key={champion.id}
                  type="button"
                  className={`champion-card ${isSelected ? 'champion-card-selected' : ''}`}
                  onClick={() => onSelectOpponent(champion)}
                  disabled={isSameAsPlayer}
                  title={isSameAsPlayer ? 'This is your selected champion' : champion.name}
                >
                  <div className="champion-avatar">
                    <img
                      src={`https://ddragon.leagueoflegends.com/cdn/15.11.1/img/champion/${champion.image}.png`}
                      alt={champion.name}
                      className="champion-avatar-image"
                    />
                  </div>

                  <span className="champion-name">{champion.name}</span>

                  {isSameAsPlayer && (
                    <span className="champion-card-note">Your pick</span>
                  )}
                </button>
              );
            })}
          </div>

          {filteredChampions.length === 0 && (
            <div className="empty-state">
              No champions found for that search.
            </div>
          )}
        </section>
      </main>

      <div className="fixed-bottom-actions-wrap">
        <div className="fixed-bottom-actions content-width">
          <button className="secondary-button small-button" onClick={onBack}>
            Back
          </button>

          <button
            className="primary-button small-button"
            onClick={onContinue}
            disabled={!selectedOpponent}
          >
            Open Matchup Page
          </button>
        </div>
      </div>
    </div>
  );
}