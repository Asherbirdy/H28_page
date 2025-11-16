# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Architecture

This is a Vue 3 + TypeScript application using Composition API with the following key technologies:

- **Build System**: Vite with TypeScript support
- **UI Framework**: Naive UI 2.41.0 for components
- **CSS Framework**: UnoCSS with custom theme
- **State Management**: Pinia stores
- **Routing**: File-based routing with layouts (vite-plugin-pages)
- **Auto-imports**: Vue composables, components, and Naive UI auto-imported

### Directory Structure

- `src/components/` - Reusable components with auto-registration
- `src/hook/apis/` - API functions and data fetching hooks
- `src/types/apis/` - TypeScript interfaces for API responses
- `src/stores/` - Pinia stores organized by feature
- `src/pages/` - File-based routes with YAML frontmatter
- `src/layouts/` - Layout components for page structure
- `src/utils/` - Utility functions

### Code Patterns

**Vue Components**: Use `<script setup lang="ts">` syntax throughout. Route metadata defined with:
```vue
<route lang="yaml">
  name: 'Page Name'
</route>
```

**API Integration**: Create TypeScript interfaces in `types/apis/` and API functions in `hook/apis/` using axios with environment variables from `import.meta.env`.

**State Management**: Pinia stores using Composition API syntax with `defineStore()`.

**Styling**: UnoCSS utilities with custom theme. Custom colors: primary (#32457B), secondary (#4D9CFF), third (#2471FB).

## Development Commands

```bash
# Development server (binds to all hosts)
pnpm dev

# Production build
pnpm build

# Preview production build
pnpm preview  

# Type checking
pnpm type-check

# Linting with auto-fix
pnpm lint
```

## Environment Variables

Configure in `.env.development`:
- `VITE_API_MEETING` - Google Apps Script API endpoint
- `VITE_BASE`, `VITE_SERVER`, `VITE_PORT` - Base configuration

## Auto-Import Configuration

The following are automatically available without imports:
- Vue Composition API (ref, reactive, computed, onMounted, etc.)
- Vue Router composables
- Naive UI feedback composables (useDialog, useMessage, useNotification, useLoadingBar)
- Layout components from `components/` directory

## Custom Configuration

**UnoCSS Theme**: Responsive breakpoints and custom utilities defined in `uno.config.ts`. Use `flex-center` shortcut for centering.

**TypeScript**: Path alias `@/` maps to `./src`. Type definitions extend `ImportMetaEnv` in `src/env.d.ts` for environment variables.

**Naive UI**: Theme overrides applied in `src/theme.ts` for consistent branding.