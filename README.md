# DailyMood Journal 📔

A comprehensive daily diary journal app built with React Native (Expo), focusing on privacy, customization, mood tracking, and rich content creation for personal journaling.

## 🎯 Project Overview

This is a learning project to master React Native mobile development while building a full-featured diary application. The app provides a secure, customizable platform for users to record their daily thoughts, experiences, and emotions with rich media support, mood tracking, and beautiful themes.

### Key Features

- 🔒 **Security & Privacy**: Password/biometric lock, encrypted local storage
- 📝 **Rich Content Editor**: Text formatting, fonts, colors, lists, media attachments
- 😊 **Mood Tracking**: Emoji-based mood selection with statistics and calendar integration
- 🎨 **Customization**: Multiple themes, backgrounds, stickers, and templates
- 📅 **Calendar View**: Monthly calendar with mood indicators and "On This Day" feature
- 🏷️ **Organization**: Tags, search, filters for easy entry management
- 📊 **Statistics**: Entry and mood analytics with visual charts
- 👤 **Profile & Settings**: Customizable user profile and app preferences

> **Note**: This project excludes subscription features, ads, backup/restore, and export/import functionality.

## 🛠️ Tech Stack

- **Framework**: React Native with Expo Router (file-based routing)
- **Styling**: NativeWind (Tailwind CSS)
- **State Management**: Zustand (for global UI state only)
- **Data Fetching**: TanStack Query (React Query) for all server state
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Forms**: React Hook Form + Zod validation
- **UI Components**: React Native Reusables
- **Performance**: FlashList (high-performance lists), React Native Reanimated (animations)
- **UI Libraries**: @gorhom/bottom-sheet (bottom sheets)
- **Storage**: react-native-mmkv (fast key-value storage)
- **i18n**: Lingui (internationalization)
- **Language**: TypeScript (strict mode)

## 📁 Project Structure

```text
/app              - Expo Router pages (file-based routing)
/components       - Reusable UI components
  /editor         - Rich text editor components
  /mood           - Mood tracking components
  /themes         - Theme and customization components
  /calendar       - Calendar view components
  /tags           - Tag management components
  /statistics     - Analytics and charts
/lib              - Utilities, configs, validation schemas
/services         - Firebase operations and API layer
/store            - Zustand stores for global state
/hooks            - Custom React hooks
/constants        - App constants, themes, moods, templates
```

## 📚 Planning Documents

- **[FEATURES.md](./FEATURES.md)** - Complete feature list and specifications (16 feature categories)
- **[ROADMAP.md](./ROADMAP.md)** - Detailed 11-phase implementation roadmap (24 weeks)
- **[PROGRESS.md](./PROGRESS.md)** - Progress tracker with checkboxes for all tasks
- **[.cursor/rules/](./.cursor/rules/)** - Cursor project rules (MDC format) - Auto-applies context

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator
- Firebase project (for backend services)

### Installation

1. **Clone and install dependencies**

   ```bash
   npm install
   ```

2. **Install additional packages** (if not already installed)

   ```bash
   # Core dependencies
   npm install @shopify/flash-list @gorhom/bottom-sheet react-native-mmkv

   # Phase-specific dependencies (install as needed)
   npm install expo-image-picker expo-local-authentication
   npm install react-native-chart-kit react-native-calendars
   npm install react-native-image-viewing expo-media-library react-native-svg
   ```

3. **Configure Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password, Google Sign-In)
   - Create Firestore database
   - Enable Storage
   - Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
   - Place config files in project root and `ios/` directory
   - Update Firebase config in `lib/firebase.ts` (if exists)

4. **Start the development server**

   ```bash
   npm start
   # or
   npx expo start
   ```

5. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app (for physical devices)

## 🗺️ Development Roadmap

The project follows an 11-phase implementation plan:

### Phase 1: Foundation & Core Diary (Weeks 1-4)

- Security system (password/biometric lock)
- Diary entry CRUD operations
- Basic list view
- Entry detail view

### Phase 2: Rich Editor & Media (Weeks 5-8)

- Rich text editor with formatting
- Media integration (images/videos)
- Lists and formatting options

### Phase 3: Mood Tracking (Weeks 9-10)

