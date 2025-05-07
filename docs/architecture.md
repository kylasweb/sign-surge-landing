# Landing Page Builder System Architecture

## System Overview
This document outlines the technical architecture for an advanced landing page builder system built with React/TypeScript and shadcn/ui.

## System Architecture Diagram
```mermaid
graph TD
    subgraph "Frontend - React/TypeScript"
        UI[UI Layer]
        DND[Drag-n-Drop Engine]
        PREV[Preview Engine]
        COMP[Component Registry]
    end

    subgraph "Backend Services"
        API[API Gateway]
        AUTH[Auth Service]
        BUILDER[Builder Service]
        AI[AI Service]
        IMG[Image Service]
        VER[Version Control]
    end

    subgraph "External Services"
        CLD[(Cloudinary)]
        GPT[OpenAI/Gemini API]
        REP[Replicate API]
    end

    UI --> API
    DND --> BUILDER
    PREV --> BUILDER
    BUILDER --> AI
    AI --> GPT
    AI --> REP
    IMG --> CLD
```

## Data Model Design
```mermaid
erDiagram
    Page {
        string id PK
        string name
        json layout
        json styles
        string version
        timestamp created_at
        timestamp updated_at
    }
    Component {
        string id PK
        string type
        json props
        json styles
        string category
    }
    Template {
        string id PK
        string name
        json layout
        json styles
        string category
    }
    Asset {
        string id PK
        string url
        string type
        number size
        string cloudinary_id
    }
    Version {
        string id PK
        string page_id FK
        json snapshot
        timestamp created_at
    }
    
    Page ||--o{ Component : contains
    Page ||--o{ Asset : uses
    Page ||--o{ Version : has
    Template ||--o{ Component : contains
```

## API Structure
```typescript
// Pages API
POST   /api/pages                 // Create new page
GET    /api/pages                 // List pages
GET    /api/pages/:id            // Get page
PUT    /api/pages/:id            // Update page
DELETE /api/pages/:id            // Delete page
POST   /api/pages/:id/clone      // Clone page
POST   /api/pages/:id/publish    // Publish page

// Components API
GET    /api/components           // List components
POST   /api/components           // Create custom component
PUT    /api/components/:id       // Update component
DELETE /api/components/:id       // Delete component

// Assets API
POST   /api/assets/upload        // Upload asset
GET    /api/assets               // List assets
DELETE /api/assets/:id           // Delete asset
POST   /api/assets/optimize      // Optimize asset

// AI API
POST   /api/ai/generate-content  // Generate content
POST   /api/ai/suggest-layout    // Get layout suggestions
POST   /api/ai/optimize-design   // Get design optimization

// Version Control
GET    /api/versions/:pageId     // List versions
POST   /api/versions/:pageId     // Create version
GET    /api/versions/:id/restore // Restore version
```

## Third-party Services
```mermaid
graph LR
    subgraph "Core Services"
        A[AI Services] --> B[OpenAI]
        A --> C[Gemini]
        A --> D[Replicate]
        E[Image Management] --> F[Cloudinary]
        G[State Management] --> H[Zustand]
        I[UI Components] --> J[shadcn/ui]
    end

    subgraph "Development Tools"
        K[Version Control] --> L[Git]
        M[Package Manager] --> N[pnpm]
        O[Build Tool] --> P[Vite]
    end
```

## Performance Optimization Strategies
```mermaid
mindmap
  root((Performance))
    Component Loading
      Lazy loading
      Code splitting
      Dynamic imports
    Image Optimization
      Cloudinary automatic optimization
      Responsive images
      WebP format
    Caching Strategy
      Component cache
      API response cache
      Asset cache
    Build Optimization
      Tree shaking
      Minification
      Compression
```

## Key Technical Decisions

### Frontend Architecture
- React with TypeScript for type safety
- Zustand for state management
- Drag-and-drop using dnd-kit
- Modular component system with shadcn/ui
- Real-time preview using iframe isolation

### AI Integration
- Multi-model approach using OpenAI, Gemini, and Replicate
- AI service abstraction layer for model switching
- Caching of AI responses for similar requests
- Batch processing for layout optimization

### Image System
- Cloudinary for image storage and optimization
- Client-side image compression before upload
- Lazy loading with blur placeholders
- Automatic WebP conversion

### Version Control
- JSON-based diff system for layouts
- Incremental updates for better performance
- Snapshot system for quick rollbacks
- Branch-based template system