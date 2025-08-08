import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Zap } from 'lucide-react';
import { entriesApi } from '../services/api';
import { getWeekRange, formatDate } from '../utils/date';
import type { BulletEntry, BulletItem } from '../types/api';
import WeeklyEntry from '../components/WeeklyEntry';
import BulletForm from '../components/BulletForm';

const EntryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [entry, setEntry] = useState<BulletEntry | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchEntry(parseInt(id));
    }
  }, [id]);

  const fetchEntry = async (entryId: number) => {
    try {
      setLoading(true);
      const data = await entriesApi.getEntry(entryId);
      setEntry(data);
    } catch (error) {
      console.error('Failed to fetch entry:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEntry = async (items: Omit<BulletItem, 'id' | 'bullet_entry_id' | 'created_at'>[]) => {
    if (!entry) return;

    try {
      const updated = await entriesApi.updateEntry(entry.id, { items });
      setEntry(updated);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to update entry:', error);
      alert('Failed to update entry. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Entry not found
          </h3>
          <p className="text-gray-600 mb-6">
            The entry you're looking for doesn't exist or may have been deleted.
          </p>
          <Link to="/history" className="btn-primary">
            Back to History
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link 
          to="/history" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to History
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Week of {getWeekRange(entry.week_start_date)}
            </h2>
            <p className="text-gray-600">
              Created: {formatDate(entry.created_at)}
            </p>
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit Entry
          </button>
        </div>
      </div>

      {/* Entry Content */}
      <div className="space-y-6">
        <WeeklyEntry 
          entry={entry} 
          showActions={false}
        />
        
        {showForm && (
          <BulletForm
            initialItems={entry.items}
            onSave={handleSaveEntry}
            onCancel={() => setShowForm(false)}
          />
        )}
        
        {/* AI Insight */}
        {entry.insight && (
          <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-start gap-3">
              <Zap className="h-6 w-6 text-blue-500 mt-1" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">AI Insight</h4>
                <p className="text-blue-800">{entry.insight.insight_text}</p>
                <p className="text-xs text-blue-600 mt-2">
                  Generated: {formatDate(entry.insight.generated_at)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EntryPage;
