'use client';

import { useState, useEffect } from 'react';
import { disciplineApi, CreateDisciplineRequest } from '@/lib/api/services/evenementSports/disciplineService';
import { Discipline } from '@/types/sportEvenement/discipline';
import Notification from '@/components/notification';
import { useAuth } from '@/contexts/authContext';
import { useSessionExpiry } from '@/hooks/useSessionExpiry';

interface DisciplinesManagementProps {
  onBack: () => void;
}

export default function DisciplinesManagement({ onBack }: DisciplinesManagementProps) {
  const { isAuthenticated } = useAuth();
  
  useSessionExpiry();
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  // Vérifier l'authentification
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-6 text-center max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Accès non autorisé
          </h2>
          <p className="text-gray-600 mb-6">
            Vous devez être connecté pour gérer les disciplines.
          </p>
          <button
            onClick={onBack}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
          >
            Retour au dashboard
          </button>
        </div>
      </div>
    );
  }

  // Fonction pour charger les disciplines depuis l'API avec recherche
  const loadDisciplines = async (searchQuery?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const apiDisciplines = await disciplineApi.getAll(searchQuery ? {
        nom: searchQuery
      } : undefined);
      
      setDisciplines(apiDisciplines);
      console.log('Disciplines chargées depuis l\'API:', apiDisciplines);
    } catch (err: any) {
      console.error('Erreur chargement disciplines:', err);
      
      if (err.message?.includes('401')) {
        setError('Session expirée. Veuillez vous reconnecter.');
      } else {
        setError('Erreur lors du chargement des disciplines');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour effectuer une recherche côté serveur
  const handleSearch = async (query: string) => {
    setSearchTerm(query);
    if (query.trim()) {
      await loadDisciplines(query);
    } else {
      await loadDisciplines();
    }
  };

  // Fonction pour créer une nouvelle discipline
  const handleCreateDiscipline = async (disciplineData: CreateDisciplineRequest) => {
    try {
      setCreateLoading(true);
      setCreateError(null);
      
      const newDiscipline = await disciplineApi.create(disciplineData);
      
      setDisciplines(prev => [...prev, newDiscipline]);
      setShowCreateForm(false);
      setNotification({
        message: 'Discipline créée avec succès !',
        type: 'success'
      });
      console.log('Discipline créée avec succès:', newDiscipline);
    } catch (err: any) {
      console.error('Erreur création discipline:', err);
      
      if (err.message?.includes('401')) {
        setCreateError('Session expirée. Veuillez vous reconnecter.');
      } else {
        setCreateError('Erreur lors de la création de la discipline');
      }
    } finally {
      setCreateLoading(false);
    }
  };

  // Fonction pour supprimer une discipline
  const handleDeleteDiscipline = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette discipline ?')) return;
    
    try {
      await disciplineApi.delete(id);
      setDisciplines(prev => prev.filter(discipline => discipline.id !== id));
      setNotification({
        message: 'Discipline supprimée avec succès !',
        type: 'success'
      });
      console.log('Discipline supprimée avec succès:', id);
    } catch (err: any) {
      console.error('Erreur suppression discipline:', err);
      
      if (err.message?.includes('401')) {
        setNotification({
          message: 'Session expirée. Veuillez vous reconnecter.',
          type: 'error'
        });
      } else {
        setNotification({
          message: 'Erreur lors de la suppression de la discipline',
          type: 'error'
        });
      }
    }
  };

  // Charger les disciplines au montage du composant
  useEffect(() => {
    loadDisciplines();
  }, []);

  // Fonction pour filtrer les disciplines affichées
  const filteredDisciplines = disciplines.filter(discipline => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return discipline.nom.toLowerCase().includes(searchLower);
  });

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                ← Retour au Dashboard
              </button>
              <h1 className="text-3xl font-bold text-gray-900">
                🏆 Gestion des Disciplines
              </h1>
            </div>
            <button 
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              + Nouvelle Discipline
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Rechercher une discipline..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Disciplines List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Disciplines ({filteredDisciplines.length})
              </h2>
              <div className="flex items-center space-x-2">
                {loading && (
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Chargement...
                  </div>
                )}
                <button
                  onClick={() => loadDisciplines()}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  disabled={loading}
                >
                  🔄 Actualiser
                </button>
              </div>
            </div>
            {error && (
              <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom de la Discipline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDisciplines.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Chargement des disciplines...
                        </div>
                      ) : searchTerm ? (
                        <div>
                          <p className="text-lg font-medium">Aucune discipline trouvée</p>
                          <p className="text-sm">Aucune discipline ne correspond à votre recherche "{searchTerm}"</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-lg font-medium">Aucune discipline</p>
                          <p className="text-sm">Commencez par créer votre première discipline</p>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredDisciplines.map((discipline) => (
                    <tr key={discipline.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">#{discipline.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{discipline.nom}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          Modifier
                        </button>
                        <button 
                          onClick={() => handleDeleteDiscipline(discipline.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal pour créer une discipline */}
      {showCreateForm && (
        <CreateDisciplineModal 
          onClose={() => {
            setShowCreateForm(false);
            setCreateError(null);
          }}
          onCreate={handleCreateDiscipline}
          loading={createLoading}
          error={createError}
        />
      )}

      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}

// Composant modal pour créer une discipline
interface CreateDisciplineModalProps {
  onClose: () => void;
  onCreate: (disciplineData: CreateDisciplineRequest) => void;
  loading: boolean;
  error: string | null;
}

function CreateDisciplineModal({ onClose, onCreate, loading, error }: CreateDisciplineModalProps) {
  const [formData, setFormData] = useState<CreateDisciplineRequest>({
    nom: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.nom.trim()) {
      onCreate(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold mb-4">Créer une nouvelle discipline</h3>
        
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom de la discipline
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Athlétisme"
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
