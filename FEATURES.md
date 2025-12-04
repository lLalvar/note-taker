# DailyMood Journal Features

## Overview

Transform the Note Taker app into a comprehensive daily diary journal app called "DailyMood Journal", focusing on privacy, customization, mood tracking, and rich content creation.

## Core Features

### 1. Security & Privacy

- **Diary Lock**: Password protection with PIN/pattern
- **Biometric Authentication**: Fingerprint/Face ID unlock
- **Security Question**: Password recovery mechanism
- **Email Recovery**: Email address for password reset
- **Data Encryption**: Encrypt diary entries locally

### 2. Diary Entry Management

- **Create Entry**: Rich text editor with title and body
- **Edit Entry**: Modify existing entries
- **Delete Entry**: Remove entries with confirmation
- **Draft System**: Save entries as drafts
- **Date Selection**: Custom date picker for entries
- **Time Selection**: Custom time for entries
- **Entry Preview**: Preview before saving

### 3. Mood Tracking

- **Mood Selection**: Grid of emoji moods (happy, sad, angry, etc.)
- **Default Mood**: Set preferred default mood
- **Mood Display**: Show mood on calendar view
- **Mood Statistics**: Charts showing mood trends over time
- **Mood Percentage**: Statistics on mood distribution
- **Mood Stability**: Track mood consistency

### 4. Rich Content Editor

- **Text Formatting**: Bold, italic, headings (H1-H4)
- **Text Alignment**: Left, center, right alignment
- **Text Colors**: Color palette for text styling
- **Font Selection**: Multiple font options (Default, Bold, Merriweather, etc.)
- **Character/Word Count**: Real-time counting
- **Lists**: Bullet points and numbered lists
- **Undo/Redo**: Text editing history

### 5. Media Support

- **Photo Attachments**: Add images to entries
- **Video Attachments**: Add videos to entries
- **Image Time Extraction**: Read EXIF data for creation time
- **Media Gallery**: View all photos/videos in entries
- **Media Management**: Delete/replace media

### 6. Customization & Themes

- **Theme Selection**: Multiple themes (HOT, DARK, LIGHT categories)
- **Background Images**: Custom backgrounds for entries
- **Keep Previous Background**: Option to persist background
- **Theme Preview**: Preview themes before applying
- **Dark Mode**: Night theme support
- **Eye Protection Mode**: Reduce blue light for long writing sessions

### 7. Stickers & Emojis

- **Sticker Library**: Collection of stickers
- **Emoji Support**: Emoji picker integration
- **Custom Stickers**: User-uploaded stickers (future)
- **Sticker Categories**: Organize stickers by type

### 8. Templates

- **Diary Templates**: Pre-built entry templates
- **Template Library**: Browse available templates
- **Keep Previous Template**: Option to persist template
- **Custom Templates**: Create user templates (future)
- **Template Prompts**: Writing prompts and ideas

### 9. Tags & Organization

- **Tag System**: Add tags to entries
- **Tag Management**: Create, edit, delete tags
- **Tag Colors**: Color-code tags
- **Tag Filtering**: Filter entries by tags
- **Tag Search**: Search entries by tags

### 10. Calendar View

- **Monthly Calendar**: View entries by month
- **Date Highlighting**: Highlight dates with entries
- **Mood Indicators**: Show moods on calendar
- **Entry Count**: Display number of entries per day
- **Date Navigation**: Navigate between months/years
- **"On This Day" Feature**: Show past entries from same date

### 11. Statistics & Analytics

- **Diary Statistics**: Entry count per day/week/month
- **Mood Statistics**: Mood distribution charts
- **Weekly View**: 7-day entry statistics
- **Time Range Selection**: Filter statistics by period
- **Visual Charts**: Bar charts, line graphs for trends

### 12. Profile & Settings

- **User Profile**: Username, bio, profile photo
- **Profile Editing**: Update profile information
- **Settings Screen**: Comprehensive settings menu
- **Language Selection**: Multi-language support
- **Date Format**: Customize diary date format
- **Time Format**: 12/24 hour format selection
- **First Day of Week**: Sunday/Monday selection
- **Notifications**: Configure notification settings

### 13. Search & Discovery

- **Text Search**: Full-text search across entries
- **Date Search**: Search by date range
- **Tag Search**: Search by tags
- **Mood Search**: Filter by mood
- **Advanced Filters**: Combine multiple filters

### 14. Widget Support

- **Home Screen Widget**: Quick access widget
- **Widget Customization**: Configure widget appearance
- **Widget Themes**: Match app theme

### 15. Help & Support

- **Help Center**: FAQ and guides
- **Feature Requests**: Submit feature ideas
- **Issue Reporting**: Report bugs
- **Tutorials**: Getting started guides
- **Onboarding**: First-time user experience

### 16. Gamification (Optional)

- **Achievements**: Unlock achievements for milestones
- **Habit Challenges**: Multi-day challenges
- **Progress Tracking**: Track writing streaks
- **Rewards**: Visual rewards for consistency

## Excluded Features

- Subscription/Premium features
- Ads/Advertising
- Backup and Restore
- Export and Import

## Technical Stack

- **Framework**: React Native (Expo)
- **Navigation**: Expo Router
- **Styling**: NativeWind (Tailwind CSS)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Forms**: React Hook Form + Zod
- **UI Components**: React Native Reusables
- **Language**: TypeScript

## Notes & Considerations

- Focus on learning React Native fundamentals first
- Build incrementally, test frequently
- Prioritize user experience and performance
- Keep code clean and well-organized
- Document as you go
- Use TypeScript strictly for type safety
- See [ROADMAP.md](./ROADMAP.md) for detailed implementation plan
