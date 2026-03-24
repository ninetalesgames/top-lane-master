import { useEffect, useState } from 'react';
import type { SelectedChampion } from '../App';
import logo from '../assets/logo.png';

type MatchupPageProps = {
  selectedChampion: SelectedChampion;
  selectedOpponent: SelectedChampion;
  onBack: () => void;
};

type QuickNoteGroup = {
  title: string;
  notes: string[];
};

type QuickNoteSection = {
  title: string;
  groups: QuickNoteGroup[];
};

type SavedMatchupNotes = {
  earlyGameNotes: string;
  level6Notes: string;
  level11Notes: string;
  lateGameNotes: string;
};

const quickNoteSections: Record<'early' | 'six' | 'eleven' | 'late', QuickNoteSection> = {
  early: {
    title: 'Early game',
    groups: [
      {
        title: 'Trading',
        notes: [
          'Lose level 1 all in',
          'Win level 1 all in',
          'Take short trades only',
          'Avoid extended fights'
        ]
      },
      {
        title: 'Wave',
        notes: [
          'Play around level 2 spike',
          'Slow push first wave',
          'Let wave come to me',
          'Farm safely under tower'
        ]
      },
      {
        title: 'Mindset',
        notes: [
          'Respect enemy early damage',
          'Look for early kill window'
        ]
      }
    ]
  },
  six: {
    title: 'Level 6',
    groups: [
      {
        title: 'Power spike',
        notes: [
          'Enemy stronger at level 6',
          'I am stronger at level 6',
          'Do not fight when they have ult',
          'Look to all in with ult'
        ]
      },
      {
        title: 'Execution',
        notes: [
          'Poke before committing',
          'Bait enemy ult first',
          'Track cooldowns carefully'
        ]
      },
      {
        title: 'Wave and jungle',
        notes: [
          'Freeze wave and threaten kill',
          'Play safe until ult advantage',
          'Call jungle for dive'
        ]
      }
    ]
  },
  eleven: {
    title: 'Level 11',
    groups: [
      {
        title: 'Spike',
        notes: [
          'Enemy spikes harder at 11',
          'I spike harder at 11',
          'Avoid 1v1 after 11'
        ]
      },
      {
        title: 'Map plan',
        notes: [
          'Look for side lane pressure',
          'Group for fights',
          'Split push only',
          'Push then rotate'
        ]
      },
      {
        title: 'Discipline',
        notes: [
          'Do not overextend',
          'Play around item spikes',
          'Control side waves'
        ]
      }
    ]
  },
  late: {
    title: 'Late game',
    groups: [
      {
        title: 'Teamfighting',
        notes: [
          'Group for teamfights',
          'Play front to back',
          'Look for flank',
          'Do not engage first'
        ]
      },
      {
        title: 'Responsibility',
        notes: [
          'Peel for carries',
          'Focus priority targets',
          'Ignore lane and play objectives'
        ]
      },
      {
        title: 'Side lane and objectives',
        notes: [
          'Split push pressure',
          'Do not get caught side lane',
          'Play around Baron and Elder'
        ]
      }
    ]
  }
};

const placeholderTexts = [
  'Here you write how you felt in the early game. Delete these notes and add your own. E.g. I lose level 1 all in, take short trades only.',
  'Here you write how the matchup changes at level 6. Delete these notes and add your own. E.g. if they hit 6 first I must back off, only fight after poking them down first.',
  'Here you write how the matchup feels at level 11. Delete these notes and add your own. E.g. their second ultimate spike is dangerous, I need side lane control before fighting.',
  'Here you write how the matchup feels later on. Delete these notes and add your own. E.g. I stop looking for isolated fights and focus on teamfights, flank angles, and front to back execution.'
];

const defaultNotes: SavedMatchupNotes = {
  earlyGameNotes: placeholderTexts[0],
  level6Notes: placeholderTexts[1],
  level11Notes: placeholderTexts[2],
  lateGameNotes: placeholderTexts[3]
};

