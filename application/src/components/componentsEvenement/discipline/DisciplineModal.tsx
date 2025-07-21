import { useState, useEffect } from 'react';
import { CreateDisciplineRequest } from '@/lib/api/services/evenementSports/disciplineService';
import { Discipline } from '@/types/sportEvenement/discipline';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (disciplineData: CreateDisciplineRequest) => void;
    loading: boolean;
    error: string | null;
    discipline?: Discipline;
}

export default function DisciplineModal({ 
    isOpen, 
    onClose, 
    onSave, 
    loading, 
    error, 
    discipline
}: Props) {
    const [formData, setFormData] = useState<CreateDisciplineRequest>({
      nom: ''
    });

    // Déterminer si c'est une création ou une modification
    const isEditing = Boolean(discipline);
    const title = isEditing ? 'Modifier la discipline' : 'Créer une nouvelle discipline';
    const submitLabel = isEditing ? 'Modifier' : 'Créer';
    const loadingLabel = isEditing ? 'Modification...' : 'Création...';

    // Initialiser le formulaire avec les données de la discipline en mode édition
    useEffect(() => {
      if (discipline) {
        setFormData({
          nom: discipline.nom
        });
      } else {
        setFormData({
          nom: ''
        });
      }
    }, [discipline]);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (formData.nom.trim()) {
        onSave(formData);
      }
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex items-center justify-center mb-4" style={{ minHeight: '3rem' }}>
                    <h3 className="text-lg text-black font-semibold">{title}</h3>
                </div>

                {error && (
                    <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
                        {error}
                    </div>
                )}
              
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            value={formData.nom}
                            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ex: Athlétisme, Natation, Basketball..."
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
                            {loading ? loadingLabel : submitLabel}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
