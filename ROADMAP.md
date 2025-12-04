# DailyMood Journal - Implementation Roadmap

## Overview

This roadmap outlines the detailed implementation plan for transforming the Note Taker app into "DailyMood Journal" - a comprehensive daily diary journal app. The plan is organized into 11 phases spanning approximately 24 weeks.

## Implementation Roadmap

### Phase 1: Foundation & Core Diary (Weeks 1-4)

**Goal**: Basic diary functionality with security

#### 1. Security System

**Files to create/modify:**

- `app/(auth)/diary-lock.tsx` - Lock screen component
- `services/diary-lock-service.ts` - Lock service for password/biometric handling
- `store/diary-lock-store.ts` - Zustand store for lock state

**Implementation details:**

- Implement password/PIN lock screen with secure input
- Add biometric authentication using `expo-local-authentication`
- Create security question flow for password recovery
- Email recovery setup with validation
- Store encrypted credentials using `react-native-mmkv`
- Lock screen should appear on app launch if lock is enabled
- Handle lock timeout and auto-lock functionality

**Dependencies to add:**

- `expo-local-authentication` - Biometric authentication
- `react-native-mmkv` - Fast encrypted storage (already in package.json)

**Firebase structure:**

```
users/{userId}/
  security/
    hasLock: boolean
    securityQuestion: string
    securityAnswerHash: string
    recoveryEmail: string
```

#### 2. Diary Entry CRUD

**Files to create/modify:**

- `app/(tabs)/create-note.tsx` - Entry creation screen (already exists, needs enhancement)
- `app/(tabs)/entry/[id].tsx` - Entry detail/edit screen
- `services/diary-service.ts` - Diary entry service
- `lib/validation-schemas.ts` - Add entry validation schemas

**Implementation details:**

- Create entry screen with title and body text inputs
- Edit entry functionality with pre-filled data
- Delete entry with confirmation dialog
- Draft saving system (auto-save every 30 seconds)
- Date/time picker integration using native date pickers
- Firebase Firestore integration for entries
- Entry validation using Zod schemas
- Loading and error states

**Firebase structure:**

```
users/{userId}/
  entries/{entryId}/
    title: string
    content: string
    date: timestamp
    time: timestamp
    mood: string (optional)
    tags: array<string> (optional)
    media: array<MediaObject> (optional)
    theme: string (optional)
    background: string (optional)
    isDraft: boolean
    createdAt: timestamp
    updatedAt: timestamp
```

**MediaObject structure:**

```
{
  type: 'image' | 'video'
  url: string
  thumbnailUrl?: string
  metadata?: {
    width: number
    height: number
    duration?: number
    exifTime?: timestamp
  }
}
```

#### 3. Basic List View

**Files to create/modify:**

- `app/(tabs)/index.tsx` - Main entries list screen
- `components/entry/EntryCard.tsx` - Entry card component
- `components/entry/EmptyState.tsx` - Empty state component

**Implementation details:**

- Display entries in chronological order (newest first)
- Entry card component with title preview, date, and mood indicator
- Pull-to-refresh functionality
- Empty state handling with helpful message
- Navigate to entry detail on card press
- Loading skeleton states
- Use FlashList for performance

**Features:**

- Show entry title (truncated if long)
- Show entry date in user's preferred format
- Show mood emoji if available
- Show draft badge for draft entries
- Swipe actions (delete, edit) - future enhancement

#### 4. Entry Detail View

**Files to create:**

- `app/(tabs)/entry/[id].tsx` - Entry detail screen

**Implementation details:**

- Full entry display with formatted content
- Edit mode toggle (switch between view and edit)
- Delete action with confirmation
- Navigation integration (back button, share button)
- Media display (images/videos)
- Tag display
- Mood display
- Date/time display

**UI Components:**

- Header with back button and actions (edit, delete, share)
- Content area with formatted text
- Media gallery if media exists
- Tags section
- Footer with creation/update timestamps

### Phase 2: Rich Editor & Media (Weeks 5-8)

