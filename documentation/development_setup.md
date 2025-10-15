### Development Setup

#### Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher
- **Git**: For version control
- **Firebase CLI**: For Firebase project management

#### Firebase Setup

1. **Install Firebase CLI**:

   ```bash
   npm install -g firebase-tools
   ```

2. **Create a Firebase project**:

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Google provider)
   - Create a Firestore database
   - Set up Firebase Hosting

3. **Configure Firebase**:

   - Update `client/src/lib/firebase.ts` with your project credentials
   - Add your domain to authorized domains in Firebase Console

4. **Set up Firestore Security Rules**:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId}/{document=**} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

#### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

#### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run check` - Run TypeScript type checking
- `npm run deploy` - Build and deploy to Firebase
