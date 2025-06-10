import { RefreshCw } from 'lucide-react';
import './Header.css'; // استدعاء ملف CSS

interface HeaderProps {
  title: string;
  onRefresh?: () => void;
}

export function Header({ title, onRefresh }: HeaderProps) {
  return (
    <div className="header">
      <h1 className="header-title">{title}</h1>
      {onRefresh && (
        <button
          onClick={onRefresh}
          className="refresh-button"
        >
          <RefreshCw size={20} />
        </button>
      )}
    </div>
  );
}
