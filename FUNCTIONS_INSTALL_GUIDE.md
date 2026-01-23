# Firebase Functions Installation Guide

Follow these steps to set up Firebase Cloud Functions using npm commands.

## Prerequisites

1. **Install Firebase CLI globally:**

   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase:**
   ```bash
   firebase login
   ```

## Step-by-Step Setup

### 1. Initialize Firebase Functions

Navigate to your project root and run:

```bash
firebase init functions
```

When prompted:

- ✅ **Select your Firebase project** (or create a new one)
- ✅ **Choose TypeScript** (recommended) or JavaScript
- ✅ **Use ESLint:** Yes
- ✅ **Install dependencies:** Yes (this will run `npm install` automatically)

This creates the `functions/` directory with basic structure.

### 2. Install Required Packages

Navigate to the functions directory:

```bash
cd functions
```

Install Firebase Functions and Admin SDK:

```bash
npm install firebase-functions@latest firebase-admin@latest
```

Install Resend for email:

```bash
npm install resend
```

Install TypeScript types (if using TypeScript):

```bash
npm install --save-dev @types/node typescript
```

### 3. Update Node.js Version (if needed)

Check your `functions/package.json` and ensure Node.js version is set:

```json
"engines": {
  "node": "20"
}
```

Firebase Functions supports Node.js 20 and 22. Version 18 was deprecated in early 2025.

### 4. Set Environment Variables

Set your Resend API key as a Firebase secret:

```bash
firebase functions:secrets:set RESEND_API_KEY
```

When prompted, paste your Resend API key.

### 5. Copy Function Code

Copy the email functions from `functions/src/index.ts` (already created) or replace the default code with our email functions.

### 6. Build Functions

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `lib/` directory.

### 7. Test Locally (Optional)

Start the Firebase emulator:

```bash
npm run serve
```

Or:

```bash
firebase emulators:start --only functions
```

The emulator UI will be available at `http://localhost:4000`

### 8. Deploy Functions

From the project root:

```bash
firebase deploy --only functions
```

Or from the functions directory:

```bash
cd ..
firebase deploy --only functions
```

## Complete Installation Commands

Here's the complete sequence of commands:

```bash
# 1. Install Firebase CLI (if not already installed)
npm install -g firebase-tools

# 2. Login to Firebase
firebase login

# 3. Initialize functions (from project root)
firebase init functions
# Select: TypeScript, Yes to ESLint, Yes to install dependencies

# 4. Navigate to functions directory
cd functions

# 5. Install Firebase packages
npm install firebase-functions@latest firebase-admin@latest

# 6. Install Resend
npm install resend

# 7. Install TypeScript types (if using TypeScript)
npm install --save-dev @types/node typescript

# 8. Set Resend API key secret
firebase functions:secrets:set RESEND_API_KEY
# Paste your API key when prompted

# 9. Build functions
npm run build

# 10. Deploy (from project root)
cd ..
firebase deploy --only functions
```

## Updating Packages

To update Firebase packages to the latest version:

```bash
cd functions
npm install firebase-functions@latest firebase-admin@latest --save
npm install -g firebase-tools
```

## Troubleshooting

### Package installation fails

- Make sure you're in the `functions/` directory
- Check Node.js version: `node --version` (should be 20 or 22)
- Try deleting `node_modules` and `package-lock.json`, then run `npm install` again

### Build fails

- Check TypeScript version: `npx tsc --version`
- Ensure all dependencies are installed: `npm install`
- Check for TypeScript errors: `npm run build`

### Deployment fails

- Make sure you're logged in: `firebase login`
- Check your project ID in `.firebaserc`
- Ensure your project is on Blaze plan (required for Cloud Functions)

## Project Structure After Setup

```
note-taker/
├── functions/
│   ├── src/
│   │   └── index.ts          # Your functions code
│   ├── lib/                   # Compiled JavaScript (generated)
│   ├── node_modules/          # Dependencies (generated)
│   ├── package.json          # Dependencies file
│   └── tsconfig.json         # TypeScript config
├── .firebaserc               # Firebase project config
├── firebase.json             # Firebase config
└── firestore.rules           # Firestore security rules
```

## Next Steps

1. Update the sender email in `functions/src/index.ts` to your verified Resend domain
2. Customize email templates as needed
3. Test functions locally before deploying
4. Deploy and test in production
