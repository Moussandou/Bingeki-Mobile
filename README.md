# ⚡ BINGEKI MOBILE

[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)](https://firebase.google.com/)

**Bingeki Mobile** is a premium anime and manga tracking application built with a **Manga Brutalist** aesthetic. It combines high-octane visual design with seamless performance to help you discover, track, and level up your otaku journey.

---

## ✨ Features

- **🎨 Manga Brutalist UI**: A unique, high-contrast design system featuring halftone patterns, speedlines, and heavy-stroke brutalist elements.
- **🚀 Real-time Tracking**: Sync your progress (chapters/episodes) instantly across devices.
- **📊 Gamification System**: Earn XP, level up your rank, and maintain your streak as you consume content.
- **🔍 Deep Exploration**: Search thousands of anime and manga titles powered by the **Jikan API (MyAnimeList)**.
- **🔐 Secure Sync**: Firebase-powered authentication to keep your library and stats safe.
- **🎭 Dynamic Themes**: Fully responsive design with support for Light and Dark modes.

---

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev/) (SDK 54)
- **Library**: [React Native](https://reactnative.dev/) (v0.81)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Database/Auth**: [Firebase](https://firebase.google.com/)
- **Animations**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- **Styling**: Native Styles with custom **Brutalist Component System**
- **Data Source**: [Jikan API](https://jikan.moe/)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/go) app on your device (or an emulator)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/Bingeki-Mobile.git
   cd Bingeki-Mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory and add your Firebase/API keys:
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=your_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
   ...
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

---

## 📂 Project Structure

```text
.
├── app/            # Expo Router pages
├── components/     # UI components
├── constants/      # Theme tokens
├── hooks/          # Custom hooks
├── services/       # API & Firebase
├── store/          # Zustand state
├── utils/          # Helpers
├── docs/           # Project documentation
└── CAHIER_DES_CHARGES_MOBILE.md  # Detailed specifications
```

---

## 🖌️ Design Philosophy: "Manga Brutalist"

Bingeki-Mobile isn't just an app; it's a visual statement. We've merged the raw, unapologetic energy of **Neo-Brutalism** with the iconic visual language of **Japanese Manga**. Expect:
- **Halftone Patterns**: Classic screen-tone dots for depth.
- **Speedlines**: Kinetic energy reflected in UI transitions.
- **Heavy Borders**: Thick, comic-style outlines on every interactive element.
- **SFX Typography**: High-impact text overlays for an immersive experience.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ for the Otaku community by <b>Moussandou</b>
</p>
