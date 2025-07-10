import { useState, useEffect } from 'react';
import { lieuApi } from '@/lib/api/services/evenementSports/lieuService';
import { epreuveApi } from '@/lib/api/services/evenementSports/epreuveService';
import { Lieu } from '@/types/sportEvenement/lieu'; 
import { Epreuve } from '@/types/sportEvenement/epreuve';
import { CreateEvenementRequest } from '@/lib/api/services/evenementSports/evenementService';

interface Props {
  onClose: () => void;
  onCreate: (eventData: CreateEvenementRequest) => void;
  loading: boolean;
  error: string | null;
}

export default function EvenementModal({ 
  onClose, 
  onCreate, 
  loading, 
  error 
}: Props) {
  const [formData, setFormData] = useState<CreateEvenementRequest>({
    description: '',
    lieuId: 0,
    date: '',
    horraire: ''
  });

  const [lieux, setLieux] = useState<Lieu[]>([]);
const [epreuves, setEpreuves] = useState<Epreuve[]>([]);

useEffect(() => {
  const fetchLieux = async () => {
    try {
      const apiLieux = await lieuApi.getAll();
      setLieux(apiLieux);
    } catch (err) {
      console.error('Erreur chargement lieux:', err);
    }
  };

  const fetchEpreuves = async () => {
    try {
      const apiEpreuves = await epreuveApi.getAll();
      setEpreuves(apiEpreuves);
    } catch (err) {
      console.error('Erreur chargement épreuves:', err);
    }
  };

  fetchLieux();
  fetchEpreuves();
}, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.description && formData.lieuId && formData.date && formData.horraire) {
      onCreate(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg text-black font-semibold mb-4">Créer un nouvel événement</h3>
        
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lieu
            </label>
            <select
              value={formData.lieuId}
              onChange={(e) => setFormData({ ...formData, lieuId: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value={0}>Sélectionnez un lieu</option>
              {lieux.map(lieu => (
                <option key={lieu.id} value={lieu.id}>
                  {lieu.nom}
                </option>
              ))}
            </select>
          </div>

                    <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Epreuve
            </label>
            <select
              value={formData.lieuId}
              onChange={(e) => setFormData({ ...formData, lieuId: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value={0}>Sélectionnez une epreuve</option>
              {epreuves.map(epreuve => (
                <option key={epreuve.id} value={epreuve.id}>
                  {epreuve.libelle}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Horaire
            </label>
            <input
              type="time"
              value={formData.horraire}
              onChange={(e) => setFormData({ ...formData, horraire: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              disabled={loading}
            >
              {loading ? 'Création...' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
