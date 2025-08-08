import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import EntryPage from './pages/EntryPage';
import { streakApi } from './services/api';

function App() {
  const [streak, setStreak] = useState<number>(0);

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const response = await streakApi.getStreak();
        setStreak(response.streak);
      } catch (error) {
        console.error('Failed to fetch streak:', error);
      }
    };

    fetchStreak();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header streak={streak} />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage onStreakUpdate={setStreak} />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/entry/:id" element={<EntryPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
