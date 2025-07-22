'use client';

import { useAuth } from '@/contexts/authContext';
import PageTemplate from '@/components/layout/PageTemplate';

/**
 * Page Paramètres - Route: /settings
 * 
 * Interface dédiée aux paramètres de l'application
 */
export default function SettingsPage() {
    const { user } = useAuth();

    return (
        <PageTemplate
            title="⚙️ Paramètres"
            breadcrumbs={[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Paramètres' }
            ]}
            intro={{
                title: "Configuration de l'Application",
                description: "Personnalisez les paramètres de votre environnement"
            }}
        >
            {/* Grille des sections de paramètres */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Paramètres du profil */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                        👤 Profil Utilisateur
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rôle
                            </label>
                            <input
                                type="text"
                                value="Administrateur"
                                disabled
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                            />
                        </div>
                    </div>
                </div>

                {/* Paramètres de sécurité */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                        🔒 Sécurité
                    </h3>
                    <div className="space-y-4">
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                            Changer le mot de passe
                        </button>
                        <button className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                            Configurer 2FA
                        </button>
                    </div>
                </div>

                {/* Paramètres de l'application */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                        🎛️ Préférences
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Notifications</span>
                            <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Mode sombre</span>
                            <input type="checkbox" className="toggle toggle-primary" />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Auto-save</span>
                            <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                        </div>
                    </div>
                </div>

                {/* Informations système */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                        ℹ️ Informations Système
                    </h3>
                    <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex justify-between">
                            <span>Version:</span>
                            <span className="font-medium">1.0.0</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Dernière mise à jour:</span>
                            <span className="font-medium">07/01/2025</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Environnement:</span>
                            <span className="font-medium">Production</span>
                        </div>
                    </div>
                </div>
            </div>
        </PageTemplate>
    );
}
