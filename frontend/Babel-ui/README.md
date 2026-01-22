# Frontend Architecture (React + TypeScript + Vite)

This document defines the folder structure and architectural guidelines for the BabelProgram frontend.
The goal is to maintain a consistent, scalable structure that supports long-term development and team collaboration.

---

## Project Structure

```
frontend/Babel-ui/
└── src/
    ├── assets/
    ├── components/
    ├── contexts/
    ├── hooks/
    ├── pages/
    ├── routes/
    ├── services/
    ├── styles/
    ├── types/
    ├── utils/
    ├── App.tsx
    ├── main.tsx
    └── index.css
```

---

## Folder Descriptions

### assets/

Contains static files such as images, icons, and fonts.
No business logic or React components should be placed here.

---

### components/

Contains shared, reusable UI components used across multiple pages.
Components in this directory should be presentational and not contain page-specific logic.
An `index.ts` file is recommended for exporting components to simplify imports.

---

### contexts/

Contains React Context providers for application-wide state (e.g., authentication state, theme state, language settings).

---

### hooks/

Contains custom React hooks.
Hooks encapsulate reusable logic and must be named using the `useX` convention.

---

### pages/

Contains top-level page components.
Each file or folder represents a screen within the application.
Pages should assemble components and application logic but should not contain reusable UI elements.

---

### routes/

Contains all routing-related logic, including:

* Application route definitions
* Protected route wrappers
* Lazy-loaded route configuration
* Layout-based routing

Routing logic should reside here rather than inside page files.

---

### services/

Contains API clients, backend communication logic, and external service wrappers.
Examples include:

* `api.ts` for the shared Axios instance or Fetch wrapper
* Authentication service functions
* Student or teacher related data services

Networking and data-fetching code should not be placed in components or pages.

---

### styles/

Contains global CSS, theme definitions, design tokens, and any other style resources not tied to a specific component.

---

### types/

Contains shared TypeScript interfaces, type definitions, and models used across the application.

---

### utils/

Contains pure utility functions that are not tied to React and do not involve application state.
Utility functions should be reusable and testable.

---

## Architectural Guidelines

1. **Separation of Concerns**
   UI, logic, and data handling responsibilities are divided across dedicated folders to avoid tightly coupled code.

2. **Reusability**
   Shared logic and components should be centralized in `components/`, `hooks/`, and `utils/` to prevent duplication.

3. **Routing Discipline**
   Routes are defined centrally to ensure consistency and to avoid routing logic being scattered across pages.

4. **Service Isolation**
   All API and external service interactions should be implemented within `services/`.
   Components and pages should only call service functions and should not handle request logic directly.

5. **Maintainability**
   Code should be organized so new team members can quickly understand where functionality belongs.

---

## Future Considerations

As the project expands, it may be beneficial to adopt a domain-driven structure, for example:

```
features/
    auth/
    students/
    teachers/
    dashboard/
```

This approach is appropriate once the number of pages and features grows large enough that grouping by feature provides clearer boundaries and maintainability.

---