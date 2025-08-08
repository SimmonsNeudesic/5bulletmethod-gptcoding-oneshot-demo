import { useState, useEffect } from 'react';
import { Plus, Target, Zap } from 'lucide-react';
import { entriesApi, streakApi } from '../services/api';
import { getWeekStart, getWeekRange, isCurrentWeek } from '../utils/date';
import type { BulletEntry, BulletItem } from '../types/api';
import WeeklyEntry from '../components/WeeklyEntry';
import BulletForm from '../components/BulletForm';

interface HomePageProps {
  onStreakUpdate: (streak: number) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onStreakUpdate }) => {
  const [currentEntry, setCurrentEntry] = useState<BulletEntry | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const currentWeekStart = getWeekStart(new Date());

  useEffect(() => {
    fetchCurrentEntry();
  }, []);

  const fetchCurrentEntry = async () => {
    try {
      setLoading(true);
      const entries = await entriesApi.getEntries();
      const thisWeekEntry = entries.find(entry => entry.week_start_date === currentWeekStart);
      setCurrentEntry(thisWeekEntry || null);
    } catch (error) {
      console.error('Failed to fetch current entry:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEntry = async (items: Omit<BulletItem, 'id' | 'bullet_entry_id' | 'created_at'>[]) => {
    try {
      if (currentEntry) {
        // Update existing entry
        const updated = await entriesApi.updateEntry(currentEntry.id, { items });
        setCurrentEntry(updated);
      } else {
        // Create new entry
        const newEntry = await entriesApi.createEntry({
          week_start_date: currentWeekStart,
          items,
        });
        setCurrentEntry(newEntry);
      }

      // Update streak
      const streakResponse = await streakApi.getStreak();
      onStreakUpdate(streakResponse.streak);
      
      setShowForm(false);
    } catch (error) {
      console.error('Failed to save entry:', error);
      alert('Failed to save entry. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          This Week's Accomplishments
        </h2>
        <p className="text-gray-600">
          {getWeekRange(currentWeekStart)}
        </p>
      </div>

      {/* Main Content */}
      {currentEntry ? (
        <div className="space-y-6">
          <WeeklyEntry 
            entry={currentEntry} 
            showActions={true}
            onEdit={() => setShowForm(true)}
          />
          
          {showForm && (
            <BulletForm
              initialItems={currentEntry.items}
              onSave={handleSaveEntry}
              onCancel={() => setShowForm(false)}
            />
          )}
        </div>
      ) : (
        <div className="card text-center">
          <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No entry for this week yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start tracking your weekly accomplishments with 5 bullet points.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Create This Week's Entry
          </button>
          
          {showForm && (
            <div className="mt-6">
              <BulletForm
                initialItems={[]}
                onSave={handleSaveEntry}
                onCancel={() => setShowForm(false)}
              />
            </div>
          )}
        </div>
      )}

      {/* AI Insight */}
      {currentEntry?.insight && (
        <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-start gap-3">
            <Zap className="h-6 w-6 text-blue-500 mt-1" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">AI Insight</h4>
              <p className="text-blue-800">{currentEntry.insight.insight_text}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
