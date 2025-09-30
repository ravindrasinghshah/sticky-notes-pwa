# Sticky Notes PWA

A Progressive Web App (PWA) for organizing thoughts and tasks with smart sticky notes. Create, organize, and manage sticky notes within customizable buckets with real-time synchronization, offline support, and cross-device accessibility.

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client (PWA)                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   React 18      │  │   Firebase      │  │   Service   │ │
│  │   TypeScript    │  │   Auth          │  │   Worker    │ │
│  │   Vite          │  │   Firestore     │  │   (PWA)     │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Firebase Backend                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   Authentication│  │   Firestore     │  │   Firebase  │ │
│  │   (Google OAuth)│  │   Database      │  │   Hosting   │ │
│  │                 │  │   (NoSQL)       │  │             │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Frontend Architecture

- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS
- **State Management**: TanStack React Query for server state management and data fetching
- **Routing**: Wouter for lightweight client-side routing with lazy loading
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
- **PWA Features**: Service Worker for offline support, Web App Manifest for installability

### Backend Architecture

- **Platform**: Firebase (Backend-as-a-Service)
- **Authentication**: Firebase Auth with Google OAuth provider
- **Database**: Cloud Firestore (NoSQL document database)
- **Hosting**: Firebase Hosting for static file serving
- **Real-time**: Firestore real-time listeners for live data synchronization

### Data Storage

- **Database**: Cloud Firestore (NoSQL document database)
- **Data Structure**:
  - `users/{userId}/buckets/{bucketId}` - User's note buckets with metadata
  - `users/{userId}/notes/{noteId}` - Individual sticky notes with content
- **Security**: Firestore Security Rules for user-based data access control
- **Offline Support**: Firestore offline persistence with automatic sync

### Authentication & Authorization

- **Provider**: Firebase Auth with Google OAuth integration
- **Session Management**: Firebase Auth handles user sessions automatically
- **Security**: Firestore Security Rules ensure users can only access their own data
- **User Management**: Automatic user creation and profile management through Firebase Auth

### PWA Features

- **Service Worker**: Caches essential resources for offline functionality
- **Web App Manifest**: Enables installation on mobile and desktop devices
- **Offline Support**: Background sync for note creation when offline
- **Push Notifications**: Framework ready for future notification features
- **Responsive Design**: Optimized for mobile, tablet, and desktop usage

## External Dependencies

### Firebase Services

- **Firebase Auth**: User authentication and session management
- **Cloud Firestore**: NoSQL database with real-time synchronization
- **Firebase Hosting**: Static web hosting with global CDN
- **Firebase Analytics**: User behavior tracking and app insights

### Frontend Libraries

- **UI Components**: Radix UI primitives for accessible, unstyled components
- **Styling**: Tailwind CSS for utility-first styling approach
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for date formatting and manipulation
- **Charts**: Recharts for data visualization

### Build & Development Tools

- **Build System**: Vite for fast development and optimized production builds
- **TypeScript**: Full type safety across the entire application
- **Code Quality**: ESBuild for fast bundling and compilation
- **PWA Tools**: Vite PWA plugin for service worker and manifest generation

## Local Development Setup

### Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher (comes with Node.js)
- **Firebase CLI**: For deployment and Firebase project management
- **Git**: For version control

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sticky-notes-pwa
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase project**
   ```bash
   # Install Firebase CLI globally
   npm install -g firebase-tools
   
   # Login to Firebase
   firebase login
   
   # Initialize Firebase in your project (if not already done)
   firebase init
   ```

4. **Configure Firebase**
   - Update `client/src/lib/firebase.ts` with your Firebase project credentials
   - Ensure your Firebase project has the following services enabled:
     - Authentication (with Google provider)
     - Firestore Database
     - Hosting

5. **Set up Firestore Security Rules**
   ```javascript
   // In Firebase Console > Firestore > Rules
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId}/{document=**} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

7. **Open in browser**
   - Navigate to `http://localhost:5173`
   - The app will automatically reload when you make changes

### Development Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production version
- `npm run check` - Run TypeScript type checking
- `npm run deploy` - Build and deploy to Firebase

### Project Structure

```
sticky-notes-pwa/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── ui/           # Shadcn/ui components
│   │   │   └── ...           # Custom components
│   │   ├── pages/            # Page components
│   │   ├── data/             # Firebase data layer
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utility functions
│   │   ├── providers/        # Context providers
│   │   └── security/         # Authentication guards
│   ├── public/               # Static assets
│   │   ├── manifest.json     # PWA manifest
│   │   └── sw.js            # Service worker
│   └── index.html           # HTML entry point
├── dist/                     # Built application (generated)
├── firebase.json            # Firebase configuration
├── client/src/lib/firebase.ts  # Firebase SDK configuration
├── package.json             # Dependencies and scripts
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build configuration
```

### Environment Configuration

The application uses Firebase configuration that should be set up in your Firebase project:

1. **Firebase Console Setup**:
   - Create a new Firebase project
   - Enable Authentication with Google provider
   - Create a Firestore database
   - Set up Firebase Hosting

2. **Update Configuration**:
   - Replace the Firebase config in `client/src/lib/firebase.ts` with your project's credentials
   - Ensure the Google OAuth client is properly configured

### Troubleshooting

**Common Issues**:

1. **Firebase Authentication not working**:
   - Verify Google OAuth is enabled in Firebase Console
   - Check that the authorized domains include `localhost:5173`

2. **Firestore permission denied**:
   - Ensure Firestore Security Rules are properly configured
   - Check that the user is authenticated before accessing data

3. **Build errors**:
   - Run `npm run check` to identify TypeScript errors
   - Ensure all dependencies are installed with `npm install`

4. **PWA not working**:
   - Verify the service worker is registered
   - Check that the manifest.json is properly configured
   - Test in a production build, not development mode

## Deployment

### Firebase Deployment

The application is configured for deployment to Firebase Hosting:

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to Firebase**
   ```bash
   npm run deploy
   ```
   Or manually:
   ```bash
   firebase deploy
   ```

3. **Verify deployment**
   - Check the Firebase Console for deployment status
   - Visit your Firebase Hosting URL to test the application

### Deployment Configuration

The `firebase.json` file contains the hosting configuration:

```json
{
  "hosting": {
    "site": "sticky-notes",
    "public": "dist/public",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### Production Checklist

Before deploying to production:

- [ ] Firebase project is properly configured
- [ ] Firestore Security Rules are set up
- [ ] Google OAuth is configured with production domains
- [ ] PWA manifest is updated with correct URLs
- [ ] Service worker is working correctly
- [ ] All environment variables are set
- [ ] Build completes without errors
- [ ] Application works in production build

### Custom Domain (Optional)

To use a custom domain:

1. **Add custom domain in Firebase Console**:
   - Go to Firebase Console > Hosting
   - Click "Add custom domain"
   - Follow the verification steps

2. **Update Firebase configuration**:
   - Update authorized domains in Authentication settings
   - Update PWA manifest with new domain

### Monitoring and Analytics

Firebase provides built-in monitoring:

- **Firebase Analytics**: Track user behavior and app performance
- **Firebase Performance**: Monitor app performance metrics
- **Firebase Crashlytics**: Track and analyze crashes (if enabled)

### Backup and Recovery

- **Firestore**: Automatic backups are handled by Google Cloud
- **User Data**: All user data is stored in Firestore with automatic replication
- **Code**: Use Git for version control and backup of source code
