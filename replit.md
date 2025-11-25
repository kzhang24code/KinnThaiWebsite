# KINN Thai Eatery

## Overview

KINN Thai Eatery is a premium restaurant website built with React and Express, featuring an elegant design inspired by high-end dining establishments. The application provides a full-stack solution for showcasing the restaurant's menu, accepting reservations, and presenting the restaurant's brand through a sophisticated user interface.

The project uses a modern TypeScript stack with Vite for development, TanStack Query for state management, and shadcn/ui components for a consistent, accessible design system. The backend is built with Express and uses Drizzle ORM for database operations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tools**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server, providing fast HMR and optimized production builds
- Wouter for lightweight client-side routing (alternative to React Router)

**UI Component System**
- shadcn/ui component library based on Radix UI primitives, providing accessible, unstyled components
- Tailwind CSS for utility-first styling with a custom design system
- Custom theme system with light/dark mode support via React Context
- Typography system using Playfair Display (serif) for headings and Inter/system-ui (sans-serif) for body text

**State Management**
- TanStack Query (React Query) for server state management, caching, and data fetching
- React Hook Form with Zod validation for form state and validation
- Local React state and Context API for UI state (theme toggle, mobile menu)

**Design Philosophy**
The application follows an "Elegant Thai Restaurant" design approach with:
- Minimalist aesthetics with generous white space
- Consistent spacing system using Tailwind's spacing scale (4, 6, 8, 12, 16, 20, 24, 32)
- Premium feel with high-quality imagery and sophisticated typography
- Responsive design with mobile-first approach
- Red primary color for CTAs and accents, neutral grays for hierarchy

### Backend Architecture

**Server Framework**
- Express.js for HTTP server and middleware handling
- Separate development (`index-dev.ts`) and production (`index-prod.ts`) entry points
- Development mode integrates Vite middleware for HMR
- Production mode serves pre-built static files

**API Design**
- RESTful API endpoints under `/api` prefix
- JSON-based request/response format
- Centralized error handling with Zod validation errors converted to user-friendly messages
- Custom logging middleware tracking request duration and responses

**Data Layer**
- Drizzle ORM for type-safe database operations
- Schema-first approach with TypeScript types generated from Drizzle schemas
- Memory storage implementation (`MemStorage`) for development/testing
- PostgreSQL dialect configured for production database
- Shared schema definitions between client and server using workspace paths

**Session Management**
- PostgreSQL session store via `connect-pg-simple`
- Session-based authentication ready (user schema defined but not currently implemented)

### Database Schema

**Tables**
1. **users** - Authentication and user management (defined but not actively used)
   - `id`: UUID primary key (auto-generated)
   - `username`: Unique username
   - `password`: Hashed password storage

2. **reservations** - Customer reservation data
   - `id`: UUID primary key (auto-generated)
   - `name`: Customer name
   - `email`: Customer email (validated)
   - `phone`: Customer phone number
   - `date`: Reservation date (text format)
   - `time`: Reservation time slot
   - `partySize`: Number of guests (1-20)
   - `specialRequests`: Optional text field for dietary restrictions or preferences

**Validation**
- Zod schemas derived from Drizzle table definitions using `drizzle-zod`
- Client and server share the same validation schemas for consistency
- Custom validation rules: email format, phone minimum length, party size constraints

### External Dependencies

**Database & ORM**
- Neon Database serverless driver (`@neondatabase/serverless`) for PostgreSQL connectivity
- Drizzle ORM for query building and schema management
- Drizzle Kit for migrations and schema pushing

**UI Component Libraries**
- Radix UI primitives for 25+ accessible component patterns (dialogs, dropdowns, tooltips, etc.)
- Embla Carousel for image carousels
- cmdk for command palette functionality
- Lucide React for icon system

**Form & Validation**
- React Hook Form for performant form state management
- Zod for runtime schema validation
- `@hookform/resolvers` for integrating Zod with React Hook Form
- `zod-validation-error` for user-friendly validation error messages

**Styling & Theming**
- Tailwind CSS with PostCSS for processing
- Class Variance Authority (CVA) for variant-based component styling
- `clsx` and `tailwind-merge` for conditional class composition

**Date Handling**
- date-fns for date formatting and manipulation in reservation forms

**Development Tools**
- TypeScript for type safety across the stack
- ESBuild for fast production builds
- Replit-specific plugins for development environment integration
- Custom Vite plugins for error overlay and development banner

**Asset Management**
- Static assets served from `attached_assets` directory
- Generated images for restaurant interior, dishes, and chef portraits
- Favicon and Open Graph meta images