**Goal**: Enhanced content creation

#### 1. Rich Text Editor

**Files to create:**

- `components/editor/RichTextEditor.tsx` - Main rich text editor component
- `components/editor/FormattingToolbar.tsx` - Formatting toolbar
- `components/editor/FontPicker.tsx` - Font selection component
- `components/editor/ColorPicker.tsx` - Color picker component
- `hooks/useRichTextEditor.ts` - Editor hook for state management

**Implementation details:**

- Text formatting toolbar (bold, italic, headings H1-H4)
- Text alignment controls (left, center, right)
- Color picker for text styling with predefined palette
- Font selection dropdown with multiple font options
- Character/word counter displayed in real-time
- Undo/redo functionality using editor state history
- Formatting should work with React Native's TextInput
- Consider using a library like `react-native-rich-text-editor` or build custom

**Formatting options:**

- Bold, Italic, Underline
- Headings: H1, H2, H3, H4
- Text colors: Black, Gray, Red, Pink, Purple, Blue, Green, etc.
- Fonts: Default, Bold, Merriweather, Light, Poly Italic, Floane, etc.
- Alignment: Left, Center, Right

**Data structure:**
Store formatting as markdown or structured data:

```
{
  text: string
  formatting: Array<{
    start: number
    end: number
    type: 'bold' | 'italic' | 'heading' | 'color' | 'font'
    value: string
  }>
}
```

#### 2. Media Integration

**Files to create:**

- `components/editor/MediaPicker.tsx` - Media picker component
- `components/editor/MediaPreview.tsx` - Media preview component
- `services/media-service.ts` - Media handling service
- `hooks/useMediaPicker.ts` - Media picker hook

**Implementation details:**

- Image picker using `expo-image-picker`
- Video picker with duration limits
- Media preview in entries with thumbnail
- EXIF data extraction for image creation time
- Firebase Storage integration for media uploads
- Media deletion with confirmation
- Progress indicators for uploads
- Image optimization before upload

**Dependencies to add:**

- `expo-image-picker` - Image/video selection
- `expo-media-library` - Media library access
- `exif-js` or `react-native-image-picker` for EXIF data

**Media upload flow:**

1. User selects image/video
2. Extract EXIF data if available
3. Compress/optimize media
4. Upload to Firebase Storage
5. Get download URL
6. Store URL and metadata in Firestore entry

#### 3. Lists & Formatting

**Files to create:**

- `components/editor/ListEditor.tsx` - List editing component
- `components/editor/ListItem.tsx` - Individual list item component

**Implementation details:**

- Bullet point lists (unordered)
- Numbered lists (ordered)
- List item editing (add, remove, reorder)
- Nested lists support (future enhancement)
- List formatting in entry display

**List data structure:**

```
{
  type: 'bullet' | 'numbered'
  items: Array<{
    text: string
    level: number (for nesting)
  }>
}
```

### Phase 3: Mood Tracking (Weeks 9-10)

**Goal**: Comprehensive mood system

#### 1. Mood Selection

**Files to create:**

- `components/mood/MoodPicker.tsx` - Mood picker modal component
- `components/mood/MoodGrid.tsx` - Grid of mood emojis
- `constants/moods.ts` - Mood definitions and emojis
- `store/mood-store.ts` - Mood state management

**Implementation details:**

- Emoji grid component with 9+ mood options
- Mood selection modal triggered from entry screen
- Default mood setting stored in user settings
- Mood storage in entry data
- Visual feedback on selection

**Mood options (from screenshots):**

- Neutral/Unamused (😐)
- Happy (😊)
- Very Happy/Laughing (😂)
- In Love/Loved (😍)
- Content/Peaceful (😌)
- Worried/Sad (😟)
- Angry (😠)
- Sad/Tearful (😢)
- Crying (😭)
- Sick/Nauseated (🤢)

**Mood data structure:**

```
{
  emoji: string
  name: string
  category: 'positive' | 'neutral' | 'negative'
}
```

