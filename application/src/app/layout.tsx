/**
 * Layout principal de l'application AdminJO
 * 
 * Ce layout définit la structure HTML de base et les providers globaux
 * pour toute l'application. Il intègre le système d'authentification
 * et la protection des routes au niveau le plus haut.
 * 
 * Fonctionnalités :
 * - Configuration des polices Google Fonts (Geist)
 * - Métadonnées de l'application
 * - Provider d'authentification global
 * - Protection AuthGuard pour toutes les pages
 * - Styles globaux et thème DaisyUI
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthGuard from "@/components/connexion/authGuard";
import { AuthProvider } from "@/contexts/authContext";

// Configuration de la police principale Geist Sans
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Configuration de la police monospace Geist Mono
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Métadonnées de l'application
export const metadata: Metadata = {
  title: "Administration Ticket JO 2024",
  description: "Interface d'administration pour la gestion des Jeux Olympiques 2024",
};

/**
 * Layout racine de l'application
 * 
 * Structure la hiérarchie des providers et des composants de protection :
 * 1. HTML/Body avec polices et thème
 * 2. AuthProvider pour l'état d'authentification global
 * 3. AuthGuard pour la protection des routes
 * 4. Contenu de l'application
 * 
 * @param props - Props contenant les composants enfants
 * @returns JSX.Element - La structure HTML complète
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" data-theme="acid">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Provider d'authentification global */}
        <AuthProvider>
          {/* Protection par authentification de toute l'application */}
          <AuthGuard>
            {children}
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
