# Contributing to Achievement POAP Frontend

Thank you for your interest in contributing to the Achievement POAP project! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Component Guidelines](#component-guidelines)
- [Testing](#testing)

## 📜 Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/achievementPOAP.git`
3. Navigate to frontend: `cd achievementPOAP/frontend`
4. Install dependencies: `npm install`
5. Start dev server: `npm run dev`

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- Hiro Wallet (for testing)

### Environment

Create a `.env.local` file if needed for local overrides:

```env
VITE_CONTRACT_ADDRESS=your_contract_address
VITE_NETWORK=mainnet
```

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── UI/        # Basic UI elements (Button, Card, etc.)
│   ├── Layout/    # Page layout components
│   ├── Event/     # Event-related components
│   ├── POAP/      # POAP-related components
│   └── ...
├── pages/         # Route pages
├── context/       # React contexts
├── hooks/         # Custom hooks
├── services/      # API/contract services
├── utils/         # Utility functions
├── styles/        # Global styles
└── config/        # Configuration files
```

## 📝 Coding Standards

### JavaScript/React

- Use functional components with hooks
- Prefer named exports for components
- Use destructuring for props
- Keep components small and focused
- Document complex logic with comments

### CSS

- Use CSS variables for theming
- Follow BEM-like naming: `.component-element`
- Keep styles modular (one CSS file per component)
- Use responsive design patterns

### Naming Conventions

- **Components**: PascalCase (`EventCard.jsx`)
- **Hooks**: camelCase with `use` prefix (`useContract.js`)
- **Utils**: camelCase (`helpers.js`)
- **CSS**: kebab-case (`.event-card`)
- **Constants**: SCREAMING_SNAKE_CASE

## 💬 Commit Guidelines

We follow conventional commits:

```
type(scope): description

[optional body]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting (no logic change)
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples

```
feat(events): add countdown timer to event cards
fix(wallet): resolve connection issue on mobile
docs(readme): update installation instructions
style(components): format button styles
refactor(hooks): simplify useContract logic
```

## 🔄 Pull Request Process

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Test thoroughly
4. Commit with conventional commits
5. Push to your fork
6. Open a PR against `main`

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Self-reviewed the code
- [ ] Commented complex logic
- [ ] Updated documentation if needed
- [ ] No console errors or warnings
- [ ] Tested on mobile and desktop
- [ ] Added appropriate CSS for dark theme

## 🧩 Component Guidelines

### Creating New Components

1. Create folder: `src/components/ComponentName/`
2. Add files:
   - `ComponentName.jsx` - Component logic
   - `ComponentName.css` - Styles
   - `index.js` - Exports

### Component Template

```jsx
import React from 'react';
import './ComponentName.css';

const ComponentName = ({
  prop1,
  prop2 = 'default',
  className = '',
  ...props
}) => {
  return (
    <div className={`component-name ${className}`} {...props}>
      {/* Content */}
    </div>
  );
};

export default ComponentName;
```

### CSS Template

```css
.component-name {
  /* Base styles */
}

.component-name-element {
  /* Element styles */
}

.component-name--modifier {
  /* Modifier styles */
}

@media (max-width: 768px) {
  /* Responsive styles */
}
```

## 🧪 Testing

Currently, we rely on manual testing. When testing:

1. Test wallet connection/disconnection
2. Test all user flows
3. Check responsive design
4. Verify dark theme consistency
5. Test with slow network (throttle in DevTools)
6. Test error states

## 🎨 Design System

### Colors

Use CSS variables from `src/styles/index.css`:

- `--gold`, `--gold-light`, `--gold-dark`
- `--bg-primary`, `--bg-secondary`, `--bg-card`
- `--text-primary`, `--text-secondary`, `--text-muted`
- `--success`, `--error`, `--warning`, `--info`

### Spacing

Use consistent spacing:
- Small: 0.25rem - 0.5rem
- Medium: 0.75rem - 1rem
- Large: 1.5rem - 2rem
- Extra large: 3rem - 4rem

### Border Radius

Use CSS variables:
- `--radius-sm`: 4px
- `--radius-md`: 8px
- `--radius-lg`: 12px
- `--radius-xl`: 16px
- `--radius-full`: 9999px

## ❓ Questions?

Feel free to open an issue for questions or discussions.

Thank you for contributing! 🏆