#### 2. Mood Display

**Files to create:**

- `components/mood/MoodIndicator.tsx` - Mood icon component
- `components/calendar/MoodBadge.tsx` - Calendar mood badge

**Implementation details:**

- Mood icon on entries (small emoji indicator)
- Calendar mood indicators (show mood on dates)
- Mood statistics screen integration
- Consistent mood display across app

#### 3. Mood Analytics

**Files to create:**

- `app/(tabs)/mood-statistics.tsx` - Mood statistics screen
- `components/statistics/MoodChart.tsx` - Mood distribution chart
- `components/statistics/MoodTrendChart.tsx` - Mood trends over time
- `services/statistics-service.ts` - Statistics calculations

**Implementation details:**

- Mood distribution chart (bar chart showing count per mood)
- Mood trends over time (line graph)
- Time range filtering (Last 7 days, 30 days, 3 months, 1 year)
- Chart library integration (`react-native-chart-kit` or `victory-native`)
- Mood percentage breakdown
- Mood stability calculation

**Dependencies to add:**

- `react-native-chart-kit` or `victory-native` - Chart library
- `react-native-svg` - SVG support for charts (usually peer dependency)

**Statistics calculations:**

- Count entries per mood
- Calculate mood percentage distribution
- Track mood changes over time
- Identify most common mood
- Calculate mood stability (variance in mood selection)

### Phase 4: Themes & Customization (Weeks 11-12)

**Goal**: Visual personalization

#### 1. Theme System

**Files to create/modify:**

- `constants/themes.ts` - Theme definitions and data
- `store/theme-store.ts` - Theme state management
- `app/(tabs)/themes.tsx` - Theme selection screen
- `components/themes/ThemePreview.tsx` - Theme preview component
- `components/themes/ThemeCard.tsx` - Individual theme card

**Implementation details:**

- Theme data structure with categories (HOT, DARK, LIGHT)
- Theme selection screen with grid layout
- Theme preview component showing app mockup
- Apply theme to app (update global styles)
- Background image support per theme
- Theme persistence in user settings

**Theme categories (from screenshots):**

- **HOT**: Vibrant, colorful themes
- **DARK**: Dark mode themes
- **LIGHT**: Light, bright themes

**Theme data structure:**

```
{
  id: string
  name: string
  category: 'hot' | 'dark' | 'light'
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  backgroundImage?: string
  textColor: string
  accentColor: string
  previewImage: string
}
```

**Theme application:**

- Update NativeWind theme colors
- Apply background images
- Update status bar style
- Persist theme selection in Firebase user settings

#### 2. Background Management

**Files to create:**

- `components/themes/BackgroundPicker.tsx` - Background selection component
- `components/themes/BackgroundPreview.tsx` - Background preview

**Implementation details:**

- Background selection from theme backgrounds
- Keep previous background option (toggle in settings)
- Background preview before applying
- Custom background uploads (future enhancement)
- Background applied to entry editor

**Settings integration:**

- Add "Keep Previous Background" toggle in diary preferences
- Store preference in user settings
- Apply logic when creating new entries

#### 3. Eye Protection Mode

**Files to create:**

- `components/settings/EyeProtectionToggle.tsx` - Eye protection toggle
- `components/settings/EyeProtectionOverlay.tsx` - Blue light filter overlay

**Implementation details:**

- Blue light filter toggle in settings
- Screen tint overlay when enabled
- Adjustable intensity (future enhancement)
- Settings integration
- Persist preference

**Implementation approach:**

- Use `expo-blur` or custom overlay component
- Apply warm tint to screen
- Toggle on/off from settings
- Show indicator when active

### Phase 5: Calendar & Organization (Weeks 13-14)

**Goal**: Calendar view and organization

#### 1. Calendar View

**Files to create:**

- `app/(tabs)/calendar.tsx` - Calendar screen
- `components/calendar/CalendarView.tsx` - Calendar component
- `components/calendar/CalendarDay.tsx` - Individual day component
- `components/calendar/EntryList.tsx` - Entries list for selected date

