import { useEffect, useState } from 'react';
import {
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  linkWithCredential,
  linkWithPopup,
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User
} from 'firebase/auth';
import './index.css';
import { auth, googleProvider } from './firebase';
import { topLaneChampions, type Champion } from './data/topLaneChampions';
import { calculateMastery, type ChampionMastery } from './utils/mastery';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/Login';
import AccountPage from './pages/Account';
import ChampionSelectPage from './pages/ChampionSelectPage';
import OpponentSelectPage from './pages/OpponentSelectPage';
import MatchupPage from './pages/MatchupPage';

type AppPage =
  | 'landing'
  | 'login'
  | 'account'
  | 'champion-select'
  | 'opponent-select'
  | 'matchup';

export type SelectedChampion = Champion | null;

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('landing');
  const [selectedChampion, setSelectedChampion] = useState<SelectedChampion>(null);
  const [selectedOpponent, setSelectedOpponent] = useState<SelectedChampion>(null);

  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authBusy, setAuthBusy] = useState(false);

  const [mastery, setMastery] = useState<ChampionMastery[]>([]);

  const refreshMastery = () => {
    const championKeys = topLaneChampions.map((champion) =>
      champion.name.toLowerCase().replace(/\s+/g, '_')
    );

    setMastery(calculateMastery(championKeys));
  };

  useEffect(() => {
    refreshMastery();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setAuthUser(user);
        setAuthLoading(false);
        return;
      }

      try {
        const result = await signInAnonymously(auth);
        setAuthUser(result.user);
      } catch (error) {
        console.error('Anonymous sign-in failed:', error);
      } finally {
        setAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const goToLanding = () => {
    refreshMastery();
    setCurrentPage('landing');
  };

  const goToLogin = () => setCurrentPage('login');
  const goToAccount = () => setCurrentPage('account');
  const goToChampionSelect = () => setCurrentPage('champion-select');
  const goToOpponentSelect = () => setCurrentPage('opponent-select');
  const goToMatchupPage = () => setCurrentPage('matchup');

  const handleGoogleSignIn = async () => {
  try {
    setAuthBusy(true);

    if (auth.currentUser?.isAnonymous) {
      try {
        const result = await linkWithPopup(auth.currentUser, googleProvider);
        console.log('Google link success:', result.user);
      } catch (error: any) {
        if (error.code === 'auth/credential-already-in-use') {
          const result = await signInWithPopup(auth, googleProvider);
          console.log('Signed into existing Google account:', result.user);
        } else {
          throw error;
        }
      }
    } else {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google sign-in success:', result.user);
    }

    setCurrentPage('account');
  } catch (error) {
    console.error('Google sign-in failed:', error);
    throw error;
  } finally {
    setAuthBusy(false);
  }
};

  const handleEmailSignUp = async (email: string, password: string) => {
    try {
      setAuthBusy(true);

      if (auth.currentUser?.isAnonymous) {
        const credential = EmailAuthProvider.credential(email, password);
        await linkWithCredential(auth.currentUser, credential);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }

      setCurrentPage('account');
    } catch (error) {
      console.error('Email sign-up failed:', error);
      alert('Could not create account. Please check your email and password and try again.');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleEmailLogIn = async (email: string, password: string) => {
    try {
      setAuthBusy(true);
      await signInWithEmailAndPassword(auth, email, password);
      setCurrentPage('account');
    } catch (error) {
      console.error('Email login failed:', error);
      alert('Login failed. Please check your email and password.');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setAuthBusy(true);
      await signOut(auth);
      setCurrentPage('landing');
    } catch (error) {
      console.error('Sign out failed:', error);
      alert('Could not sign out. Please try again.');
    } finally {
      setAuthBusy(false);
    }
  };

  if (authLoading) {
    return (
      <div className="app-shell">
        <div className="background-glow background-glow-1" />
        <div className="background-glow background-glow-2" />
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '1.1rem'
          }}
        >
          Loading your account...
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="background-glow background-glow-1" />
      <div className="background-glow background-glow-2" />

      {currentPage === 'landing' && (
        <LandingPage
          onEnter={goToChampionSelect}
          onOpenLogin={authUser?.email ? goToAccount : goToLogin}
          userEmail={authUser?.email ?? null}
          onSignOut={handleSignOut}
          authBusy={authBusy}
          mastery={mastery}
        />
      )}

      {currentPage === 'login' && (
        <LoginPage
          isAnonymous={!!authUser?.isAnonymous}
          userEmail={authUser?.email ?? null}
          authBusy={authBusy}
          onBack={goToLanding}
          onGoogleSignIn={handleGoogleSignIn}
          onEmailSignUp={handleEmailSignUp}
          onEmailLogIn={handleEmailLogIn}
          onSignOut={handleSignOut}
        />
      )}

      {currentPage === 'account' && (
        <AccountPage
          userEmail={authUser?.email ?? null}
          isAnonymous={!!authUser?.isAnonymous}
          authBusy={authBusy}
          onBack={goToLanding}
          onSignOut={handleSignOut}
        />
      )}

      {currentPage === 'champion-select' && (
        <ChampionSelectPage
          selectedChampion={selectedChampion}
          mastery={mastery}
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
          onBack={() => {
            refreshMastery();
            goToOpponentSelect();
          }}
        />
      )}
    </div>
  );
}