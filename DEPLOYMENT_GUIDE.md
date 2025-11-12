# Quick Deployment Guide

## Before Deployment: Firebase Setup

### 1. Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Enter project name: "mini-bug-tracker"
4. Disable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Firestore Database

1. In Firebase Console, click "Firestore Database" in left sidebar
2. Click "Create database"
3. Choose "Start in test mode"
4. Select a location (e.g., us-central)
5. Click "Enable"

### 3. Enable Anonymous Authentication

1. Click "Authentication" in left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Click on "Anonymous"
5. Toggle "Enable"
6. Click "Save"

### 4. Get Firebase Configuration

1. Click the gear icon (⚙️) → "Project settings"
2. Scroll to "Your apps" section
3. Click the web icon (</>)
4. Register app name: "mini-bug-tracker-web"
5. Click "Register app"
6. Copy the `firebaseConfig` values

### 5. Update .env.local

```bash
# Replace these with your actual Firebase values
VITE_FIREBASE_API_KEY=AIza...your_key
VITE_FIREBASE_AUTH_DOMAIN=mini-bug-tracker-xxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mini-bug-tracker-xxxx
VITE_FIREBASE_STORAGE_BUCKET=mini-bug-tracker-xxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 6. Test Locally

```bash
npm run dev
```

Visit http://localhost:3000 and verify:
- No Firebase errors in console
- You see your User ID in the header
- You can create an issue
- Issue appears in Firestore console

---

## Deployment Options

### Option 1: Deploy to Vercel (Recommended - Easiest)

#### Prerequisites
- GitHub account
- Vercel account (free, sign up with GitHub)

#### Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Mini Bug Tracker"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/mini-bug-tracker.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to https://vercel.com/
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel auto-detects Vite configuration
   - Click "Deploy"

3. **Add Environment Variables**
   - In Vercel dashboard, go to your project
   - Click "Settings" → "Environment Variables"
   - Add each variable from your `.env.local`:
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`
   - Save

4. **Redeploy**
   - Go to "Deployments" tab
   - Click "..." on the latest deployment
   - Click "Redeploy"

5. **Get Your Live URL**
   - Vercel provides a URL: `https://mini-bug-tracker-xxxxx.vercel.app`
   - Update README.md with this URL

---

### Option 2: Deploy to Netlify

#### Steps

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

3. **Login and Deploy**
   ```bash
   netlify login
   netlify init
   netlify deploy --prod
   ```

4. **Add Environment Variables**
   - Go to Netlify dashboard
   - Navigate to "Site settings" → "Environment variables"
   - Add all `VITE_FIREBASE_*` variables

---

### Option 3: Deploy to Firebase Hosting

#### Steps

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login**
   ```bash
   firebase login
   ```

3. **Initialize Hosting**
   ```bash
   firebase init hosting
   ```
   - Select your Firebase project
   - Set public directory to: `dist`
   - Configure as single-page app: `Yes`
   - Don't overwrite index.html: `No`

4. **Build and Deploy**
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

5. **Get Your URL**
   - Firebase provides: `https://mini-bug-tracker-xxxx.web.app`

---

## Post-Deployment Checklist

- [ ] Visit the live URL
- [ ] Test creating an issue
- [ ] Test editing an issue
- [ ] Test filtering
- [ ] Test status updates
- [ ] Test comments
- [ ] Check mobile responsiveness
- [ ] Update README.md with live demo URL
- [ ] Update Firestore security rules (see below)

---

## Production Security Rules

Replace test mode rules with production rules in Firebase Console:

1. Go to Firestore Database → Rules
2. Replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /issues/{issueId} {
      // Allow authenticated users to read all issues
      allow read: if request.auth != null;

      // Allow authenticated users to create issues
      allow create: if request.auth != null;

      // Allow authenticated users to update issues
      allow update: if request.auth != null;

      // Allow authenticated users to delete issues
      allow delete: if request.auth != null;
    }
  }
}
```

3. Click "Publish"

---

## Sharing Your Project

### For the Interview

1. **Live Demo URL**: Share the Vercel/Netlify URL
2. **GitHub Repository**: Make it public, share the link
3. **README**: Ensure it's comprehensive
4. **Demo Data**: Create 3-5 sample issues with different statuses and priorities

### Prepare to Explain

- **Architecture**: Component structure, Firebase integration
- **State Management**: How you handle filters, modals, toasts
- **Real-time Sync**: Explain `onSnapshot` and Firestore listeners
- **UX Decisions**: Why you chose certain features
- **Challenges**: What was tricky and how you solved it
- **Trade-offs**: What you prioritized given the time constraint

---

## Troubleshooting Deployment

### Build Fails

```bash
# Clear cache and reinstall
rm -rf node_modules dist
npm install
npm run build
```

### Environment Variables Not Working

- Ensure all variables start with `VITE_`
- Redeploy after adding variables
- Check build logs for errors

### Firebase Connection Issues

- Verify all Firebase services are enabled
- Check Firebase API key is correct
- Ensure Anonymous auth is enabled
- Check browser console for specific errors

---

## Next Steps After Deployment

1. Add the live URL to your README
2. Test all features on mobile
3. Ask a friend to test and provide feedback
4. Prepare your presentation talking points
5. Consider recording a quick demo video

---

**Good luck with your interview! 🚀**
