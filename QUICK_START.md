# Quick Start - Firebase Functions Setup

## Complete Setup in 11 Steps

**📁 Location Guide:**

- **Project Root** = `/var/www/note-taker/` (main project folder)
- **Functions Folder** = `/var/www/note-taker/functions/`

---

### 1. Install Firebase CLI

**📍 Run from: Anywhere (global install)**

```bash
npm install -g firebase-tools
```

---

### 2. Login to Firebase

**📍 Run from: Project Root**

```bash
cd /var/www/note-taker
firebase login
```

---

### 3. Initialize Functions

**📍 Run from: Project Root**

```bash
# Make sure you're in project root
firebase init functions
```

- Select your Firebase project
- Choose **TypeScript**
- Use ESLint: **Yes**
- Install dependencies: **Yes**

---

### 4. Install Firebase Packages

**📍 Run from: Functions Folder**

```bash
cd functions
npm install firebase-functions@latest firebase-admin@latest
```

---

### 5. Install Resend

**📍 Run from: Functions Folder** (still in `functions/`)

```bash
npm install resend
```

---

### 6. Install TypeScript Types

**📍 Run from: Functions Folder** (still in `functions/`)

```bash
npm install --save-dev @types/node typescript
```

---

### 7. Set Resend API Key

**📍 Run from: Project Root**

```bash
cd ..  # Go back to project root
firebase functions:secrets:set RESEND_API_KEY
```

Paste your Resend API key when prompted.

---

### 8. Copy Function Code

**📍 Location: `functions/src/index.ts`**

The email functions are already in `functions/src/index.ts`. If you initialized a new project, replace the default code with our email functions.

---

### 9. Build Functions

**📍 Run from: Functions Folder**

```bash
cd functions
npm run build
```

---

### 10. Deploy Functions

**📍 Run from: Project Root**

```bash
cd ..  # Go back to project root
firebase deploy --only functions
```

---

### 11. Install Mobile App Package

**📍 Run from: Project Root**

```bash
# Make sure you're in project root
npm install @react-native-firebase/functions
```

## ✅ Done!

Your functions are now deployed and ready to use. Check the deployment output for function URLs.

## Test Locally (Before Deploying)

```bash
cd functions
npm run serve
```

Then test at: `http://localhost:5001/YOUR_PROJECT_ID/us-central1/sendPasswordRecoveryEmail`

## Need Help?

See `FUNCTIONS_INSTALL_GUIDE.md` for detailed instructions.