**Implementation details:**

- Monthly calendar component
- Date highlighting for dates with entries
- Mood indicators on dates (small emoji)
- Entry count badges on dates
- Date navigation (previous/next month, year picker)
- Calendar library integration (`react-native-calendars`)
- Tap date to show entries for that day
- Smooth month transitions

**Dependencies to add:**

- `react-native-calendars` - Calendar component library

**Calendar features:**

- Show current month
- Highlight today's date
- Mark dates with entries
- Show mood emoji on dates with entries
- Show entry count badge
- Navigate between months/years
- Select date to view entries

**Entry list for selected date:**

- Display all entries for selected date
- Show entry time, title preview, mood
- Navigate to entry detail on tap
- Empty state if no entries

#### 2. "On This Day" Feature

**Files to create:**

- `components/calendar/OnThisDay.tsx` - On This Day component
- `components/calendar/OnThisDayModal.tsx` - Modal showing past entries

**Implementation details:**

- Query entries by date across years (same month/day, different year)
- Display past entries modal
- Date comparison logic (ignore year, match month and day)
- Show entries from previous years
- Navigate to entry detail from modal
- Toggle in settings to enable/disable

**Query logic:**

```
Query Firestore for entries where:
- month(date) == currentMonth
- day(date) == currentDay
- year(date) < currentYear
Order by year descending
```

**UI:**

- Modal or bottom sheet showing past entries
- Group by year
- Show entry preview (title, mood, year)
- "View Entry" button for each

#### 3. Tags System

**Files to create:**

- `components/tags/TagManager.tsx` - Tag management screen
- `components/tags/TagPicker.tsx` - Tag picker component
- `components/tags/TagChip.tsx` - Individual tag chip
- `services/tag-service.ts` - Tag service
- `app/(tabs)/tags.tsx` - Tags management screen

**Implementation details:**

- Tag creation/editing with name and color
- Tag assignment to entries (multi-select)
- Tag filtering in entry list
- Tag search functionality
- Tag color coding
- Tag statistics (entry count per tag)

**Firebase structure:**

```
users/{userId}/
  tags/{tagId}/
    name: string
    color: string
    createdAt: timestamp
    entryCount: number (computed)
```

**Tag features:**

- Create tag with name and color picker
- Edit tag name and color
- Delete tag (with confirmation, remove from entries)
- Assign tags to entries (multi-select picker)
- Filter entries by tag
- Search entries by tag
- Show tag chips on entries
- Tag management screen with all tags

**Tag colors:**
Predefined color palette or custom color picker

### Phase 6: Templates & Stickers (Weeks 15-16)

**Goal**: Content enhancement

#### 1. Template System

**Files to create:**

- `components/templates/TemplatePicker.tsx` - Template picker modal
- `components/templates/TemplateLibrary.tsx` - Template library screen
- `components/templates/TemplateCard.tsx` - Template preview card
- `services/template-service.ts` - Template service
- `constants/templates.ts` - Default templates

**Implementation details:**

- Template library with predefined templates
- Template preview before applying
- Apply template to entry (pre-fill content)
- Keep previous template option (toggle in settings)
- Template data structure
- Custom templates (future enhancement)

**Template categories:**

- Daily reflection
- Gratitude journal
- Travel diary
- Work diary
- Mood diary
- Goal setting
- etc.

**Template data structure:**

```
{
  id: string
  name: string
  category: string
  content: string (with placeholders)
  description: string
  preview: string
}
```

**Template application:**

- Show template picker when creating entry
- Preview template content
- Apply template (replace entry content)
- Option to keep template for next entry

#### 2. Sticker System

**Files to create:**

- `components/stickers/StickerPicker.tsx` - Sticker picker modal
- `components/stickers/StickerLibrary.tsx` - Sticker library component
- `components/stickers/StickerCategory.tsx` - Sticker category tabs
- `constants/stickers.ts` - Sticker definitions

**Implementation details:**

