import BackToEventsButton from '../shared/BackToEventsButton';

interface EpreuvesHeaderProps {
  onCreateClick: () => void;
}

export default function EpreuvesHeader({ onCreateClick }: EpreuvesHeaderProps) {
  return (
    <header className="bg-white shadow-md">
        <div className="flex justify-between items-center py-6 px-6">
            <BackToEventsButton />
            <h1 className="text-3xl font-bold text-gray-900">
              🥇 🥈 🥉 Gestion des Épreuves
            </h1>
          
          <button 
            onClick={onCreateClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            + Nouvelle Épreuve
          </button>
        </div>
    </header>
  );
}
