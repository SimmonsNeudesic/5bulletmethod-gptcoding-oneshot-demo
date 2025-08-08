import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight } from 'lucide-react';
import { entriesApi } from '../services/api';
import { getWeekRange, formatDate } from '../utils/date';
import type { BulletEntry } from '../types/api';

const HistoryPage: React.FC = () => {
  const [entries, setEntries] = useState<BulletEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const data = await entriesApi.getEntries();
      setEntries(data);
    } catch (error) {
      console.error('Failed to fetch entries:', error);
    } finally {
      setLoading(false);
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
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Entry History
        </h2>
        <p className="text-gray-600">
          View all your weekly accomplishments
        </p>
      </div>

      {/* Entries List */}
      {entries.length === 0 ? (
        <div className="card text-center">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No entries yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start creating weekly entries to see them here.
          </p>
          <Link to="/" className="btn-primary">
            Create Your First Entry
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <Link
              key={entry.id}
              to={`/entry/${entry.id}`}
              className="card hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <h3 className="font-semibold text-gray-900">
                      Week of {getWeekRange(entry.week_start_date)}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">
                    Created: {formatDate(entry.created_at)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {entry.items.slice(0, 3).map((item, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 text-sm bg-gray-100 rounded-full px-3 py-1"
                      >
                        <span>{item.emoji}</span>
                        <span className="truncate max-w-32">{item.text}</span>
                      </span>
                    ))}
                    {entry.items.length > 3 && (
                      <span className="text-sm text-gray-500">
                        +{entry.items.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
