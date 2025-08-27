---
applyTo: '**'
---

# Folder Structure


**src**: This folder contains all the source code for the project. It is typically organized into subfolders based on features or modules.


**src/app**: This folder will only contain page.tsx and layout.tsx files. All other components,utils,libs should be placed outside of app folder.

**src/components**: This folder contains reusable UI components that can be used across different parts of the application globally. Feature related components should be placed in the respective feature folder inside src. check below for more details.

**src/actions**: This folder contains server actions that can be used across different parts of the application globally.


**src/components/ui**: This subfolder contains Shadcn UI components. These components are designed to be reusable and can be used throughout the application globally.


**src/features**: This folder contains feature-specific code, including components, hooks, and utilities related to specific functionalities of the application. Each feature should have its own subfolder within the features folder.

**src/features/[feature-name]**: Each feature should have its own subfolder within the features folder. This subfolder should contain all the code related to that specific feature, including components, hooks, and utilities.


**src/features/[feature-name]/components**: This subfolder contains components that are specific to the feature and are not meant to be reused globally.

**src/features/[feature-name]/hooks**: This subfolder contains custom hooks that are specific to the feature and are not meant to be reused globally.

**src/features/[feature-name]/utils**: This subfolder contains utility functions that are specific to the feature and are not meant to be reused globally.

**src/features/[feature-name]/actions**: This subfolder contains server actions that are specific to the feature and are not meant to be reused globally.


An example folder structure could look like this:

```
src/
├── app/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   └── Modal.tsx
│   └── Header.tsx
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   └── LoginForm.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   └── utils/
│   │       └── authHelpers.ts
|   |   ├── actions/
│   |   |   └── authActions.ts
│   └── dashboard/
│       ├── components/
│       │   └── DashboardWidget.tsx
│       ├── hooks/
│       │   └── useDashboardData.ts
│       └── utils/
│           └── dashboardHelpers.ts
└── utils/
    └── apiClient.ts
```


