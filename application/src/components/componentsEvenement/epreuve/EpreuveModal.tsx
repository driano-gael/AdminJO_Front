import { useState, useEffect } from 'react';
import { CreateEpreuveRequest } from '@/lib/api/services/evenementSports/epreuveService';
import { Epreuve } from '@/types/sportEvenement/epreuve';
import { Discipline } from '@/types/sportEvenement/discipline';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (epreuveData: CreateEpreuveRequest) => void;
    loading: boolean;
    error: string | null;
    epreuve?: Epreuve;
    disciplines: Discipline[];
}

export default function EpreuveModal({ 
    isOpen, 
    onClose, 
    onSave, 
    loading, 
    error, 
    epreuve,
    disciplines
}: Props) {
    const [formData, setFormData] = useState<CreateEpreuveRequest>({
      libelle: '',
      disciplineId: 0
    });

    // Déterminer si c'est une création ou une modification
    const isEditing = Boolean(epreuve);
    const title = isEditing ? 'Modifier l\'épreuve' : 'Créer une nouvelle épreuve';
    const submitLabel = isEditing ? 'Modifier' : 'Créer';
    const loadingLabel = isEditing ? 'Modification...' : 'Création...';

    // Initialiser le formulaire avec les données de l'épreuve en mode édition
    useEffect(() => {
      if (epreuve) {
        setFormData({
          libelle: epreuve.libelle,
          disciplineId: epreuve.discipline.id
        });
      } else {
        setFormData({
          libelle: '',
          disciplineId: disciplines.length > 0 ? disciplines[0].id : 0
        });
      }
    }, [epreuve, disciplines]);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (formData.libelle.trim() && formData.disciplineId > 0) {
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Libellé de l'épreuve
                        </label>
                        <input
                            type="text"
                            value={formData.libelle}
                            onChange={(e) => setFormData({ ...formData, libelle: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ex: 100m sprint, Saut en hauteur..."
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Discipline
                        </label>
                        <select
                            value={formData.disciplineId}
                            onChange={(e) => setFormData({ ...formData, disciplineId: Number(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value={0}>Sélectionner une discipline</option>
                            {disciplines.map((discipline) => (
                                <option key={discipline.id} value={discipline.id}>
                                    {discipline.nom}
                                </option>
                            ))}
                        </select>
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
                            disabled={loading || formData.disciplineId === 0}
                        >
                            {loading ? loadingLabel : submitLabel}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
