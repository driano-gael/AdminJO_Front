'use client';

import { useState, useEffect } from 'react';
import { lieuApi } from '@/lib/api/eventServices';
import { Lieu } from '@/types/apiEvenement/lieu';
import { CreateLieuRequest } from '@/lib/api/eventServices/lieuService';
import Notification from '@/components/notification';
import { useAuth } from '@/contexts/authContext';
import { useSessionExpiry } from '@/hooks/useSessionExpiry';

interface LieuxManagementProps {
  onBack: () => void;
}

export default function LieuxManagement({ onBack }: LieuxManagementProps) {
  const { isAuthenticated, user } = useAuth();
  
  // Gérer l'expiration de session
  useSessionExpiry();
  
  const [lieux, setLieux] = useState<Lieu[]>([]);
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

  // Fonction pour charger les lieux depuis l'API avec recherche
  const loadLieux = async (searchQuery?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const apiLieux = await lieuApi.getAll(searchQuery ? {
        nom: searchQuery
      } : undefined);
      
      setLieux(apiLieux);
      console.log('Lieux chargés depuis l\'API:', apiLieux);
    } catch (err) {
      setError('Erreur lors du chargement des lieux');
      console.error('Erreur chargement lieux:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour effectuer une recherche recherche rapide des lieux
  // Si le champ de recherche est vide, on recharge tous les lieux
  const handleSearch = async (query: string) => {
    setSearchTerm(query);
    if (query.trim()) {
      await loadLieux(query);
    } else {
      await loadLieux();
    }
  };

  // Fonction pour créer un nouveau lieu
  const handleCreateLieu = async (lieuData: CreateLieuRequest) => {
    try {
      setCreateLoading(true);
      setCreateError(null);
      
      console.log('🏗️ Creating lieu with auth status:', { isAuthenticated, user: user?.email });
      
      const newLieu = await lieuApi.create(lieuData);
      
      setLieux(prev => [...prev, newLieu]);
      setShowCreateForm(false);
      setNotification({
        message: 'Lieu créé avec succès !',
        type: 'success'
      });
      console.log('Lieu créé avec succès:', newLieu);
    } catch (err) {
      setCreateError('Erreur lors de la création du lieu');
      console.error('Erreur création lieu:', err);
    } finally {
      setCreateLoading(false);
    }
  };

  // Fonction pour supprimer un lieu
  const handleDeleteLieu = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce lieu ?')) return;
    
    try {
      await lieuApi.delete(id);
      setLieux(prev => prev.filter(lieu => lieu.id !== id));
      setNotification({
        message: 'Lieu supprimé avec succès !',
        type: 'success'
      });
      console.log('Lieu supprimé avec succès:', id);
    } catch (err) {
      console.error('Erreur suppression lieu:', err);
      setNotification({
        message: 'Erreur lors de la suppression du lieu',
        type: 'error'
      });
    }
  };

  // Charger les lieux au montage du composant
  useEffect(() => {
    if (isAuthenticated) {
      loadLieux();
    } else {
      console.warn('⚠️ User not authenticated, cannot load lieux');
    }
  }, [isAuthenticated]);

  // Si l'utilisateur n'est pas connecté, afficher un message
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Accès non autorisé
          </h2>
          <p className="text-gray-600 mb-4">
            Vous devez être connecté pour accéder à cette page.
          </p>
          <button
            onClick={onBack}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Retour au dashboard
          </button>
        </div>
      </div>
    );
  }

  // Fonction pour filtrer les lieux affichés
  const filteredLieux = lieux.filter(lieu => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return lieu.nom.toLowerCase().includes(searchLower);
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
                🏢 Gestion des Lieux
              </h1>
            </div>
            <button 
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              + Nouveau Lieu
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
              placeholder="Rechercher un lieu..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Lieux List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Lieux ({filteredLieux.length})
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
                  onClick={() => loadLieux()}
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
                    Nom du Lieu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLieux.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Chargement des lieux...
                        </div>
                      ) : searchTerm ? (
                        <div>
                          <p className="text-lg font-medium">Aucun lieu trouvé</p>
                          <p className="text-sm">Aucun lieu ne correspond à votre recherche "{searchTerm}"</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-lg font-medium">Aucun lieu</p>
                          <p className="text-sm">Commencez par créer votre premier lieu</p>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredLieux.map((lieu) => (
                    <tr key={lieu.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">#{lieu.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{lieu.nom}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          Modifier
                        </button>
                        <button 
                          onClick={() => handleDeleteLieu(lieu.id)}
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

      {/* Modal pour créer un lieu */}
      {showCreateForm && (
        <CreateLieuModal 
          onClose={() => {
            setShowCreateForm(false);
            setCreateError(null);
          }}
          onCreate={handleCreateLieu}
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

// Composant modal pour créer un lieu
interface CreateLieuModalProps {
  onClose: () => void;
  onCreate: (lieuData: CreateLieuRequest) => void;
  loading: boolean;
  error: string | null;
}

function CreateLieuModal({ onClose, onCreate, loading, error }: CreateLieuModalProps) {
  const [formData, setFormData] = useState<CreateLieuRequest>({
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
        <h3 className="text-lg font-semibold mb-4">Créer un nouveau lieu</h3>
        
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom du lieu
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Stade de France"
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