- Sticker library component with categories
- Sticker categories (emotions, objects, symbols, etc.)
- Sticker insertion into entries (as images or emoji)
- Sticker storage (local assets or remote URLs)
- Sticker search (future enhancement)

**Sticker implementation:**

- Use emoji or image assets
- Organize by categories
- Insert into entry content
- Store sticker reference in entry data

**Sticker data structure:**

```
{
  id: string
  emoji: string (or imageUrl)
  category: string
  name: string
}
```

#### 3. Emoji Picker

**Files to create:**

- `components/editor/EmojiPicker.tsx` - Emoji picker modal
- `components/editor/EmojiCategory.tsx` - Emoji category tabs
- `components/editor/RecentEmojis.tsx` - Recent emojis section

**Implementation details:**

- Emoji selection modal with categories
- Emoji categories (smileys, objects, symbols, etc.)
- Recent emojis tracking
- Insert emoji into entry text
- Search emojis (future enhancement)

**Emoji categories:**

- Smileys & People
- Animals & Nature
- Food & Drink
- Travel & Places
- Activities
- Objects
- Symbols
- Flags

**Implementation:**

- Use emoji library or native emoji picker
- Track recently used emojis
- Insert at cursor position
- Show emoji picker button in editor toolbar

### Phase 7: Statistics & Analytics (Weeks 17-18)

**Goal**: Data insights

#### 1. Diary Statistics

**Files to create:**

- `app/(tabs)/statistics.tsx` - Statistics screen
- `components/statistics/DiaryStatsChart.tsx` - Entry count charts
- `components/statistics/WeeklyStats.tsx` - Weekly statistics view
- `components/statistics/TimeRangeSelector.tsx` - Time range picker

**Implementation details:**

- Entry count per day/week/month
- Weekly statistics view (7-day entry count)
- Time range selector (Last 7 days, 30 days, 3 months, 1 year, All time)
- Visual charts and graphs (bar charts, line graphs)
- Statistics calculations service

**Statistics to show:**

- Total entries count
- Entries per day/week/month
- Writing streak (consecutive days with entries)
- Most active day of week
- Most active month
- Average entries per week/month

**Charts:**

- Bar chart: Entries per day
- Line graph: Entry trend over time
- Pie chart: Entries by mood (if mood tracking enabled)
- Calendar heatmap: Entry frequency

#### 2. Mood Analytics Enhancement

**Files to modify:**

- `app/(tabs)/mood-statistics.tsx` - Enhance existing mood statistics
- `services/statistics-service.ts` - Add mood analytics functions

**Implementation details:**

- Mood stability calculation (variance in mood selection)
- Mood percentage breakdown (pie chart)
- Best day/week identification (highest positive mood)
- Trend analysis (mood improvement/decline over time)
- Mood correlation with entry frequency

**Mood analytics:**

- Mood distribution percentage
- Mood stability score
- Mood trends (improving/declining)
- Most common mood
- Mood by day of week
- Mood by time of day (if time tracked)

### Phase 8: Profile & Settings (Weeks 19-20)

**Goal**: User customization

#### 1. Profile Management

**Files to create:**

- `app/(tabs)/profile.tsx` - Profile screen
- `components/profile/ProfileHeader.tsx` - Profile header with photo
- `components/profile/ProfileForm.tsx` - Profile editing form
- `services/profile-service.ts` - Profile service

**Implementation details:**

- Profile photo upload (image picker, crop, upload to Firebase Storage)
- Username editing with validation
- Bio editing (multi-line text input)
- Profile display in "Mine" tab
- Profile data sync with Firebase

**Firebase structure:**

```
users/{userId}/
  profile/
    username: string
    bio: string
    photoUrl: string
    updatedAt: timestamp
```

**Profile features:**

- Edit profile photo (camera or gallery)
- Edit username (unique validation)
- Edit bio (character limit)
- Save changes
- Display profile in app

#### 2. Settings Screen

**Files to create:**

