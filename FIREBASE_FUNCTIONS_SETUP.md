# Firebase Cloud Functions Setup Guide

This guide will help you set up Firebase Cloud Functions to send emails using Resend.

## Prerequisites

1. **Firebase CLI** installed globally:

   ```bash
   npm install -g firebase-tools
   ```

2. **Firebase account** with a project created

3. **Resend account** with API key

## Setup Steps

### 1. Install Firebase CLI (if not already installed)

```bash
npm install -g firebase-tools
```

### 2. Login to Firebase

```bash
firebase login
```

### 3. Initialize Firebase in your project

```bash
firebase init functions
```

When prompted:

- Select your Firebase project (or create a new one)
- Choose TypeScript
- Use ESLint: Yes
- Install dependencies: Yes

### 4. Update Firebase Project ID

Edit `.firebaserc` and replace `your-project-id` with your actual Firebase project ID:

```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

### 5. Set Environment Variables

Set your Resend API key as a Firebase secret (Firebase Functions v2):

```bash
firebase functions:secrets:set RESEND_API_KEY
```

This will prompt you to enter the secret value securely. Paste your Resend API key when prompted.

### 6. Install Dependencies

Navigate to the functions directory and install required packages:

```bash
cd functions

# Install Firebase packages
npm install firebase-functions@latest firebase-admin@latest

# Install Resend for email
npm install resend

# Install TypeScript types (if using TypeScript)
npm install --save-dev @types/node typescript

cd ..
```

### 7. Build Functions

```bash
cd functions
npm run build
cd ..
```

### 8. Deploy Functions

```bash
firebase deploy --only functions
```

### 9. Test Locally (Optional)

You can test functions locally before deploying:

```bash
cd functions
npm run serve
```

This starts the Firebase emulator. You can test your functions at:

- `http://localhost:5001/your-project-id/us-central1/sendPasswordRecoveryEmail`

## Mobile App Integration

The mobile app uses `@react-native-firebase/functions` to call these Cloud Functions. Make sure you have it installed:

```bash
npm install @react-native-firebase/functions
```

Then use the `email-service.ts` file to call the functions from your app.

## Functions Available

### 1. `sendPasswordRecoveryEmail`

Sends a password recovery email with a reset token.

**Parameters:**

- `email` (string): User's email address
- `resetToken` (string): Reset token/code
- `userName` (string, optional): User's name for personalization

**Usage in mobile app:**

```typescript
import { sendPasswordRecoveryEmail } from '@/services/email-service'

await sendPasswordRecoveryEmail('user@example.com', 'ABC123', 'John Doe')
```

### 2. `sendSecurityQuestionResetEmail`

Sends a security question reset email with a reset token.

**Parameters:**

- `email` (string): User's email address
- `resetToken` (string): Reset token/code
- `userName` (string, optional): User's name for personalization

## Cost

Firebase Cloud Functions free tier (Spark plan) includes:

- 2 million invocations/month
- 400,000 GB-seconds compute time
- 200,000 CPU-seconds

This should be more than enough for a diary app's email needs!

## Troubleshooting

### Function not found error

- Make sure functions are deployed: `firebase deploy --only functions`
- Check function name matches exactly (case-sensitive)

### Permission denied error

- Check Firestore security rules
- Ensure user is authenticated (if required)

### Email not sending

- Verify Resend API key is set correctly
- Check Resend dashboard for email status
- Verify sender email is verified in Resend

## Next Steps

1. Update the sender email in `functions/src/index.ts` to use your verified Resend domain
2. Customize email templates as needed
3. Add more email functions as your app grows
