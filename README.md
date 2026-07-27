# PeopleFlow HR

> Modern enterprise Human Resource and Resource Allocation platform.

PeopleFlow HR is a React + Vite + TypeScript frontend for managing employees,
projects, skills, allocations, bench availability, reports, permissions, and
audit activity in an enterprise workforce environment.

![React](https://img.shields.io/badge/React-19.2.8-61DAFB?logo=react&logoColor=111)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.0-3178C6?logo=typescript&logoColor=fff)
![Vite](https://img.shields.io/badge/Vite-5.4.10-646CFF?logo=vite&logoColor=fff)
![SCSS](https://img.shields.io/badge/SCSS-Sass-CC6699?logo=sass&logoColor=fff)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.2.7-764ABC?logo=redux&logoColor=fff)
![React Router](https://img.shields.io/badge/React_Router-6.30.0-CA4245?logo=reactrouter&logoColor=fff)
![ESLint](https://img.shields.io/badge/ESLint-9.39.5-4B32C3?logo=eslint&logoColor=fff)
![Prettier](https://img.shields.io/badge/Prettier-3.9.5-F7B93E?logo=prettier&logoColor=111)

---

## Overview

PeopleFlow HR is an enterprise HR Management System focused on workforce
visibility, project staffing, allocation governance, and operational reporting.
The application is currently a frontend-first implementation using local dummy
JSON data with an API service layer prepared for backend integration.

Core product areas include:

- Employee Management
- Project Allocation
- Resource Planning
- Bench Management
- Role and Permission Management
- Reports
- Audit Logs
- Skills, Departments, and Designations Administration

> [!NOTE]
> This repository contains the frontend application. Domain screens currently
> use local `dummyJson` data while the API client and service folders are ready
> for future backend wiring.

---

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Folder Structure](#folder-structure)
- [Application Architecture](#application-architecture)
- [Component Architecture](#component-architecture)
- [Reusable Components](#reusable-components)
- [Styling System](#styling-system)
- [Theme System](#theme-system)
- [Dummy Data](#dummy-data)
- [Routing](#routing)
- [Responsive Design](#responsive-design)
- [Installation](#installation)
- [Development](#development)
- [Available Scripts](#available-scripts)
- [Development Guidelines](#development-guidelines)
- [Coding Standards](#coding-standards)
- [Current Project Status](#current-project-status)
- [Future Scope](#future-scope)
- [Screens](#screens)
- [Best Practices](#best-practices)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Dashboard

- KPI cards for workforce and allocation visibility
- Charts for utilization and operational insights
- Bench overview
- Upcoming releases
- Resource utilization summaries
- Recent workforce activity

### Employees

- Employee listing
- Search and filtering
- Employee create and edit screen
- Employee profile and detail view
- Allocation history
- Documents section
- Skills overview
- Employment and department details

### Projects

- Project listing
- Project detail page
- Team and allocation visibility
- Project metadata and status
- Required skills and staffing overview
- Placeholder create/edit workspaces ready for data integration

### Allocations

- Allocation listing
- Create allocation flow
- Allocation edit route
- Assignment details
- Duration and scheduling
- Allocation type selection
- Resource insight panel
- Project status summary

### Resource Planner

- Resource planning workspace
- Project staffing visibility
- Capacity-focused layout
- Navigation into allocation creation

### Bench and Availability

- Bench availability page
- Employee capacity signals
- Availability-oriented reporting and filters

### Skills

- Skills table
- Category tabs
- Skill search
- Bulk action control
- Add/edit skill modal
- Popularity and proficiency indicators
- Active status badge

### Departments and Designations

- Administration pages for workforce taxonomy
- Shared table and card patterns
- Local dummy data support

### Roles and Permissions

- Role listing
- Role summary
- Permission matrix
- Create role modal
- View/create/update/delete/export/override permission columns
- Save permissions action bar

### Reports

- Generic report screens for:
  - Employees
  - Allocations
  - Project staffing
  - Bench
  - Availability

### Audit Logs

- Audit log listing
- Audit metadata presentation
- Drawer/detail-oriented styling support
- Prepared structure for tracking administrative and allocation changes

### Authentication

- Login page
- Password recovery/reset route support
- Auth layout separation
- Redux auth slice and service layer scaffolding

---

## Technology Stack

| Category | Technology |
| --- | --- |
| Frontend | React `19.2.8` |
| Language | TypeScript `5.7.0` |
| Build Tool | Vite `5.4.10` |
| Routing | React Router DOM `6.30.0` |
| State Management | Redux Toolkit `2.2.7`, React Redux `9.1.0` |
| Styling | SCSS, Sass, Sass Embedded |
| Forms | React Hook Form, Zod |
| API Client | Axios |
| Icons | Lucide React |
| Error Handling | React Error Boundary |
| Testing | Vitest, Testing Library, jsdom, MSW |
| Linting | ESLint, TypeScript ESLint, React Hooks ESLint |
| Formatting | Prettier |
| Package Manager | npm |

---

## Folder Structure

```text
projectstructure/
├── public/
│   ├── logo192.png
│   └── logo512.png
├── src/
│   ├── api/
│   │   ├── client/
│   │   ├── services/
│   │   └── errorHandler.ts
│   ├── components/
│   │   ├── common/
│   │   └── layout/
│   ├── config/
│   ├── constants/
│   ├── dummyJson/
│   ├── features/
│   │   └── auth/
│   ├── hooks/
│   ├── pages/
│   │   ├── Maintenance/
│   │   ├── NotFound/
│   │   ├── PeopleFlow/
│   │   ├── ServerError/
│   │   └── Unauthorized/
│   ├── providers/
│   ├── redux/
│   ├── routes/
│   ├── types/
│   ├── utils/
│   │   └── css/
│   ├── App.tsx
│   └── main.tsx
├── eslint.config.js
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

### Major Folders

| Folder | Purpose |
| --- | --- |
| `src/api` | Axios client, interceptors, error handling, and service wrappers |
| `src/components/common` | Reusable UI primitives and shared controls |
| `src/components/layout` | Application, auth, public layouts, sidebar, and topbar |
| `src/config` | Environment configuration |
| `src/constants` | App constants, route constants, permissions, roles, storage, messages |
| `src/dummyJson` | Local JSON datasets used by PeopleFlow screens |
| `src/features/auth` | Authentication feature pages |
| `src/hooks` | Typed Redux hooks and shared React hooks |
| `src/pages/PeopleFlow` | Main product screens |
| `src/providers` | App-level providers such as theme |
| `src/redux` | Actions, action types, reducers, selectors, slices, and store setup |
| `src/routes` | Route config, route guards, route fallback, and layout selection |
| `src/types` | Shared TypeScript API, auth, route, common, and dummy-data types |
| `src/utils/css` | SCSS architecture for base, layout, components, pages, and themes |

<details>
<summary><strong>Common component directories</strong></summary>

```text
src/components/common/
├── Accordion/
├── Alert/
├── Avatar/
├── Badge/
├── Breadcrumb/
├── Button/
├── CanAccess/
├── Card/
├── Checkbox/
├── Chip/
├── ConfirmationDialog/
├── DataTable/
├── Divider/
├── Drawer/
├── Dropdown/
├── EmptyState/
├── ErrorBoundary/
├── ErrorFallback/
├── ErrorState/
├── FormField/
├── IconButton/
├── Input/
├── Loader/
├── Modal/
├── PageHeader/
├── Pagination/
├── PasswordInput/
├── Radio/
├── SearchInput/
├── Select/
├── Skeleton/
├── Switch/
├── Table/
├── Tabs/
├── Textarea/
├── Toast/
└── Tooltip/
```

</details>

---

## Application Architecture

PeopleFlow HR is organized around route-level screens, shared layouts, reusable
components, centralized constants, and local data sources.

```text
User
  ↓
Routes
  ↓
Layout
  ↓
Pages
  ↓
Screen Components
  ↓
Reusable Components
```

Data currently flows from local JSON into screen-level state and presentation:

```text
Dummy JSON
  ↓
Parent Screen
  ↓
Child Components
  ↓
Reusable Components
```

Styling is composed through centralized SCSS layers:

```text
Theme
  ↓
Variables
  ↓
Mixins / Functions
  ↓
Base Styles
  ↓
Layout Styles
  ↓
Component and Page Styles
```

### Architectural Principles

- Route-level screens live in `src/pages/PeopleFlow`.
- Layout shells live in `src/components/layout`.
- Reusable controls live in `src/components/common`.
- Shared constants live in `src/constants`.
- Domain fixture data lives in `src/dummyJson`.
- API integration points live in `src/api`.
- Redux state is isolated under `src/redux`.

---

## Component Architecture

### Shared Components

Reusable UI primitives such as buttons, cards, modals, tables, inputs, tabs,
drawers, toasts, skeletons, and form controls are stored under
`src/components/common`.

### Layout Components

Application shell components are stored under `src/components/layout`.

| Layout | Purpose |
| --- | --- |
| `AppLayout` | Main authenticated product shell |
| `AuthLayout` | Authentication pages |
| `PublicLayout` | Public/error routes |
| `Sidebar` | Main product navigation |
| `Topbar` | Header/search/utility area |

### Domain Screens

PeopleFlow product screens live in `src/pages/PeopleFlow`. These files compose
shared components, import dummy JSON where needed, and own page-level UI state.

### Separation of Concerns

- Pages own route-specific behavior.
- Reusable components stay generic.
- Constants prevent repeated strings and paths.
- Dummy data is imported by screens, not generic UI components.
- Styles are grouped by base, layout, component, page, and theme concerns.

---

## Reusable Components

| Component | Purpose |
| --- | --- |
| `Accordion` | Expandable content groups |
| `Alert` | Inline status and feedback messages |
| `Avatar` | User identity visuals |
| `Badge` | Compact status/category labels |
| `Breadcrumb` | Page hierarchy navigation |
| `Button` | Shared button component |
| `CanAccess` | Permission-aware rendering helper |
| `Card` | Framed content container |
| `Checkbox` | Boolean form input |
| `Chip` | Small removable/filter tokens |
| `ConfirmationDialog` | Confirm destructive or important actions |
| `DataTable` | Generic data table pattern |
| `Drawer` | Side panel content |
| `Dropdown` | Option menu |
| `EmptyState` | Empty result or placeholder state |
| `ErrorBoundary` | Runtime error isolation |
| `ErrorFallback` | App-level error fallback UI |
| `ErrorState` | Reusable error state block |
| `FormField` | Form field composition |
| `IconButton` | Icon-only actions |
| `Input` | Text input primitive |
| `Loader` | Loading indicator |
| `Modal` | Dialog overlay |
| `PageHeader` | Common page title/header actions |
| `Pagination` | Table/list pagination control |
| `PasswordInput` | Password field control |
| `Radio` | Radio selection input |
| `SearchInput` | Search field control |
| `Select` | Select/dropdown field |
| `Skeleton` | Loading placeholders |
| `Switch` | Toggle control |
| `Table` | Shared table component |
| `Tabs` | Section/tab navigation |
| `Textarea` | Multi-line text input |
| `Toast` | Toast notification provider |
| `Tooltip` | Hover/focus hints |

---

## Styling System

The project uses SCSS with layered files under `src/utils/css`.

```text
src/utils/css/
├── main.scss
├── abstracts/
│   ├── _functions.scss
│   ├── _index.scss
│   ├── _mixins.scss
│   └── _variables.scss
├── base/
│   ├── _global.scss
│   └── _reset.scss
├── components/
│   ├── _button.scss
│   ├── _data-table.scss
│   ├── _forms.scss
│   ├── _skeleton.scss
│   └── _toast.scss
├── layout/
│   ├── _app-layout.scss
│   ├── _sidebar.scss
│   └── _topbar.scss
├── pages/
│   ├── _error-pages.scss
│   ├── _peopleflow.scss
│   └── _skills.scss
└── themes/
    └── _theme.scss
```

### Styling Responsibilities

| Layer | Responsibility |
| --- | --- |
| `abstracts` | Variables, mixins, functions, shared Sass utilities |
| `base` | Reset and global element defaults |
| `components` | Reusable component classes |
| `layout` | App shell, sidebar, topbar |
| `pages` | Screen-specific PeopleFlow styling |
| `themes` | Theme-level tokens and semantic values |

---

## Theme System

The theme uses semantic CSS variables and SCSS tokens to keep visual decisions
centralized.

Theme values cover:

- Semantic colors
- Text colors
- Surfaces
- Borders
- Shadows
- Radius values
- Typography scale
- Layout spacing
- Responsive breakpoints

> [!TIP]
> To adjust global visual language, start with `src/utils/css/abstracts` and
> `src/utils/css/themes` before changing page-specific styles.

---

## Dummy Data

The frontend currently uses local JSON files for domain screens.

```text
src/dummyJson/
├── allocations/
├── auditLogs/
├── dashboard/
├── departments/
├── designations/
├── employees/
├── projects/
└── skills/
```

### Data Flow Rule

```text
JSON file
  ↓
Screen/page component
  ↓
Local state or derived view model
  ↓
Reusable UI component
```

Reusable components should remain data-source agnostic. They should receive
props from parent screens rather than importing JSON directly.

---

## Routing

Routes are declared in `src/routes/routeConfig.tsx` and rendered through
`AppLayout`, `AuthLayout`, or `PublicLayout`.

| Route | Layout | Description |
| --- | --- | --- |
| `/` | App | Dashboard |
| `/dashboard` | App | Dashboard |
| `/employees` | App | Employee list |
| `/employees/new` | App | Create employee |
| `/employees/:employeeId` | App | Employee detail |
| `/employees/:employeeId/edit` | App | Edit employee |
| `/projects` | App | Project list |
| `/projects/new` | App | Create project workspace |
| `/projects/:projectId` | App | Project detail |
| `/projects/:projectId/edit` | App | Edit project workspace |
| `/allocations` | App | Allocation list |
| `/allocations/new` | App | Create allocation |
| `/allocations/:allocationId/edit` | App | Edit allocation |
| `/resource-planner` | App | Resource planner |
| `/bench` | App | Bench and availability |
| `/departments` | App | Departments administration |
| `/designations` | App | Designations administration |
| `/skills` | App | Skills administration |
| `/settings/roles` | App | Roles and permissions |
| `/audit-logs` | App | Audit logs |
| `/system-states` | App | System states |
| `/reports/employees` | App | Employee reports |
| `/reports/allocations` | App | Allocation reports |
| `/reports/project-staffing` | App | Project staffing reports |
| `/reports/bench` | App | Bench reports |
| `/reports/availability` | App | Availability reports |
| `/clients` | App | Client workspace |
| `/clients/new` | App | Create client workspace |
| `/clients/:clientId` | App | Client detail workspace |
| `/clients/:clientId/edit` | App | Edit client workspace |
| `/login` | Auth | Login |
| `/forgot-password` | Auth | Password recovery |
| `/reset-password` | Auth | Password reset |
| `*` | Public | Not found |

---

## Responsive Design

PeopleFlow HR is designed for dense enterprise workflows across viewport sizes.

| Viewport | Behavior |
| --- | --- |
| Desktop | Persistent sidebar, wide tables, multi-column dashboard/form layouts |
| Tablet | Reduced column counts, wrapped actions, responsive cards |
| Mobile | Collapsible sidebar, stacked forms, horizontally scrollable dense tables |

Responsive support includes:

- Sidebar mobile overlay/backdrop behavior
- Hamburger-driven navigation state through Redux UI state
- Responsive table wrappers
- Stacked form grids
- Adaptive dashboard and detail layouts
- Hidden or condensed topbar search on narrower viewports

---

## Installation

```bash
git clone <repository-url>
cd projectstructure
npm install
npm run dev
```

The Vite dev server starts at:

```text
http://localhost:5173
```

---

## Development

Run the application locally:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run static checks:

```bash
npm run typecheck
npm run lint
npm run format:check
```

---

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite development server |
| `npm run dev:development` | Start Vite with development mode |
| `npm run dev:qa` | Start Vite with QA mode |
| `npm run dev:production` | Start Vite with production mode |
| `npm run build` | Run TypeScript build and Vite production build |
| `npm run build:development` | Build using development mode |
| `npm run build:qa` | Build using QA mode |
| `npm run build:production` | Build using production mode |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint with zero warning tolerance |
| `npm run typecheck` | Run TypeScript without emitting files |
| `npm run test` | Start Vitest |
| `npm run test:run` | Run Vitest once |
| `npm run test:coverage` | Run Vitest with coverage |
| `npm run format` | Format files with Prettier |
| `npm run format:check` | Check formatting with Prettier |

---

## Development Guidelines

- Use PascalCase for React components.
- Keep route-level screens in `src/pages`.
- Keep reusable UI in `src/components/common`.
- Keep layout shell code in `src/components/layout`.
- Prefer constants from `src/constants` over duplicated strings or paths.
- Keep domain fixture data in `src/dummyJson`.
- Let parent screens own data loading, local state, filters, and derived values.
- Pass data into reusable child components through props.
- Keep API calls inside `src/api/services`.
- Keep styling aligned with the SCSS architecture.
- Use existing shared components before creating new ones.

---

## Coding Standards

- TypeScript-first development.
- Strongly typed route, user, auth, API, and dummy-data models where available.
- Reusable components should be generic and data-source agnostic.
- Page components may compose domain-specific views.
- State should be colocated unless it must be global.
- Redux slices should be used for app-wide state.
- Keep side effects isolated in hooks, services, or page-level handlers.
- Avoid unrelated refactors in feature changes.
- Prefer readable component composition over deeply nested conditionals.
- Use ESLint and Prettier before opening a pull request.

---

## Current Project Status

| Area | Status |
| --- | --- |
| Dashboard | Complete |
| Employees | Complete |
| Employee forms | Complete |
| Employee detail | Complete |
| Projects | Complete |
| Project detail | Complete |
| Allocations | Complete |
| Allocation form | Complete |
| Resource planner | In progress |
| Bench and availability | Complete |
| Skills | Complete |
| Departments | Complete |
| Designations | Complete |
| Roles and permissions | Complete |
| Audit logs | Complete |
| Reports | In progress |
| Auth screens | Complete |
| API service layer | Scaffolded |
| Backend integration | Planned |

---

## Future Scope

Planned backend and enterprise capabilities:

- Authentication API integration
- Token refresh and session management
- Backend-driven RBAC
- Real employee, project, and allocation APIs
- Notifications
- File upload for employee documents
- Reports export
- Audit event persistence
- Server-side search, filters, sorting, and pagination
- Role assignment workflows
- Approval flows for over-allocation
- Environment-specific API configuration

---

## Screens

| Module | Route | Status |
| --- | --- | --- |
| Dashboard | `/dashboard` | Complete |
| Employees | `/employees` | Complete |
| Add Employee | `/employees/new` | Complete |
| Employee Detail | `/employees/:employeeId` | Complete |
| Projects | `/projects` | Complete |
| Project Detail | `/projects/:projectId` | Complete |
| Allocations | `/allocations` | Complete |
| New Allocation | `/allocations/new` | Complete |
| Resource Planner | `/resource-planner` | In progress |
| Bench | `/bench` | Complete |
| Departments | `/departments` | Complete |
| Designations | `/designations` | Complete |
| Skills | `/skills` | Complete |
| Roles and Permissions | `/settings/roles` | Complete |
| Audit Logs | `/audit-logs` | Complete |
| System States | `/system-states` | Complete |
| Reports | `/reports/*` | In progress |
| Login | `/login` | Complete |
| Password Recovery | `/forgot-password` | Complete |

---

## Best Practices

- Do not hardcode route paths when a route constant exists.
- Use `src/constants` for shared labels, routes, roles, permissions, and storage keys.
- Use shared components for common UI patterns.
- Use table wrappers for dense enterprise tables.
- Keep screen data inside `src/dummyJson` until backend integration is connected.
- Parent components own state, filtering, and transformations.
- Child components receive props and render UI.
- Keep reusable components independent from PeopleFlow-specific dummy data.
- Keep SCSS changes in the correct layer.
- Preserve responsive behavior when adding new pages.
- Use Lucide icons where iconography is needed.
- Run `npm run build` before release.

---

## API Layer

The API layer is prepared under `src/api`.

```text
src/api/
├── client/
│   ├── apiClient.ts
│   ├── interceptorManager.ts
│   ├── requestInterceptor.ts
│   └── responseInterceptor.ts
├── services/
│   ├── auth.service.ts
│   ├── dashboard.service.ts
│   ├── index.ts
│   └── user.service.ts
└── errorHandler.ts
```

Expected integration model:

```text
Page / Feature
  ↓
Service
  ↓
Axios Client
  ↓
Request / Response Interceptors
  ↓
Backend API
```

---

## State Management

Redux structure:

```text
src/redux/
├── actions/
├── actionTypes/
├── reducers/
├── selectors/
├── slices/
└── store/
```

Current slices and reducers support app UI, authentication, dashboard, and user
state. Typed hooks are exposed from `src/hooks`.

---

## Contributing

1. Create a feature branch.
2. Keep changes focused and scoped.
3. Follow the existing folder structure.
4. Reuse shared components where possible.
5. Add or update dummy JSON only when a screen requires fixture data.
6. Run checks before submitting:

```bash
npm run typecheck
npm run lint
npm run build
```

7. Open a pull request with:
   - Summary of changes
   - Screens or route links for UI changes
   - Testing notes
   - Known follow-ups, if any

---

## License

MIT License placeholder.

---

<p align="center">
  Built with React, TypeScript, Vite, SCSS, Redux Toolkit, and modern frontend architecture.
</p>