- `app/(tabs)/settings.tsx` - Settings screen
- `components/settings/SettingsSection.tsx` - Settings section component
- `components/settings/SettingsItem.tsx` - Individual setting item
- `components/settings/DateFormatPicker.tsx` - Date format selector
- `components/settings/TimeFormatPicker.tsx` - Time format selector
- `components/settings/FirstDayOfWeekPicker.tsx` - First day selector
- `store/settings-store.ts` - Settings state management

**Implementation details:**

- Settings menu structure with sections
- Date format selection (multiple format options)
- Time format selection (12-hour/24-hour)
- First day of week setting (Sunday/Monday)
- Language selection (using existing i18n system)
- Notification preferences
- Settings persistence in Firebase

**Settings sections:**

- **General Settings**
  - Show "On This Day"
  - Language
  - Notifications
- **Diary Preferences**
  - Set Default Mood
  - Display Mood on Calendar
  - Apply Image Time
  - Keep Previous Background
  - Keep Previous Template
- **Time Options**
  - First Day of Week
  - Diary Date Format
  - Time Format

**Date format options:**

- "04 Dec 2025" (DD MMM YYYY)
- "Dec 04, 2025" (MMM DD, YYYY)
- "04/12/2025" (DD/MM/YYYY)
- "12/04/2025" (MM/DD/YYYY)
- "2025-12-04" (YYYY-MM-DD)
- Custom formats

**Settings persistence:**

- Store in Firebase user settings
- Cache locally with MMKV
- Apply settings throughout app
- Update UI when settings change

### Phase 9: Search & Discovery (Week 21)

**Goal**: Find entries easily

#### 1. Search Functionality

**Files to create:**

- `components/search/SearchBar.tsx` - Search input component
- `components/search/SearchResults.tsx` - Search results display
- `components/search/AdvancedFilters.tsx` - Advanced filter panel
- `services/search-service.ts` - Search service
- `app/(tabs)/search.tsx` - Search screen (optional)

**Implementation details:**

- Full-text search across entry titles and content
- Date range search (from/to date picker)
- Tag filtering (multi-select tag picker)
- Mood filtering (mood picker)
- Advanced filter combination (AND/OR logic)
- Search results display with highlighting
- Search history (future enhancement)

**Search implementation:**

- Client-side search using Firestore queries
- Text search: Query Firestore with text matching (case-insensitive)
- Date range: Query with date >= startDate AND date <= endDate
- Tag filter: Query with array-contains for tags
- Mood filter: Query with mood == selectedMood
- Combine filters with AND logic

**Search UI:**

- Search bar in header or dedicated search screen
- Real-time search as user types
- Filter chips showing active filters
- Clear filters button
- Search results list
- Highlight matching text in results

**Performance considerations:**

- Debounce search input (300ms)
- Limit results (pagination)
- Index Firestore fields for better performance
- Cache recent searches

### Phase 10: Help & Support (Week 22)

**Goal**: User assistance

#### 1. Help Center

**Files to create:**

- `app/(tabs)/help.tsx` - Help center screen
- `components/help/HelpSection.tsx` - Help section component
- `components/help/HelpArticle.tsx` - Individual help article
- `components/help/FAQ.tsx` - FAQ component
- `constants/help-content.ts` - Help content data

**Implementation details:**

- FAQ section with expandable questions
- Getting started guides with step-by-step instructions
- Feature documentation
- Tutorial screens with screenshots
- Search help articles
- Contact support option

**Help sections:**

- **Get Started**
  - Start a diary
  - Get diary ideas
- **Lock and Privacy Protection**
  - Set diary lock
  - Forget password
  - Data privacy
- **Manage Entries**
  - Tag management
  - Search entries
  - Edit entries
- **Customization**
  - Change theme
  - Set background
  - Customize fonts
- **Troubleshooting**
  - Common issues
  - App not working
  - Data sync issues

#### 2. Support Features

**Files to create:**

- `components/help/FeatureRequestForm.tsx` - Feature request form
- `components/help/IssueReportForm.tsx` - Issue reporting form
- `services/support-service.ts` - Support service

