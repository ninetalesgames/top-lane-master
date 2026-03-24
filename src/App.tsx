import { useState } from 'react';
import './index.css';
import LandingPage from './pages/LandingPage';
import ChampionSelectPage from './pages/ChampionSelectPage';
import OpponentSelectPage from './pages/OpponentSelectPage';
import MatchupPage from './pages/MatchupPage';
import type { Champion } from './data/topLaneChampions';

type AppPage = 'landing' | 'champion-select' | 'opponent-select' | 'matchup';

export type SelectedChampion = Champion | null;

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('landing');
  const [selectedChampion, setSelectedChampion] = useState<SelectedChampion>(null);
  const [selectedOpponent, setSelectedOpponent] = useState<SelectedChampion>(null);

  const goToLanding = () => setCurrentPage('landing');
  const goToChampionSelect = () => setCurrentPage('champion-select');
  const goToOpponentSelect = () => setCurrentPage('opponent-select');
  const goToMatchupPage = () => setCurrentPage('matchup');

  return (
    <div className="app-shell">
      <div className="background-glow background-glow-1" />
      <div className="background-glow background-glow-2" />

      {currentPage === 'landing' && (
        <LandingPage onEnter={goToChampionSelect} />
      )}

      {currentPage === 'champion-select' && (
        <ChampionSelectPage
          selectedChampion={selectedChampion}
          onSelectChampion={(champion) => {
            setSelectedChampion(champion);
            setSelectedOpponent(null);
          }}
          onBack={goToLanding}
          onContinue={goToOpponentSelect}
        />
      )}

      {currentPage === 'opponent-select' && (
        <OpponentSelectPage
          selectedChampion={selectedChampion}
          selectedOpponent={selectedOpponent}
          onSelectOpponent={setSelectedOpponent}
          onBack={goToChampionSelect}
          onContinue={goToMatchupPage}
        />
      )}

      {currentPage === 'matchup' && (
        <MatchupPage
          selectedChampion={selectedChampion}
          selectedOpponent={selectedOpponent}
          onBack={goToOpponentSelect}
        />
      )}
    </div>
  );
}