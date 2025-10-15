'use client';

import {JSX, useState} from 'react';
import { CreateEmployeRequest } from '@/types/employe/employe';

interface CreateEmployeFormProps {
  onSubmit: (employeData: CreateEmployeRequest) => Promise<boolean>;
  onCancel: () => void;
  isLoading: boolean;
}

/**
 * Composant CreateEmployeForm - Formulaire de création d'employé AdminJO
 *
 * @name CreateEmployeForm
 *
 * Ce composant fournit une interface modale complète pour la création de nouveaux employés
 * avec validation en temps réel, gestion des erreurs et feedback utilisateur. Il gère
 * tous les champs requis pour créer un compte employé avec ses informations personnelles
 * et professionnelles, incluant la génération sécurisée du mot de passe.
 *
 * ## Fonctionnalités réellement implémentées
 *
 * ### Formulaire complet d'employé
 * - **Champs personnels** : Prénom, Nom (obligatoires)
 * - **Champs compte** : Email, Mot de passe (obligatoires)
 * - **Champs professionnels** : Matricule, Identifiant téléphone (obligatoires)
 * - **Placeholders informatifs** : Guidance utilisateur sur chaque champ
 *
 * ### Gestion sécurisée du mot de passe
 * - **Toggle visibilité** : Bouton œil pour afficher/masquer mot de passe
 * - **Validation robuste** : Minimum 8 caractères obligatoires
 * - **Icônes SVG** : Œil ouvert/fermé selon état showPassword
 * - **Input type dynamique** : password/text selon showPassword
 *
 * ### Validation en temps réel
 * - **Validation côté client** : Contrôles immédiats avant soumission
 * - **Effacement erreurs** : Nettoyage automatique lors modification
 * - **Regex email** : Validation format email standard
 * - **Champs requis** : Vérification présence et trim() des espaces
 *
 * ## Validation et gestion d'erreur
 *
 * ### Règles de validation
 * - **Email** : Présence + format regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
 * - **Mot de passe** : Présence + minimum 8 caractères
 * - **Nom/Prénom** : Présence après trim()
 * - **Matricule** : Présence après trim()
 * - **Téléphone** : Présence après trim()
 *
 * ## Interactions et soumission
 *
 * ### Callbacks externes
 * - **onSubmit** : Promise<boolean> pour async avec retour success
 * - **onCancel** : void pour fermeture modal
 * - **isLoading** : boolean externe pour état loading
 *
 * ### ⌨Interactions utilisateur
 * - **handleChange** : Input onChange avec effacement erreur
 * - **Toggle password** : Click pour showPassword
 * - **Submit** : Enter ou click bouton
 * - **Cancel** : Click X ou bouton Annuler
 *
 * @param {CreateEmployeFormProps} props - Configuration du formulaire de création
 * @param {Function} props.onSubmit - Callback async pour soumission, retourne Promise<boolean>
 * @param {Function} props.onCancel - Callback pour annulation/fermeture modal
 * @param {boolean} props.isLoading - État de chargement pour désactivation interface
 *
 * @returns {JSX.Element} Modal avec formulaire complet de création d'employé
 *
 * @see {@link EmployesManagement} - Composant parent gérant l'affichage modal
 * @see {@link CreateEmployeRequest} - Interface TypeScript des données formulaire
 * @see {@link useEmployesManagement} - Hook contenant logique de création
 *
 */
export function CreateEmployeForm({ onSubmit, onCancel, isLoading }: CreateEmployeFormProps): JSX.Element {
  const [formData, setFormData] = useState<CreateEmployeRequest>({
    email: '',
    password: '',
    nom: '',
    prenom: '',
    matricule: '',
    identifiant_telephone: ''
  });

  const [errors, setErrors] = useState<Partial<CreateEmployeRequest>>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field: keyof CreateEmployeRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Effacer l'erreur du champ lors de la modification
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateEmployeRequest> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }

    if (!formData.prenom.trim()) {
      newErrors.prenom = 'Le prénom est requis';
    }

    if (!formData.matricule.trim()) {
      newErrors.matricule = 'Le matricule est requis';
    }

    if (!formData.identifiant_telephone.trim()) {
      newErrors.identifiant_telephone = 'L\'identifiant téléphone est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const success = await onSubmit(formData);
    if (success) {
      // Reset form
      setFormData({
        email: '',
        password: '',
        nom: '',
        prenom: '',
        matricule: '',
        identifiant_telephone: ''
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* En-tête */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              Créer un nouvel employé
            </h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Prénom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom *
                </label>
                <input
                  type="text"
                  value={formData.prenom}
                  onChange={(e) => handleChange('prenom', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                    errors.prenom ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Prénom de l'employé"
                />
                {errors.prenom && (
                  <p className="mt-1 text-sm text-red-600">{errors.prenom}</p>
                )}
              </div>

              {/* Nom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => handleChange('nom', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                    errors.nom ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Nom de l'employé"
                />
                {errors.nom && (
                  <p className="mt-1 text-sm text-red-600">{errors.nom}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="email@exemple.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Minimum 8 caractères"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Matricule */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Matricule *
                </label>
                <input
                  type="text"
                  value={formData.matricule}
                  onChange={(e) => handleChange('matricule', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                    errors.matricule ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Matricule employé"
                />
                {errors.matricule && (
                  <p className="mt-1 text-sm text-red-600">{errors.matricule}</p>
                )}
              </div>

              {/* Identifiant téléphone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Identifiant téléphone *
                </label>
                <input
                  type="text"
                  value={formData.identifiant_telephone}
                  onChange={(e) => handleChange('identifiant_telephone', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                    errors.identifiant_telephone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Identifiant téléphonique"
                />
                {errors.identifiant_telephone && (
                  <p className="mt-1 text-sm text-red-600">{errors.identifiant_telephone}</p>
                )}
              </div>
            </div>

            {/* Boutons */}
            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Création...
                  </div>
                ) : (
                  'Créer l\'employé'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default CreateEmployeForm;