**Implementation details:**

- Feature request form (title, description, category)
- Issue reporting form (title, description, steps to reproduce, device info)
- Submit to Firebase or email
- Thank you message after submission
- Contact information display

**Forms:**

- Feature Request: Title, Description, Category, User email
- Issue Report: Title, Description, Steps to Reproduce, Device Info, Screenshots (optional)

**Submission:**

- Store in Firestore `support/feature-requests` and `support/issues`
- Or send email using email service
- Show confirmation message

### Phase 11: Polish & Optimization (Weeks 23-24)

**Goal**: Refinement and performance

#### 1. Performance Optimization

**Files to modify:**

- All list components - Add lazy loading
- Media components - Add image optimization
- Entry components - Add pagination
- Services - Add caching strategy

**Implementation details:**

- Image optimization (compress before upload, use thumbnails)
- Lazy loading for entries list (load 20 at a time)
- Pagination for lists (infinite scroll)
- Caching strategy (cache entries locally, sync periodically)
- Memory management (clean up unused images, limit cache size)
- Reduce re-renders (memoization, useMemo, useCallback)

**Optimization techniques:**

- Use FlashList for lists (already planned)
- Image lazy loading with `expo-image`
- Pagination with Firestore `limit()` and `startAfter()`
- Cache frequently accessed data in MMKV
- Debounce search and filter inputs
- Optimize Firebase queries (use indexes)
- Reduce bundle size (code splitting if needed)

#### 2. UI/UX Polish

**Files to create/modify:**

- All screens - Add loading states
- All screens - Add error handling
- All screens - Add empty states
- `components/onboarding/OnboardingFlow.tsx` - Onboarding screens
- `components/common/LoadingSpinner.tsx` - Loading component
- `components/common/ErrorState.tsx` - Error state component
- `components/common/EmptyState.tsx` - Empty state component

**Implementation details:**

- Animations using React Native Reanimated (smooth transitions)
- Loading states (skeletons, spinners)
- Error handling (error messages, retry buttons)
- Empty states (helpful messages, call-to-action buttons)
- Onboarding flow for first-time users
- Consistent UI patterns throughout app

**Animations:**

- Screen transitions
- List item animations
- Modal animations
- Button press animations
- Loading animations

**Onboarding flow:**

- Welcome screen
- Feature highlights
- Permission requests (camera, storage)
- Quick tutorial
- Skip option

#### 3. Testing & Quality

**Files to create:**

- `__tests__/` - Test directory structure
- Unit tests for services
- Integration tests for critical flows
- E2E tests (if using Detox or similar)

**Implementation details:**

- Unit tests for services (diary-service, tag-service, etc.)
- Integration tests for critical flows (create entry, lock/unlock)
- E2E tests for main user journeys
- Accessibility improvements (screen reader support, proper labels)
- Error boundary components
- Logging and error tracking (Sentry already configured)

**Testing tools:**

- Jest for unit tests
- React Native Testing Library for component tests
- Detox or Maestro for E2E tests (optional)

**Accessibility:**

- Add accessibility labels to all interactive elements
- Support screen readers
- Proper focus management
- Color contrast compliance
- Text scaling support

## Technical Implementation Notes

### Key Dependencies to Add

```json
{
  "expo-image-picker": "^latest",
  "expo-local-authentication": "^latest",
  "react-native-chart-kit": "^latest",
  "react-native-calendars": "^latest",
  "react-native-image-viewing": "^latest",
  "expo-media-library": "^latest",
  "react-native-svg": "^latest"
}
```

### Firebase Structure

