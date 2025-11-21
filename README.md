# Note Taker App 📝

A modern note-taking mobile app built with React Native (Expo) to learn mobile development.

## Tech Stack

- **Framework**: React Native with Expo Router
- **Styling**: NativeWind (Tailwind CSS)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Forms**: React Hook Form + Zod
- **UI Components**: React Native Reusables
- **Performance**: FlashList, React Native Reanimated
- **UI Libraries**: @gorhom/bottom-sheet
- **Storage**: react-native-mmkv
- **i18n**: Lingui (optional)
- **Language**: TypeScript

## Project Structure

```text
/app              - Expo Router pages (file-based routing)
/components       - Reusable UI components
/lib              - Utilities and configurations
/services         - Firebase operations and API layer
/store            - Zustand stores for global state
/hooks            - Custom React hooks
/constants        - App constants and theme configs
```

## Planning Documents

- **[FEATURES.md](./FEATURES.md)** - Feature checklist and implementation phases
- **[CURSOR_PROMPT.md](./CURSOR_PROMPT.md)** - Optional: Manual prompt template reference (not needed if using rules)
- **[.cursor/rules/](./.cursor/rules/)** - Cursor project rules (MDC format) - **Recommended: Auto-applies context**

## Cursor Rules

This project includes Cursor rules in `.cursor/rules/` directory following the [official Cursor documentation](https://cursor.com/docs/context/rules#project-rules). These rules provide persistent context for the AI assistant:

- **project-overview.mdc** - Project overview and tech stack (Always Apply)
- **firebase-firestore.mdc** - Firebase operations patterns (Apply to services)
- **authentication.mdc** - Auth patterns (Apply to auth files)

**Note**: The `.cursor/rules/` approach is recommended as it automatically applies context. `CURSOR_PROMPT.md` is optional and only useful if you want manual prompt templates.

## Get Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Install additional packages (if not already installed)

   ```bash
   # Performance & UI libraries
   npm install @shopify/flash-list @gorhom/bottom-sheet react-native-mmkv

   # Internationalization (optional)
   npm install @lingui/react @lingui/core

   # Note: react-native-reanimated is already installed
   ```

3. Configure Firebase
   - Update `lib/firebase.ts` with your Firebase config
   - Uncomment and configure auth services in `services/authService.ts`
   - Uncomment and configure auth store in `store/authStore.ts`

4. Start the app

   ```bash
   npm start
   # or
   npx expo start
   ```

5. Open the app
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app

## Development Workflow

1. Check [FEATURES.md](./FEATURES.md) for planned features
2. Use [CURSOR_PROMPT.md](./CURSOR_PROMPT.md) as a template when asking Cursor to build features
3. Build incrementally - start with MVP features
4. Test frequently on both iOS and Android

## Current Status

- ✅ Project setup complete
- ✅ Firebase configuration ready (needs activation)
- ✅ Auth screens created (sign-in, sign-up, forgot-password)
- ✅ TanStack Query configured
- ✅ Zustand store structure ready
- ✅ NativeWind styling configured
- ✅ React Native Reanimated installed
- ⏳ Additional packages need installation (FlashList, Bottom Sheet, MMKV, Lingui)
- ⏳ Note-taking features - To be implemented

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
