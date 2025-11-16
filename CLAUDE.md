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

## 🚨 IMPORTANT DESIGN GUIDELINES

**UI Framework Priority**: ALL pages MUST use Naive UI components as the primary design system. Avoid custom HTML elements and CSS classes where Naive UI components exist.

**No Sidebar Navigation**: Do NOT implement or use sidebar navigation. Keep layout simple with main content area only.

**Required Naive UI Components for Pages**:
- `n-space` for layout spacing
- `n-card` for content containers  
- `n-data-table` for tabular data
- `n-button`, `n-input`, `n-select` for form controls
- `n-spin` for loading states
- `n-empty` for empty/error states
- `n-h1`, `n-h2`, `n-text` for typography
- `n-statistic` for metrics display

**Page Structure Template**:
```vue
<script setup lang='ts'>
import { NSpace, NH1, NCard, NButton } from 'naive-ui'
// Import other required Naive UI components
</script>

<template>
  <n-space vertical :size="16" class="p-6">
    <n-h1>Page Title</n-h1>
    <!-- Page content with Naive UI components -->
  </n-space>
</template>
```

**🚨 CRITICAL**: Always explicitly import Naive UI components in each page file. Auto-import may not work consistently for all Naive UI components.