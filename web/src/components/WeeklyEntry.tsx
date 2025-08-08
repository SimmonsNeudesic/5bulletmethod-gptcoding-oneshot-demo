import { Edit, Calendar } from 'lucide-react';
import { getWeekRange, formatDate } from '../utils/date';
import type { BulletEntry } from '../types/api';

interface WeeklyEntryProps {
  entry: BulletEntry;
  showActions?: boolean;
  onEdit?: () => void;
}

const WeeklyEntry: React.FC<WeeklyEntryProps> = ({ 
  entry, 
  showActions = false, 
  onEdit 
}) => {
  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-gray-400" />
          <div>
            <h3 className="font-semibold text-gray-900">
              Week of {getWeekRange(entry.week_start_date)}
            </h3>
            <p className="text-sm text-gray-500">
              Created: {formatDate(entry.created_at)}
            </p>
          </div>
        </div>
        
        {showActions && onEdit && (
          <button
            onClick={onEdit}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit
          </button>
        )}
      </div>

      {/* Bullet Items */}
      <div className="space-y-3">
        {entry.items.map((item, index) => (
          <div key={item.id || index} className="bullet-item">
            <span className="text-xl">{item.emoji}</span>
            <div className="flex-1">
              <span className="text-gray-900">{item.text}</span>
              {item.category && (
                <span className="ml-2 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {item.category}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {entry.items.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No bullet points added yet
        </div>
      )}
    </div>
  );
};

export default WeeklyEntry;