- Mood selection and display
- Mood analytics and statistics

### Phase 4: Themes & Customization (Weeks 11-12)

- Theme system
- Background management
- Eye protection mode

### Phase 5: Calendar & Organization (Weeks 13-14)

- Calendar view
- "On This Day" feature
- Tags system

### Phase 6-11: Templates, Statistics, Profile, Search, Help, Polish

See [ROADMAP.md](./ROADMAP.md) for complete details and [PROGRESS.md](./PROGRESS.md) to track your progress.

## 💻 Development Workflow

1. **Review Planning Documents**
   - Check [FEATURES.md](./FEATURES.md) for feature specifications
   - Follow [ROADMAP.md](./ROADMAP.md) for implementation steps
   - Track progress in [PROGRESS.md](./PROGRESS.md)

2. **Start with Phase 1**
   - Begin with Foundation & Core Diary features
   - Build incrementally, test frequently
   - Complete each phase before moving to the next

3. **Best Practices**
   - Use TypeScript strictly (avoid `any`)
   - Follow React Native best practices
   - Test on both iOS and Android
   - Use TanStack Query for all data fetching
   - Use Zustand only for global UI state
   - Keep code clean and well-organized

4. **Cursor AI Integration**
   - This project includes Cursor rules in `.cursor/rules/`
   - Rules auto-apply context for better AI assistance
   - See [.cursor/rules/](./.cursor/rules/) for available rules

## ✅ Current Status

### Completed

- ✅ Project setup and configuration
- ✅ Firebase configuration structure
- ✅ Authentication screens (sign-in, sign-up, forgot-password)
- ✅ TanStack Query client setup
- ✅ Zustand store structure
- ✅ NativeWind styling configured
- ✅ React Native Reanimated installed
- ✅ Planning documents (Features, Roadmap, Progress tracker)

### In Progress

- ⏳ Phase 1: Foundation & Core Diary

### Upcoming

- 📋 Phase 2-11: See [ROADMAP.md](./ROADMAP.md) for details

## 🏗️ Architecture Principles

- **Expo Router**: File-based routing for navigation
- **TanStack Query**: ALL data fetching (Firebase operations)
- **Zustand**: ONLY for global UI state (not server state)
- **React Hook Form + Zod**: All form validation
- **React Native Reanimated**: All animations (prefer over Animated API)
- **TypeScript**: Strict mode, proper types (avoid `any`)
- **Component Composition**: Reusable, composable components
- **Error Handling**: Proper error states and user feedback

## 📖 Learning Focus

This is a learning project. Focus areas:

- React Native fundamentals and best practices
- Expo Router navigation patterns
- TanStack Query for data fetching
- Firebase integration (Auth, Firestore, Storage)
- Mobile-first UI/UX design
- Smooth animations with React Native Reanimated
- State management patterns
- TypeScript in React Native

## 🔗 Resources

### Documentation

- [Expo Documentation](https://docs.expo.dev/) - Learn Expo fundamentals and advanced topics
- [React Native Documentation](https://reactnative.dev/) - Official React Native docs
- [TanStack Query Docs](https://tanstack.com/query/latest) - React Query documentation
- [Firebase Documentation](https://firebase.google.com/docs) - Firebase services guide

### Tutorials

- [Learn Expo Tutorial](https://docs.expo.dev/tutorial/introduction/) - Step-by-step Expo tutorial
- [React Native Tutorial](https://reactnative.dev/docs/getting-started) - Getting started guide

### Community

- [Expo on GitHub](https://github.com/expo/expo) - Open source platform
- [Expo Discord](https://chat.expo.dev) - Chat with Expo users
- [React Native Community](https://github.com/react-native-community) - Community packages

## 📝 Notes

- Build incrementally, test frequently
- Prioritize user experience and performance
- Keep code clean and well-organized
- Document as you go
- Use TypeScript strictly for type safety
- Follow the roadmap phases sequentially
- Update PROGRESS.md as you complete tasks

## 📄 License

This is a learning project. See individual package licenses for dependencies.

---

**Happy Coding! 🚀**

For questions or issues, refer to the planning documents or check the [Help Center](<./app/(tabs)/help.tsx>) (when implemented).
