import { useMemo, useState } from 'react';
import type { SelectedChampion } from '../App';
import { topLaneChampions, type Champion } from '../data/topLaneChampions';
import logo from '../assets/logo.png';

type ChampionSelectPageProps = {
  selectedChampion: SelectedChampion;
  onSelectChampion: (champion: Champion) => void;
  onBack: () => void;
  onContinue: () => void;
};

export default function ChampionSelectPage({
  selectedChampion,
  onSelectChampion,
  onBack,
  onContinue
}: ChampionSelectPageProps) {
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

  const handleChampionClick = (champion: Champion) => {
    onSelectChampion(champion);
    onContinue();
  };

  return (
    <div className="page-shell">
      <header className="app-header">
        <div className="header-left">
          <button className="logo-button" onClick={onBack}>
            <img src={logo} alt="Home" className="app-logo" />
          </button>

          <div>
            <p className="page-subtitle">Step 1 of 3 • Choose your champion</p>
          </div>
        </div>

        <button className="secondary-button small-button" onClick={onBack}>
          Back to Landing
        </button>
      </header>

      <main className="content-width champion-select-page">
        <section className="panel-card select-panel-card">
          <div className="select-panel-top">
            <div>
              <span className="section-label">Champion Select</span>
              <h1 className="page-title">Who are you playing?</h1>
              <p className="page-description">
                Start by selecting your top lane champion. This is the champion whose matchup notes
                you want to build and review.
              </p>
            </div>

            <div className="summary-card selected-champion-summary">
              <span className="summary-label">Selected champion</span>

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
          </div>

          <div className="search-row">
            <input
              type="text"
              className="champion-search"
              placeholder="Search champion..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </section>

        <section className="champion-grid-section">
          <div className="champion-grid">
            {filteredChampions.map((champion) => {
              const isSelected = selectedChampion?.id === champion.id;

              return (
                <button
                  key={champion.id}
                  type="button"
                  className={`champion-card ${isSelected ? 'champion-card-selected' : ''}`}
                  onClick={() => handleChampionClick(champion)}
                >
                  <div className="champion-avatar">
                    <img
                      src={`https://ddragon.leagueoflegends.com/cdn/15.11.1/img/champion/${champion.image}.png`}
                      alt={champion.name}
                      className="champion-avatar-image"
                    />
                  </div>
                  <span className="champion-name">{champion.name}</span>
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
    </div>
  );
}