# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Snow** is a browser extension that provides AI-powered chat functionality. The codebase is a monorepo with packages for core functionality and browser extension.

## Architecture

### Core Structure
- **Monorepo**: Uses npm workspaces with packages in `/packages/`
- **Core Package**: `@snow/core` - Shared utilities and AI configuration management
- **Extension Package**: Browser extension with side-panel UI

### Key Components
- **AIConfigManager**: Central service for managing AI model configurations
- **ModelCard**: Reusable component for displaying model configurations (4 props: config, onSetDefault, onEdit, onDelete)
- **ModelFormDialog**: Dedicated form component for adding/editing models with reusable FormField/FormCheckbox components
- **Settings**: Main settings management component using the above components

## Development Commands

### Setup & Installation
```bash
pnpm install                   # Install all dependencies
pnpm dev                       # Start development mode
pnpm build                     # Build all packages
pnpm build:extension           # Build extension specifically
```

### Extension Development
```bash
cd packages/extension
pnpm dev                       # Extension development server
pnpm build                     # Build extension
```

### Testing
```bash
pnpm test                      # Run all tests
pnpm test:watch                # Run tests in watch mode
```

### Code Quality
```bash
pnpm lint                      # Run linting
pnpm format                    # Format code with prettier
```

## Component Patterns

### Form Components
- **FormField**: Reusable text input with label, validation, and autoComplete="off"
- **FormCheckbox**: Standardized checkbox with label and description
- Both components use shadcn/ui styling and are responsive

### State Management
- **React hooks** for local state
- **AIConfigManager** for persistent configuration storage
- **useState** for form state in ModelFormDialog

### Styling
- **shadcn/ui** components throughout
- **Tailwind CSS** for styling
- **Responsive design** with mobile-first approach (375px minimum)

## File Structure

```
snow/
├── packages/
│   ├── core/           # Shared utilities and AI config management
│   └── extension/      # Browser extension
│       └── src/
│           └── side-panel/
│               └── components/
│                   ├── Settings.tsx
│                   ├── ModelCard.tsx
│                   └── ModelFormDialog.tsx
```

## Development Notes

- **ModelType**: Enum with LANGUAGE and VISION options
- **AIConfig**: Interface for model configuration data
- **Responsive**: All components designed for 375px+ width (browser extension constraint)
- **Security**: Input fields have autoComplete="off" for sensitive data
- **Components**: Follow single responsibility principle with clear prop interfaces