const normalizeLines = (value: string) => {
  const trimmed = value.trim();

  if (!trimmed) {
    return [];
  }

  if (placeholderTexts.map((text) => text.toLowerCase()).includes(trimmed.toLowerCase())) {
    return [];
  }

  return trimmed
    .split('\n')
    .map((line) => line.replace(/^•\s*/, '').trim())
    .filter(Boolean);
};

const hasNote = (currentValue: string, note: string) => {
  const lines = normalizeLines(currentValue);
  return lines.some((line) => line.toLowerCase() === note.toLowerCase());
};

const renderNoteList = (value: string) => {
  const lines = normalizeLines(value);

  if (lines.length === 0) {
    return <p className="empty-note-text">No notes added yet.</p>;
  }

  return (
    <ul className="note-list">
      {lines.map((line, index) => (
        <li key={`${line}-${index}`}>{line}</li>
      ))}
    </ul>
  );
};

export default function MatchupPage({
  selectedChampion,
  selectedOpponent,
  onBack
}: MatchupPageProps) {
  const [mode, setMode] = useState<'review' | 'update'>('review');

  const [earlyGameNotes, setEarlyGameNotes] = useState(defaultNotes.earlyGameNotes);
  const [level6Notes, setLevel6Notes] = useState(defaultNotes.level6Notes);
  const [level11Notes, setLevel11Notes] = useState(defaultNotes.level11Notes);
  const [lateGameNotes, setLateGameNotes] = useState(defaultNotes.lateGameNotes);

  const [savedField, setSavedField] = useState<keyof SavedMatchupNotes | 'all' | null>(null);

  const matchupTitle =
    selectedChampion && selectedOpponent
      ? `${selectedChampion.name} vs ${selectedOpponent.name}`
      : 'Matchup Notes';

  const championKey = selectedChampion?.name?.toLowerCase().replace(/\s+/g, '_') || 'unknown_champion';
  const opponentKey = selectedOpponent?.name?.toLowerCase().replace(/\s+/g, '_') || 'unknown_opponent';
  const matchupStorageKey = `matchup_notes_${championKey}_${opponentKey}`;

  useEffect(() => {
    try {
      const savedData = localStorage.getItem(matchupStorageKey);

      if (!savedData) {
        setEarlyGameNotes(defaultNotes.earlyGameNotes);
        setLevel6Notes(defaultNotes.level6Notes);
        setLevel11Notes(defaultNotes.level11Notes);
        setLateGameNotes(defaultNotes.lateGameNotes);
        return;
      }

      const parsed: Partial<SavedMatchupNotes> = JSON.parse(savedData);

      setEarlyGameNotes(parsed.earlyGameNotes || defaultNotes.earlyGameNotes);
      setLevel6Notes(parsed.level6Notes || defaultNotes.level6Notes);
      setLevel11Notes(parsed.level11Notes || defaultNotes.level11Notes);
      setLateGameNotes(parsed.lateGameNotes || defaultNotes.lateGameNotes);
    } catch (error) {
      console.error('Failed to load matchup notes from localStorage:', error);
      setEarlyGameNotes(defaultNotes.earlyGameNotes);
      setLevel6Notes(defaultNotes.level6Notes);
      setLevel11Notes(defaultNotes.level11Notes);
      setLateGameNotes(defaultNotes.lateGameNotes);
    }
  }, [matchupStorageKey]);

  const showSaved = (field: keyof SavedMatchupNotes | 'all') => {
    setSavedField(field);
    window.setTimeout(() => {
      setSavedField((current) => (current === field ? null : current));
    }, 1500);
  };

  const saveMatchupNotes = (updatedNotes?: Partial<SavedMatchupNotes>, field?: keyof SavedMatchupNotes | 'all') => {
    try {
      const dataToSave: SavedMatchupNotes = {
        earlyGameNotes,
        level6Notes,
        level11Notes,
        lateGameNotes,
        ...updatedNotes
      };

      localStorage.setItem(matchupStorageKey, JSON.stringify(dataToSave));
      showSaved(field || 'all');
    } catch (error) {
      console.error('Failed to save matchup notes to localStorage:', error);
    }
  };

  const handleToggleNote = (
    currentValue: string,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    noteToToggle: string,
    field: keyof SavedMatchupNotes
  ) => {
    const lines = normalizeLines(currentValue);
    const lowerLines = lines.map((line) => line.toLowerCase());
    const target = noteToToggle.toLowerCase();

    const updatedLines = lowerLines.includes(target)
      ? lines.filter((line) => line.toLowerCase() !== target)
      : [...lines, noteToToggle];

    const updatedValue = updatedLines.join('\n');

    setValue(updatedValue);
    saveMatchupNotes({ [field]: updatedValue }, field);
  };

  const topLaneRules = [
    'Prioritize lane state over forcing plays.',
    'Your impact in the game is earned through the laning phase.',
    'Crash waves before recalling, rotating, or moving to objectives.',
    'Use high tempo recalls to return with better resources and keep control.',
    'Respect early level spikes and do not ego losing fights.',
    'Do not take fights to prove something.',
    'Do your job based on your champion identity.',
    'Progress the lane first, then rotate.',
    'Only rotate when your wave is in a good state.',
    'Do not leave lane for bad or forced plays. If needed, mute all.',
    'Know when to freeze, when to slow push, and when to proxy.',
    'Use bushes to farm safely and control spacing in difficult lanes.',
    'Play around Baron and Elder, but do not sacrifice side lane control for free.',
    'Win through better resources, cleaner wave control, and better decisions, not just kills.'
  ];

  const QuickNoteButtons = ({
    section,
    currentValue,
    setValue,
    field
  }: {
    section: QuickNoteSection;
    currentValue: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    field: keyof SavedMatchupNotes;
  }) => {
    return (
      <div className="quick-note-groups">
        {section.groups.map((group) => (
          <div key={group.title} className="quick-note-group">
            <div className="quick-note-group-title">{group.title}</div>

            <div className="quick-note-button-row">
              {group.notes.map((note) => {
                const selected = hasNote(currentValue, note);

                return (
                  <button
                    key={note}
                    type="button"
                    className={`quick-note-button ${selected ? 'quick-note-button-selected' : ''}`}
                    onClick={() => handleToggleNote(currentValue, setValue, note, field)}
                  >
                    {note}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderSavedMessage = (field: keyof SavedMatchupNotes | 'all') => {
    if (savedField !== field) {
      return null;
    }

    return <p className="saved-message">Saved!</p>;
  };

  const renderTopLaneRulesCard = () => (
    <article className="panel-card note-block note-block-full">
      <h3>Top Lane Fundamentals</h3>

      <ul className="toplane-rules-list">
        {topLaneRules.map((rule, index) => (
          <li key={index}>{rule}</li>
        ))}
      </ul>

      <div className="toplane-rules-footer">
        <p>
          <strong>High tempo recall:</strong> recall after crashing the wave so you lose little or
          nothing while the enemy loses time, CS, or control.
        </p>
        <p>
          These fundamentals are what make you climb. You can know every matchup in the game, but if
          you ignore wave control, tempo, and discipline, you will still lose LP.
        </p>
      </div>
    </article>
  );

  const renderReviewMode = () => (
    <section className="notes-grid">
      <article className="panel-card note-block">
        <h3>Early game</h3>
        {renderNoteList(earlyGameNotes)}
      </article>

      <article className="panel-card note-block">
        <h3>Level 6</h3>
        {renderNoteList(level6Notes)}
      </article>

      <article className="panel-card note-block">
        <h3>Level 11</h3>
        {renderNoteList(level11Notes)}
      </article>

      <article className="panel-card note-block">
        <h3>Late game</h3>
        {renderNoteList(lateGameNotes)}
      </article>

      {renderTopLaneRulesCard()}
    </section>
  );

  const renderUpdateMode = () => (
    <section className="notes-grid">
      <article className="panel-card note-block">
        <h3>Early game</h3>
        <QuickNoteButtons
          section={quickNoteSections.early}
          currentValue={earlyGameNotes}
          setValue={setEarlyGameNotes}
          field="earlyGameNotes"
        />
        <textarea
          className="matchup-textarea"
          value={earlyGameNotes}
          onChange={(event) => setEarlyGameNotes(event.target.value)}
          placeholder="Write your early game notes here..."
        />
        <div className="notes-save-row">
          <button
            type="button"
            className="secondary-button small-button"
            onClick={() => saveMatchupNotes({ earlyGameNotes }, 'earlyGameNotes')}
          >
            Save Early Game Notes
          </button>
          {renderSavedMessage('earlyGameNotes')}
        </div>
      </article>

      <article className="panel-card note-block">
        <h3>Level 6</h3>
        <QuickNoteButtons
          section={quickNoteSections.six}
          currentValue={level6Notes}
          setValue={setLevel6Notes}
          field="level6Notes"
        />
        <textarea
          className="matchup-textarea"
          value={level6Notes}
          onChange={(event) => setLevel6Notes(event.target.value)}
          placeholder="Write your level 6 notes here..."
        />
        <div className="notes-save-row">
          <button
            type="button"
            className="secondary-button small-button"
            onClick={() => saveMatchupNotes({ level6Notes }, 'level6Notes')}
          >
            Save Level 6 Notes
          </button>
          {renderSavedMessage('level6Notes')}
        </div>
      </article>

      <article className="panel-card note-block">
        <h3>Level 11</h3>
        <QuickNoteButtons
          section={quickNoteSections.eleven}
          currentValue={level11Notes}
          setValue={setLevel11Notes}
          field="level11Notes"
        />
        <textarea
          className="matchup-textarea"
          value={level11Notes}
          onChange={(event) => setLevel11Notes(event.target.value)}
          placeholder="Write your level 11 notes here..."
        />
        <div className="notes-save-row">
          <button
            type="button"
            className="secondary-button small-button"
            onClick={() => saveMatchupNotes({ level11Notes }, 'level11Notes')}
          >
            Save Level 11 Notes
          </button>
          {renderSavedMessage('level11Notes')}
        </div>
      </article>

      <article className="panel-card note-block">
        <h3>Late game</h3>
        <QuickNoteButtons
          section={quickNoteSections.late}
          currentValue={lateGameNotes}
          setValue={setLateGameNotes}
          field="lateGameNotes"
        />
        <textarea
          className="matchup-textarea"
          value={lateGameNotes}
          onChange={(event) => setLateGameNotes(event.target.value)}
          placeholder="Write your late game notes here..."
        />
        <div className="notes-save-row">
          <button
            type="button"
            className="secondary-button small-button"
            onClick={() => saveMatchupNotes({ lateGameNotes }, 'lateGameNotes')}
          >
            Save Late Game Notes
          </button>
          {renderSavedMessage('lateGameNotes')}
        </div>
      </article>

      {renderTopLaneRulesCard()}
    </section>
  );

  return (
    <div className="page-shell">
      <header className="app-header">
        <div className="header-left">
          <button className="logo-button" onClick={onBack}>
            <img src={logo} alt="Home" className="app-logo" />
          </button>

          <div>
            <p className="page-subtitle">Step 3 of 3 • Matchup Workspace</p>
          </div>
        </div>

        <button className="secondary-button small-button" onClick={onBack}>
          Back to Opponent Select
        </button>
      </header>

      <main className="content-width matchup-layout">
        <section className="panel-card matchup-hero-card">
          <div className="matchup-hero-top">
            <div>
              <span className="section-label">Matchup Page</span>
              <h1 className="page-title">{matchupTitle}</h1>
              <p className="page-description">
                Review the most important ideas for this matchup and memorize the core top lane rules.
              </p>
            </div>

            <div className="mode-toggle">
              <button
                type="button"
                className={`mode-button ${mode === 'review' ? 'mode-button-active' : ''}`}
                onClick={() => setMode('review')}
              >
                Review Mode
              </button>
              <button
                type="button"
                className={`mode-button ${mode === 'update' ? 'mode-button-active' : ''}`}
                onClick={() => setMode('update')}
              >
                Update Mode
              </button>
            </div>
          </div>
        </section>

        {mode === 'review' ? renderReviewMode() : renderUpdateMode()}
      </main>
    </div>
  );
}