```
users/{userId}/
  entries/{entryId}/
    title: string
    content: string
    date: timestamp
    time: timestamp
    mood: string
    tags: array<string>
    media: array<MediaObject>
    theme: string
    background: string
    isDraft: boolean
    createdAt: timestamp
    updatedAt: timestamp

  tags/{tagId}/
    name: string
    color: string
    createdAt: timestamp
    entryCount: number

  settings/
    defaultMood: string
    dateFormat: string
    timeFormat: string
    firstDayOfWeek: string
    language: string
    showOnThisDay: boolean
    displayMoodOnCalendar: boolean
    applyImageTime: boolean
    keepPreviousBackground: boolean
    keepPreviousTemplate: boolean
    eyeProtectionMode: boolean

  profile/
    username: string
    bio: string
    photoUrl: string
    updatedAt: timestamp

  security/
    hasLock: boolean
    securityQuestion: string
    securityAnswerHash: string
    recoveryEmail: string
```

### State Management

- **Zustand Stores**: Theme, settings, diary lock state, UI state
- **TanStack Query**: All Firebase data fetching (entries, tags, statistics, profile)
- **React Hook Form**: All forms (entry creation, settings, profile, search filters)

### File Structure Additions

```
app/(tabs)/
  calendar.tsx
  mood-statistics.tsx
  statistics.tsx
  profile.tsx
  settings.tsx
  help.tsx
  themes.tsx
  tags.tsx
  entry/[id].tsx

components/
  editor/
    RichTextEditor.tsx
    FormattingToolbar.tsx
    MediaPicker.tsx
    MediaPreview.tsx
    ListEditor.tsx
    EmojiPicker.tsx
  mood/
    MoodPicker.tsx
    MoodIndicator.tsx
    MoodGrid.tsx
  themes/
    ThemePicker.tsx
    ThemeCard.tsx
    ThemePreview.tsx
    BackgroundPicker.tsx
  calendar/
    CalendarView.tsx
    CalendarDay.tsx
    EntryList.tsx
    OnThisDay.tsx
    OnThisDayModal.tsx
    MoodBadge.tsx
  tags/
    TagManager.tsx
    TagPicker.tsx
    TagChip.tsx
  templates/
    TemplatePicker.tsx
    TemplateLibrary.tsx
    TemplateCard.tsx
  search/
    SearchBar.tsx
    SearchResults.tsx
    AdvancedFilters.tsx
  statistics/
    DiaryStatsChart.tsx
    WeeklyStats.tsx
    MoodChart.tsx
    MoodTrendChart.tsx
    TimeRangeSelector.tsx
  settings/
    SettingsSection.tsx
    SettingsItem.tsx
    DateFormatPicker.tsx
    TimeFormatPicker.tsx
    FirstDayOfWeekPicker.tsx
    EyeProtectionToggle.tsx
    EyeProtectionOverlay.tsx
  profile/
    ProfileHeader.tsx
    ProfileForm.tsx
  help/
    HelpSection.tsx
    HelpArticle.tsx
    FAQ.tsx
    FeatureRequestForm.tsx
    IssueReportForm.tsx
  entry/
    EntryCard.tsx
    EntryDetail.tsx
  common/
    LoadingSpinner.tsx
    ErrorState.tsx
    EmptyState.tsx
  onboarding/
    OnboardingFlow.tsx

services/
  diary-service.ts
  media-service.ts
  tag-service.ts
  template-service.ts
  search-service.ts
  diary-lock-service.ts
  statistics-service.ts
  profile-service.ts
  support-service.ts

store/
  theme-store.ts
  settings-store.ts
  diary-lock-store.ts
  mood-store.ts

constants/
  moods.ts
  themes.ts
  templates.ts
  stickers.ts
  help-content.ts
```

## Success Metrics

- User can create, edit, and delete diary entries
- Entries are secured with password/biometric lock
- Mood tracking works across calendar view
- Themes and customization are functional
- Media attachments work seamlessly
- Search and filtering are performant
- Statistics provide meaningful insights
- App performs smoothly with 1000+ entries
- All features are accessible and user-friendly

## Notes

- Build incrementally, test frequently
- Prioritize user experience and performance
- Keep code clean and well-organized
- Document as you go
- Use TypeScript strictly for type safety
- Follow React Native best practices
- Test on both iOS and Android
- Consider offline functionality for future phases
