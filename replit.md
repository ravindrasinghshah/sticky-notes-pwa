# Overview

This is a Progressive Web App (PWA) called "StickyPWA" - a smart sticky notes application for organizing thoughts and tasks. The application allows users to create, organize, and manage sticky notes within customizable buckets. It features a React frontend with TypeScript, an Express.js backend, and PostgreSQL database with real-time search capabilities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **State Management**: TanStack React Query for server state management and data fetching
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design

## Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Replit OAuth integration with Passport.js and OpenID Connect
- **Session Management**: Express sessions with PostgreSQL session store
- **API Design**: RESTful API with JSON responses and proper error handling

## Data Storage
- **Primary Database**: PostgreSQL with Neon serverless driver
- **Schema Management**: Drizzle Kit for migrations and schema definitions
- **Key Tables**:
  - `users` - User profiles and authentication data
  - `buckets` - Organizational containers for notes with color coding
  - `notes` - Individual sticky notes with rich content
  - `note_buckets` - Many-to-many relationship for note sharing
  - `sessions` - Session storage for authentication

## Authentication & Authorization
- **Provider**: Replit OAuth with OpenID Connect integration
- **Session Storage**: PostgreSQL-backed sessions with configurable TTL
- **Security**: HTTP-only cookies, CSRF protection, and secure session management
- **User Management**: Automatic user creation/updates on successful authentication

## External Dependencies

### Database & Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Replit**: Development environment and OAuth provider

### Frontend Libraries
- **UI Components**: Radix UI primitives for accessible, unstyled components
- **Styling**: Tailwind CSS for utility-first styling approach
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for date formatting and manipulation

### Backend Services
- **Database**: Drizzle ORM with Neon serverless PostgreSQL driver
- **Authentication**: Passport.js with OpenID Connect strategy
- **Session Store**: connect-pg-simple for PostgreSQL session storage
- **Development**: tsx for TypeScript execution and hot reloading

### Build & Development Tools
- **Build System**: Vite for fast development and optimized production builds
- **TypeScript**: Full type safety across frontend, backend, and shared schemas
- **Code Quality**: ESBuild for fast bundling and compilation
- **Replit Integration**: Custom Vite plugins for Replit development environment