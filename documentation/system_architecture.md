# System Architecture

## High-Level Architecture

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

## Frontend Architecture

### Core Technologies
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS
- **State Management**: TanStack React Query for server state management and data fetching
- **Routing**: Wouter for lightweight client-side routing with lazy loading
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design

### PWA Features
- **Service Worker**: Caches essential resources for offline functionality
- **Web App Manifest**: Enables installation on mobile and desktop devices
- **Offline Support**: Background sync for note creation when offline
- **Push Notifications**: Framework ready for future notification features
- **Responsive Design**: Optimized for mobile, tablet, and desktop usage

## Backend Architecture

### Firebase Services
- **Platform**: Firebase (Backend-as-a-Service)
- **Authentication**: Firebase Auth with Google OAuth provider
- **Database**: Cloud Firestore (NoSQL document database)
- **Hosting**: Firebase Hosting for static file serving
- **Real-time**: Firestore real-time listeners for live data synchronization

### Data Storage

#### Database Structure
- **Database**: Cloud Firestore (NoSQL document database)
- **Data Structure**:
  - `users/{userId}/buckets/{bucketId}` - User's note buckets with metadata
  - `users/{userId}/notes/{noteId}` - Individual sticky notes with content
- **Security**: Firestore Security Rules for user-based data access control
- **Offline Support**: Firestore offline persistence with automatic sync

#### Data Models

**User Document Structure:**
```typescript
interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
}
```

**Bucket Document Structure:**
```typescript
interface Bucket {
  id: string;
  name: string;
  description?: string;
  color: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  noteCount: number;
  pinnedNotes: string[];
}
```

**Note Document Structure:**
```typescript
interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  color: string;
  fontFamily: string;
  fontSize: number;
  isPinned: boolean;
  bucketIds: string[]; // For cross-bucket sharing
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## Authentication & Authorization

### Authentication Flow
- **Provider**: Firebase Auth with Google OAuth integration
- **Session Management**: Firebase Auth handles user sessions automatically
- **Security**: Firestore Security Rules ensure users can only access their own data
- **User Management**: Automatic user creation and profile management through Firebase Auth

### Security Rules
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

## Performance Considerations

### Frontend Optimization
- **Code Splitting**: Lazy loading of routes and components
- **Bundle Optimization**: Tree shaking and dead code elimination
- **Caching Strategy**: Service worker caching for offline functionality
- **Image Optimization**: Responsive images and lazy loading

### Backend Optimization
- **Firestore Indexing**: Optimized queries with proper indexes
- **Real-time Listeners**: Efficient data synchronization
- **Offline Persistence**: Local caching for improved performance
- **Security Rules**: Optimized for minimal database reads

## Scalability

### Horizontal Scaling
- **Firebase Auto-scaling**: Automatic scaling based on demand
- **CDN Distribution**: Global content delivery network
- **Database Sharding**: Automatic sharding by Firebase

### Performance Monitoring
- **Firebase Performance**: Real-time performance monitoring
- **Firebase Analytics**: User behavior and app performance insights
- **Error Tracking**: Comprehensive error logging and tracking

## Security Considerations

### Data Protection
- **Encryption**: Data encrypted in transit and at rest
- **Access Control**: User-based data isolation
- **Input Validation**: Client and server-side validation
- **XSS Protection**: Content Security Policy implementation

### Privacy
- **Data Minimization**: Only necessary data is collected
- **User Control**: Users can delete their data
- **Compliance**: GDPR and privacy regulation compliance