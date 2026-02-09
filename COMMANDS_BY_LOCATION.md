# Commands by Location - Quick Reference

## 📍 Project Root (`/var/www/note-taker/`)

Run these commands from the **main project folder**:

```bash
# Login to Firebase
firebase login

# Initialize functions
firebase init functions

# Set environment secrets
firebase functions:secrets:set RESEND_API_KEY

# Deploy functions
firebase deploy --only functions

# Install mobile app dependencies
npm install @react-native-firebase/functions
```

---

## 📍 Functions Folder (`/var/www/note-taker/functions/`)

Run these commands from the **functions folder**:

```bash
# Install Firebase packages
npm install firebase-functions@latest firebase-admin@latest

# Install Resend
npm install resend

# Install TypeScript types
npm install --save-dev @types/node typescript

# Build functions
npm run build

# Test locally
npm run serve
```

---

## 🔄 Complete Flow Example

Here's the complete flow showing when to change directories:

```bash
# Start in project root
cd /var/www/note-taker

# 1. Login
firebase login

# 2. Initialize (creates functions/ folder)
firebase init functions

# 3. Go to functions folder
cd functions

# 4. Install all packages
npm install firebase-functions@latest firebase-admin@latest
npm install resend
npm install --save-dev @types/node typescript

# 5. Build
npm run build

# 6. Go back to project root
cd ..

# 7. Set secret
firebase functions:secrets:set RESEND_API_KEY

# 8. Deploy
firebase deploy --only functions

# 9. Install mobile package
npm install @react-native-firebase/functions
```

---

## 💡 Pro Tips

- **Always check your current directory** with `pwd` (Linux/Mac) or `cd` (Windows)
- **Project root** = where `firebase.json` and `package.json` are located
- **Functions folder** = where `functions/package.json` is located
- Use `cd ..` to go up one directory
- Use `cd functions` to go into functions folder

