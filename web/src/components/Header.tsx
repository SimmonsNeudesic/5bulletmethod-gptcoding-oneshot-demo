import { Link } from 'react-router-dom';
import { Target, History } from 'lucide-react';

interface HeaderProps {
  streak: number;
}

const Header: React.FC<HeaderProps> = ({ streak }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Target className="h-8 w-8 text-primary-500" />
            <h1 className="text-2xl font-bold text-gray-900">5BulletMethod</h1>
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link 
              to="/history" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <History className="h-5 w-5" />
              History
            </Link>
            
            <div className="flex items-center gap-2 bg-primary-50 px-3 py-2 rounded-full">
              <span className="text-sm font-medium text-primary-700">
                🔥 {streak} week{streak !== 1 ? 's' : ''} streak
              </span>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
