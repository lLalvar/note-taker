# Email Setup Summary

## ✅ What I've Set Up

I've configured **Firebase Cloud Functions** to send emails using Resend. This is the **best free option** for your use case because:

1. ✅ **Free tier** - 2 million invocations/month (more than enough!)
2. ✅ **Already using Firebase** - No new services needed
3. ✅ **Secure** - API keys stay on the server, not in your app
4. ✅ **Scalable** - Grows with your app

## 📁 Files Created

### Firebase Functions (Backend)

- `functions/package.json` - Functions dependencies
- `functions/tsconfig.json` - TypeScript config
- `functions/src/index.ts` - Two email functions:
  - `sendPasswordRecoveryEmail` - For password reset
  - `sendSecurityQuestionResetEmail` - For security question reset
- `firebase.json` - Firebase configuration
- `.firebaserc` - Firebase project config
- `firestore.rules` - Basic security rules
- `firestore.indexes.json` - Firestore indexes

### Mobile App (Frontend)

- `services/email-service.ts` - Service to call Cloud Functions from your app
- `package.json` - Added `@react-native-firebase/functions` dependency

### Documentation

- `FIREBASE_FUNCTIONS_SETUP.md` - Complete setup guide
- `EMAIL_SETUP_SUMMARY.md` - This file

## 🚀 Quick Start

### 1. Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Login to Firebase

```bash
firebase login
```

### 3. Initialize Functions

```bash
firebase init functions
```

- Select your Firebase project
- Choose TypeScript
- Say yes to ESLint
- Say yes to install dependencies

### 4. Update Project ID

Edit `.firebaserc` and replace `your-project-id` with your actual Firebase project ID.

### 5. Set Resend API Key

```bash
firebase functions:secrets:set RESEND_API_KEY
```

Enter your Resend API key when prompted.

### 6. Install Dependencies

```bash
cd functions

# Install Firebase packages
npm install firebase-functions@latest firebase-admin@latest

# Install Resend
npm install resend

# Install TypeScript types (if using TypeScript)
npm install --save-dev @types/node typescript

cd ..
```

### 7. Build & Deploy

```bash
cd functions
npm run build
cd ..
firebase deploy --only functions
```

### 8. Install Mobile App Dependency

From the project root, install Firebase Functions package:

```bash
npm install @react-native-firebase/functions
```

## 📧 Using in Your App

```typescript
import { sendPasswordRecoveryEmail } from '@/services/email-service'

// Generate a reset token (6-digit code, etc.)
const resetToken = generateResetToken()

// Send email
try {
  await sendPasswordRecoveryEmail(
    'user@example.com',
    resetToken,
    'John Doe' // optional
  )
  console.log('Email sent!')
} catch (error) {
  console.error('Failed to send email:', error)
}
```

## 💰 Cost

**Completely FREE** for your use case:

- Firebase Cloud Functions: 2M invocations/month free
- Resend: 3,000 emails/month free (then $20/month for 50K)

For a diary app, you'll likely send < 100 emails/month, so you're well within the free tier!

## 🔒 Security

- ✅ Resend API key stored securely in Firebase Secrets
- ✅ Functions validate input and rate limit requests
- ✅ API key never exposed to mobile app
- ✅ Firestore rules protect user data

## 📝 Next Steps

1. **Follow the setup steps above**
2. **Update sender email** in `functions/src/index.ts`:
   - Change `onboarding@resend.dev` to your verified Resend domain
3. **Customize email templates** as needed
4. **Test locally** before deploying:
   ```bash
   cd functions
   npm run serve
   ```

## 🆘 Need Help?

See `FIREBASE_FUNCTIONS_SETUP.md` for detailed instructions and troubleshooting.
