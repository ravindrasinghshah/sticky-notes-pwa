# PostgreSQL to Firebase Migration Guide

This guide will help you migrate your sticky notes PWA from PostgreSQL to Firebase Database.

## Migration Overview

The migration involves:
1. **Data Structure Changes**: Moving from relational tables to Firestore subcollections
2. **Authentication**: Using Firebase Auth (OAuth) - no user management needed
3. **API Changes**: Updating server routes to use Firebase instead of PostgreSQL
4. **Simplified User Management**: Firebase Auth handles all user operations

## Data Structure Mapping

### PostgreSQL → Firebase

| PostgreSQL Table | Firebase Structure |
|------------------|-------------------|
| `users` | Firebase Auth (no separate collection needed) |
| `buckets` | `users/{userId}/buckets/{bucketId}` subcollection |
| `notes` | `users/{userId}/notes/{noteId}` subcollection |
| `note_buckets` | `sharedBucketIds` array in note documents |
| `sessions` | Firebase Auth (replaces Replit Auth) |

## Migration Steps

### 1. Update Environment Variables

Remove PostgreSQL-related environment variables:
- `DATABASE_URL`

Add Firebase configuration (already configured in the code):
- Firebase project configuration is already set up in `firebase-config.ts`

### 2. Update Dependencies

The following dependencies are no longer needed:
- `@neondatabase/serverless`
- `drizzle-orm`
- `drizzle-zod`

### 3. Data Migration

If you have existing data in PostgreSQL, you'll need to export it and import it into Firebase. Here's a sample migration script:

```typescript
// migration-script.ts
import { db } from './client/src/data/firebase';
import { collection, addDoc } from 'firebase/firestore';

async function migrateData() {
  // Export your PostgreSQL data first
  const buckets = await exportBucketsFromPostgreSQL();
  const notes = await exportNotesFromPostgreSQL();
  const noteBuckets = await exportNoteBucketsFromPostgreSQL();

  // Note: Users are managed by Firebase Auth, so no user migration needed

  // Migrate buckets
  for (const bucket of buckets) {
    await addDoc(collection(db, 'users', bucket.userId, 'buckets'), {
      ...bucket,
      createdAt: new Date(bucket.createdAt),
      updatedAt: new Date(bucket.updatedAt),
    });
  }

  // Migrate notes with shared bucket relationships
  for (const note of notes) {
    const sharedBucketIds = noteBuckets
      .filter(nb => nb.noteId === note.id)
      .map(nb => nb.bucketId)
      .filter(bucketId => bucketId !== note.primaryBucketId);

    await addDoc(collection(db, 'users', note.userId, 'notes'), {
      ...note,
      sharedBucketIds,
      createdAt: new Date(note.createdAt),
      updatedAt: new Date(note.updatedAt),
    });
  }
}
```

### 4. Update Client Code

The client code has been updated to use Firebase. The main changes are:

- **Authentication**: Now uses Firebase Auth (OAuth) - no user management needed
- **Data Layer**: Uses Firebase Firestore instead of PostgreSQL
- **Real-time Updates**: Firebase provides real-time listeners for better UX
- **Simplified Architecture**: No separate user collection needed

### 5. Update Server Code

The server has been updated to use Firebase:

- **Storage Layer**: `client/src/data/firebaseStorage.ts` - Core Firebase operations
- **Adapter Layer**: `client/src/data/firebaseStorageAdapter.ts` - Maintains PostgreSQL API compatibility
- **Type Safety**: Maintains the same API interface for backward compatibility
- **Simplified User Management**: No user CRUD operations needed

## Key Benefits of Migration

1. **Real-time Updates**: Firebase provides real-time listeners for instant updates
2. **Scalability**: Firestore scales automatically
3. **Offline Support**: Built-in offline support for better mobile experience
4. **Security**: Firebase Security Rules provide fine-grained access control
5. **Cost**: Pay-as-you-go pricing model
6. **Simplified User Management**: Firebase Auth handles all user operations
7. **OAuth Integration**: Built-in support for Google and other OAuth providers

## Security Rules

Add these Firestore security rules to your Firebase project:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Buckets subcollection
      match /buckets/{bucketId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // Notes subcollection
      match /notes/{noteId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

**Note**: Since users are managed by Firebase Auth, there's no need for a separate user collection. The `userId` in the security rules refers to the Firebase Auth UID.

## Testing the Migration

1. **Start the development server**: `npm run dev`
2. **Test authentication**: Sign in with Google
3. **Test CRUD operations**: Create, read, update, and delete buckets and notes
4. **Test search functionality**: Search for notes
5. **Test real-time updates**: Open multiple browser tabs to see real-time updates

## Rollback Plan

If you need to rollback to PostgreSQL:

1. Revert the changes to `server/routes.ts` (change import back to `./storage`)
2. Revert the changes to `client/src/data/index.ts` (remove Firebase exports)
3. Restore PostgreSQL environment variables
4. Reinstall PostgreSQL dependencies

## Support

If you encounter any issues during migration, check:

1. **Firebase Console**: Ensure your project is properly configured
2. **Authentication**: Verify Firebase Auth is set up correctly
3. **Security Rules**: Ensure Firestore rules allow your operations
4. **Network**: Check for any network connectivity issues

## Next Steps

After successful migration:

1. **Monitor Performance**: Use Firebase Console to monitor usage
2. **Optimize Queries**: Review and optimize Firestore queries
3. **Set up Alerts**: Configure Firebase alerts for errors and usage
4. **Backup Strategy**: Implement regular data backups
5. **Security Review**: Regularly review and update security rules
