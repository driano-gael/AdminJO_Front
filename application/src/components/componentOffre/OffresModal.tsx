import {useEffect, useState} from 'react';
import {Offre} from "@/types/offre/offre";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (offreData: Offre) => void;
  loading: boolean;
  offre?: Offre;
}


export default function OffreModal({
                                     isOpen,
                                     onClose,
                                     onSave,
                                     loading,
                                     offre
                                   }: Props) {
  const [formData, setFormData] = useState<Offre>({
    id: 0,
    libelle: '',
    description: '',
    nb_personne: 0,
    montant: 0,
  });

  // Déterminer si c'est une création ou une modification
  const isEditing = Boolean(offre);
  const title = isEditing ? `Modifier l'offre` : 'Créer une nouvelle offre';
  const submitLabel = isEditing ? 'Modifier' : 'Créer';
  const loadingLabel = isEditing ? 'Modification...' : 'Création...';

  // Initialiser le formulaire avec les données de la discipline en mode édition
  useEffect(() => {
    if (offre) {
      setFormData({
        id: offre.id,
        libelle: offre.libelle,
        description: offre.description,
        nb_personne: offre.nb_personne,
        montant: offre.montant,
      });
    } else {
      setFormData({
        id: 0,
        libelle: '',
        description: '',
        nb_personne: 0,
        montant: 0,
      });
    }
  }, [offre]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.libelle.trim()) {
      onSave(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-center mb-4" style={{minHeight: '3rem'}}>
          <h3 className="text-lg text-black font-semibold">{title}</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de l&apos;offre
            </label>
            <input
              type="text"
              value={formData.libelle}
              onChange={(e) => setFormData({...formData, libelle: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="libellé de l'offre"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description de l&apos;offre
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="description de l'offre"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de personnes
            </label>
            <input
              type="number"
              value={formData.nb_personne}
              onChange={(e) => setFormData({...formData, nb_personne: Number(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="nombre de personnes"
              step="1"
              inputMode="numeric"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prix de l&apos;offre
            </label>
            <input
              type="number"
              value={formData.montant}
              onChange={(e) => setFormData({...formData, montant: Number(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="prix de l'offre"
              step="0.01"
              inputMode="decimal"
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
