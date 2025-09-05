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
    nb_personne: 1,
    montant: 0,
  });

  // États pour les champs numériques en string pour un meilleur contrôle
  const [nbPersonneInput, setNbPersonneInput] = useState<string>('1');
  const [montantInput, setMontantInput] = useState<string>('');

  // Déterminer si c'est une création ou une modification
  const isEditing = Boolean(offre);
  const title = isEditing ? `Modifier l'offre` : 'Créer une nouvelle offre';
  const submitLabel = isEditing ? 'Modifier' : 'Créer';
  const loadingLabel = isEditing ? 'Modification...' : 'Création...';

  // Initialiser le formulaire avec les données de l'offre en mode édition
  useEffect(() => {
    if (offre) {
      setFormData({
        id: offre.id,
        libelle: offre.libelle,
        description: offre.description,
        nb_personne: offre.nb_personne,
        montant: offre.montant,
      });
      setNbPersonneInput(offre.nb_personne.toString());
      setMontantInput(offre.montant.toFixed(2));
    } else {
      setFormData({
        id: 0,
        libelle: '',
        description: '',
        nb_personne: 1,
        montant: 0,
      });
      setNbPersonneInput('1');
      setMontantInput('');
    }
  }, [offre]);

  // Gestion du nombre de personnes
  const handleNbPersonneChange = (value: string) => {
    // Permettre seulement les nombres entiers positifs
    if (value === '' || /^\d+$/.test(value)) {
      setNbPersonneInput(value);
      const numValue = value === '' ? 0 : parseInt(value, 10);
      setFormData({...formData, nb_personne: numValue});
    }
  };

  const adjustNbPersonne = (increment: number) => {
    const currentValue = parseInt(nbPersonneInput) || 0;
    const newValue = Math.max(1, currentValue + increment);
    setNbPersonneInput(newValue.toString());
    setFormData({...formData, nb_personne: newValue});
  };

  // Gestion du montant
  const handleMontantChange = (value: string) => {
    // Permettre seulement les nombres avec maximum 2 décimales
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setMontantInput(value);
      const numValue = value === '' ? 0 : parseFloat(value) || 0;
      setFormData({...formData, montant: numValue});
    }
  };

  const adjustMontant = (increment: number) => {
    const currentValue = parseFloat(montantInput) || 0;
    const newValue = Math.max(0, currentValue + increment);
    const formattedValue = newValue.toFixed(2);
    setMontantInput(formattedValue);
    setFormData({...formData, montant: newValue});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.libelle.trim() && formData.nb_personne > 0) {
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

          {/* Champ nombre de personnes amélioré */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de personnes
            </label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => adjustNbPersonne(-1)}
                className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                -
              </button>
              <input
                type="text"
                value={nbPersonneInput}
                onChange={(e) => handleNbPersonneChange(e.target.value)}
                onBlur={() => {
                  if (nbPersonneInput === '' || parseInt(nbPersonneInput) < 1) {
                    setNbPersonneInput('1');
                    setFormData({...formData, nb_personne: 1});
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 text-black text-center rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1"
                min="1"
              />
              <button
                type="button"
                onClick={() => adjustNbPersonne(1)}
                className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                +
              </button>
              <span className="text-sm text-gray-500 ml-2">personnes</span>
            </div>
          </div>

          {/* Champ montant amélioré */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prix de l&apos;offre
            </label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => adjustMontant(-0.50)}
                className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                -
              </button>
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                <input
                  type="text"
                  value={montantInput}
                  onChange={(e) => handleMontantChange(e.target.value)}
                  onBlur={() => {
                    if (montantInput !== '' && !isNaN(parseFloat(montantInput))) {
                      const formatted = parseFloat(montantInput).toFixed(2);
                      setMontantInput(formatted);
                    }
                  }}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
              <button
                type="button"
                onClick={() => adjustMontant(0.50)}
                className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                +
              </button>
            </div>
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
              disabled={loading || formData.nb_personne < 1}
            >
              {loading ? loadingLabel : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
