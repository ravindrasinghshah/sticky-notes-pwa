# Project Structure

## 📁 Directory Structure

```
sticky-notes-pwa/
├── client/                           # Frontend React application
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── ui/                 # Shadcn/ui base components
│   │   │   ├── auth-layout.tsx     # Authentication wrapper
│   │   │   ├── bucket-editor.tsx   # Bucket creation/editing
│   │   │   ├── bucket-manager.tsx  # Bucket management
│   │   │   ├── note-editor.tsx     # Note creation/editing
│   │   │   ├── note-viewer.tsx     # Note display
│   │   │   ├── search-bar.tsx      # Note search functionality
│   │   │   ├── tag-bottom-sheet.tsx # Tag management
│   │   │   ├── theme-toggle.tsx    # Dark/light mode toggle
│   │   │   └── user-info.tsx       # User profile component
│   │   ├── pages/                  # Route components
│   │   │   ├── home.tsx           # Main dashboard
│   │   │   ├── landing.tsx        # Landing page
│   │   │   ├── profile.tsx        # User profile
│   │   │   └── settings.tsx       # App settings
│   │   ├── data/                   # Data layer & Firebase integration
│   │   │   ├── firebase.ts        # Firebase configuration
│   │   │   ├── firebaseStorage.ts # Storage interface
│   │   │   ├── schema.ts          # Data validation schemas
│   │   │   └── storageInterface.ts # Storage abstraction
│   │   ├── hooks/                  # Custom React hooks
│   │   │   ├── use-cached-query.ts # Query caching
│   │   │   ├── use-mobile.tsx     # Mobile detection
│   │   │   └── use-toast.ts       # Toast notifications
│   │   ├── lib/                    # Utility functions
│   │   │   ├── authUtils.ts       # Authentication helpers
│   │   │   ├── bucket-utils.ts    # Bucket operations
│   │   │   ├── firebase.ts        # Firebase utilities
│   │   │   ├── tags.ts            # Tag management
│   │   │   └── utils.ts            # General utilities
│   │   ├── providers/              # React context providers
│   │   │   ├── StateProvider.tsx  # Global state management
│   │   │   └── ThemeProvider.tsx  # Theme context
│   │   └── security/               # Authentication guards
│   │       └── AuthGuard.tsx      # Route protection
│   ├── public/                     # Static assets
│   │   ├── manifest.json          # PWA manifest
│   │   ├── sw.js                  # Service worker
│   │   └── icons/                 # App icons
│   └── index.html                 # HTML entry point
├── documentation/                  # Project documentation
│   ├── system_architecture.md    # Technical architecture
│   ├── development_setup.md       # Setup instructions
│   ├── contribution_guidelines.md  # Contribution guide
│   └── project_structure.md       # This file
├── dist/                           # Built application (generated)
├── firebase.json                  # Firebase hosting configuration
├── package.json                   # Dependencies and scripts
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts                # Vite build configuration
└── readme.md                     # Main README file
```

## 🔍 Key Files for Contributors

### Essential Files to Understand the Codebase

#### Core Application Files
- `client/src/lib/firebase.ts` - Firebase configuration and initialization
- `client/src/data/schema.ts` - Data models and validation schemas
- `client/src/providers/StateProvider.tsx` - Global state management
- `client/public/manifest.json` - PWA configuration
- `firebase.json` - Firebase hosting and deployment settings

#### Component Files
- `client/src/components/note-editor.tsx` - Core note editing functionality
- `client/src/components/bucket-manager.tsx` - Bucket management logic
- `client/src/components/auth-layout.tsx` - Authentication wrapper
- `client/src/components/theme-toggle.tsx` - Dark/light mode toggle

#### Data Layer Files
- `client/src/hooks/use-cached-query.ts` - Data fetching and caching
- `client/src/data/firebaseStorage.ts` - Storage interface implementation
- `client/src/lib/bucket-utils.ts` - Bucket operations utilities
- `client/src/lib/tags.ts` - Tag management utilities

#### Configuration Files
- `package.json` - Dependencies and npm scripts
- `vite.config.ts` - Vite build configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration

## 📝 File Naming Conventions

### Components
- **Format**: `kebab-case.tsx`
- **Examples**: `note-editor.tsx`, `bucket-manager.tsx`, `theme-toggle.tsx`
- **Purpose**: React components for UI elements

### Hooks
- **Format**: `use-kebab-case.ts`
- **Examples**: `use-cached-query.ts`, `use-mobile.tsx`, `use-toast.ts`
- **Purpose**: Custom React hooks for reusable logic

### Utilities
- **Format**: `kebab-case.ts`
- **Examples**: `bucket-utils.ts`, `auth-utils.ts`, `tags.ts`
- **Purpose**: Pure utility functions and helpers

### Pages
- **Format**: `kebab-case.tsx`
- **Examples**: `home.tsx`, `profile.tsx`, `settings.tsx`
- **Purpose**: Route components for different pages

### Data Files
- **Format**: `kebab-case.ts`
- **Examples**: `firebase.ts`, `schema.ts`, `storageInterface.ts`
- **Purpose**: Data layer, schemas, and external service integrations

## 🏗️ Architecture Patterns

### Component Organization
- **UI Components**: Located in `components/ui/` - Reusable base components
- **Feature Components**: Located in `components/` - Feature-specific components
- **Page Components**: Located in `pages/` - Route-level components

### Data Flow
- **State Management**: Context providers in `providers/`
- **Data Fetching**: Custom hooks in `hooks/`
- **Data Layer**: Firebase integration in `data/`
- **Utilities**: Helper functions in `lib/`

### Security
- **Authentication**: Auth guards in `security/`
- **Route Protection**: AuthGuard component
- **Data Security**: Firestore security rules

## 🚀 Getting Started with the Codebase

### For New Contributors
1. **Start with**: `client/src/lib/firebase.ts` to understand Firebase setup
2. **Read**: `client/src/data/schema.ts` to understand data models
3. **Explore**: `client/src/components/note-editor.tsx` for core functionality
4. **Check**: `client/src/hooks/use-cached-query.ts` for data fetching patterns

### For UI Contributors
1. **Focus on**: `client/src/components/` directory
2. **Understand**: `client/src/components/ui/` for base components
3. **Review**: `tailwind.config.ts` for styling configuration

### For Backend Contributors
1. **Examine**: `client/src/data/` directory for data layer
2. **Review**: `firebase.json` for deployment configuration
3. **Check**: `client/src/lib/firebase.ts` for Firebase setup

## 📦 Dependencies Overview

### Core Dependencies
- **React 18**: Frontend framework
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Firebase**: Backend services

### UI Dependencies
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library

### State Management
- **TanStack React Query**: Server state management
- **React Context**: Local state management

### Forms & Validation
- **React Hook Form**: Form handling
- **Zod**: Schema validation

## 🔧 Development Workflow

### File Creation Guidelines
1. **Components**: Create in appropriate `components/` subdirectory
2. **Hooks**: Create in `hooks/` directory
3. **Utilities**: Create in `lib/` directory
4. **Types**: Define in `data/schema.ts` or component files

### Import Patterns
- **Relative imports**: For files in same directory
- **Absolute imports**: For cross-directory imports
- **External imports**: At the top of files

### Code Organization
- **Single responsibility**: Each file should have one clear purpose
- **Consistent naming**: Follow established naming conventions
- **Clear exports**: Export only what's needed
