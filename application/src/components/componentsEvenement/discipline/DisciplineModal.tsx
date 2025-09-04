import { useState, useEffect } from 'react';
import { CreateDisciplineRequest } from '@/lib/api/services/evenementSports/disciplineService';
import { Discipline } from '@/types/sportEvenement/discipline';
import Image from 'next/image';

// Liste des icônes disponibles dans le dossier sportSVG
const SPORT_ICONS = [
  'alp.svg', 'arc.svg', 'ath.svg', 'bdm.svg', 'bk3.svg', 'bkb.svg', 'bkg.svg', 'bmf.svg',
  'bmx.svg', 'bob.svg', 'box.svg', 'bs5.svg', 'bsb.svg', 'bth.svg', 'ccs.svg', 'ckt.svg',
  'clb.svg', 'crd.svg', 'csl.svg', 'csp.svg', 'ctr.svg', 'cur.svg', 'div.svg', 'equ.svg',
  'fbl.svg', 'fen.svg', 'flf.svg', 'frs.svg', 'fsk.svg', 'fut.svg', 'gac (1).svg', 'gar.svg',
  'glf.svg', 'gry.svg', 'gtr.svg', 'hbb.svg', 'hbl.svg', 'hoc.svg', 'iho.svg', 'jud.svg',
  'kte.svg', 'lax.svg', 'lug.svg', 'mpn.svg', 'mtb.svg', 'ncb.svg', 'ows.svg', 'roc.svg',
  'rol.svg', 'row.svg', 'ru7.svg', 'sal.svg', 'sbd.svg', 'sho.svg', 'sjp.svg', 'skb.svg',
  'skn.svg', 'smt.svg', 'squ.svg', 'srf.svg', 'ssk.svg', 'stk.svg', 'swa.svg', 'swm.svg',
  'ten.svg', 'tkw.svg', 'tri.svg', 'tte.svg', 'vbv.svg', 'vvo.svg', 'wlf.svg', 'wpo.svg',
  'wre.svg', 'wsu.svg'
];

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
      nom: '',
      icone: ''
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
          nom: discipline.nom,
          icone: discipline.icone || ''
        });
      } else {
        setFormData({
          nom: '',
          icone: ''
        });
      }
    }, [discipline]);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (formData.nom.trim()) {
        onSave(formData);
      }
    };

    const handleIconSelect = (iconName: string) => {
      // Stocker le chemin relatif depuis le dossier public
      const relativePath = `/images/sportSVG/${iconName}`;
      setFormData({ ...formData, icone: relativePath });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-center mb-4" style={{ minHeight: '3rem' }}>
                    <h3 className="text-lg text-black font-semibold">{title}</h3>
                </div>

                {error && (
                    <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
                        {error}
                    </div>
                )}
              
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nom de la discipline
                        </label>
                        <input
                            type="text"
                            value={formData.nom}
                            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ex: Athlétisme, Natation, Basketball..."
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Icône de la discipline
                        </label>
                        {formData.icone && (
                            <div className="mb-3 flex items-center space-x-2">
                                <span className="text-sm text-gray-600">Icône sélectionnée :</span>
                                <Image
                                    src={formData.icone}
                                    alt="Icône sélectionnée"
                                    width={32}
                                    height={32}
                                    className="w-8 h-8"
                                    unoptimized
                                />
                                <span className="text-sm text-gray-500">{formData.icone}</span>
                            </div>
                        )}

                        <div className="border rounded-md p-3 max-h-48 overflow-y-auto">
                            <div className="grid grid-cols-8 gap-2">
                                {SPORT_ICONS.map((icon) => {
                                    const relativeIconPath = `/images/sportSVG/${icon}`;
                                    return (
                                        <button
                                            key={icon}
                                            type="button"
                                            onClick={() => handleIconSelect(icon)}
                                            className={`p-2 rounded border-2 hover:bg-gray-50 transition-colors ${
                                                formData.icone === relativeIconPath 
                                                    ? 'border-blue-500 bg-blue-50' 
                                                    : 'border-gray-200'
                                            }`}
                                            title={icon.replace('.svg', '')}
                                        >
                                            <Image
                                                src={`/images/sportSVG/${icon}`}
                                                alt={icon.replace('.svg', '')}
                                                width={24}
                                                height={24}
                                                className="w-6 h-6 mx-auto"
                                                unoptimized
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Cliquez sur une icône pour la sélectionner
                        </p>
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
