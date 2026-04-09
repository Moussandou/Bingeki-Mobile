# Cahier des Charges Technico-Fonctionnel : Bingeki Mobile

## 1. Présentation du Projet
**Nom :** Bingeki Mobile (Portage de Bingeki-V2)
**Objectif :** Créer une application mobile native (iOS/Android) offrant une expérience fluide de suivi d'anime et de manga, incluant la gestion de bibliothèque, le scan Lens, et un système de gamification poussé.

---

## 2. Stack Technique de Référence
L'architecture doit être pensée pour la performance et la réutilisation de la logique métier existante.

*   **Framework :** React Native avec **Expo (Managed Workflow)**.
*   **Navigation :** **Expo Router** (basé sur le système de fichiers, type Next.js).
*   **Langage :** TypeScript (strict).
*   **État Global :** **Zustand** (Migration directe des stores web).
*   **Backend :** Firebase (Authentication, Firestore, Cloud Functions).
*   **Animations :** React Native Reanimated 3 + Moti.
*   **Style :** NativeWind (pour conserver la syntaxe Tailwind) ou StyleSheet standard.
*   **Cache Image :** `expo-image` pour des performances optimales sur les listes lourdes.

---

## 3. Architecture des Données (Stores à migrer)

### A. AuthStore
*   Gestion de la session Firebase.
*   Support du Google Sign-In natif (via `expo-auth-session` ou `react-native-firebase/auth`).

### B. LibraryStore
*   Synchronisation temps réel avec Firestore.
*   Gestion des statuts (Planning, Watching, Completed, Dropped).
*   Persistance locale (via Zustand Middleware `persist`) pour accès hors-ligne.

### C. GamificationStore
*   Système d'XP, niveaux et badges.
*   Calcul des statistiques de visionnage.
*   Synchronisation des "Assets" et récompenses.

### D. SettingsStore
*   Thèmes (Nuit, Sombre, Clair, System).
*   Préférences linguistiques (i18next).
*   Paramètres de confidentialité et notifications.

---

## 4. Écrans et Navigation (Structure Expo Router)

```text
app/
├── (auth)/             # Parcours connexion/inscription
│   ├── login.tsx
│   └── register.tsx
├── (tabs)/             # Navigation principale (Bottom Tab Bar)
│   ├── index.tsx       # Dashboard (Stats, Dernières activités)
│   ├── discover.tsx    # Recherche et Exploration
│   ├── library.tsx     # Bibliothèque de l'utilisateur
│   ├── social.tsx      # Amis et Activité mondiale
│   └── profile.tsx     # Profil et Paramètres
├── work/
│   └── [id].tsx        # Détails d'un Anime/Manga (WorkDetails)
├── lens/
│   └── scanner.tsx     # Scanner Lens intégré
└── _layout.tsx         # Configuration Root (Providers, Navigation)
```

---

## 5. Fonctionnalités Clés et Adaptations

### 5.1 Recherche & Découverte
*   **Infinite Scroll :** Utilisation de `FlashList` (Shopify) pour des listes de 1000+ items sans lag.
*   **Skeleton Loading :** États de chargement fluides pour chaque carte de média.

### 5.2 Expérience Native-First
*   **Gestes :** "Swipe to action" dans la bibliothèque (ex: glisser à droite pour incrémenter un chapitre/épisode).
*   **Haptics :** Vibrations discrètes lors de l'ajout d'un item ou de la montée en niveau (XP).
*   **Bottom Sheets :** Utilisation de `@gorhom/bottom-sheet` pour les menus contextuels et l'édition rapide d'items de la librairie.

### 5.3 Multimedia
*   **Vidéo :** Intégration de YouTube IFrame pour les trailers.
*   **3D (Optionnel) :** Utilisation de `@react-three/fiber` pour les éléments premium (ex: cartes de profil interactives).

### 5.4 Offline Support
*   Firestore doit être configuré avec la persistance locale activée par défaut.
*   Gestion des "optimistic updates" pour que l'utilisateur puisse modifier sa bibliothèque même dans le métro.

---

## 6. APIs et Services (Logique à porter)

*   **AnimeApi / LensApi :** Adapter les headers et la gestion des erreurs réseau pour le mobile (gestion du signal faible).
*   **MAL Import :** Gestion automatique de l'import MyAnimeList via les cloud functions sécurisées.

---

## 7. Roadmap de Développement

1.  **Phase 1 (Setup) :** Initialisation Expo, Firebase Native, Auth Flow.
2.  **Phase 2 (Logic) :** Portage des stores Zustand et synchronisation Firestore.
3.  **Phase 3 (UI Core) :** Création des listes Discover et Library (Focus performance).
4.  **Phase 4 (Pages) :** Développement de la page WorkDetails et Social.
5.  **Phase 5 (Polish) :** Animations Reanimated, Notifications Push, Deep Linking.
6.  **Phase 6 (QA) :** Tests sur simulateurs et appareils réels (Android/iOS).

---

## 8. Critères de Performance
*   **Frame rate :** Stable à 60 FPS sur les transitions.
*   **Payload :** Optimization des images avec `sharp` côté backend pour minimiser la data mobile.
*   **Bundle Size :** Minimisation des dépendances pour une installation rapide.
