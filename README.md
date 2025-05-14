# AI-Powered Test Automation Platform

A modern web application for generating and managing automated browser tests using AI, with zero manual coding required.

![Test Automation Platform](https://via.placeholder.com/1200x600?text=Test+Automation+Platform)

## 🚀 Features

### 🧩 Input & UI Understanding

- Upload Figma frames or screenshots
- AI-powered UI detection and component classification
- Smart selector generation
- Flow visualization and editing

### 🧠 Test Case Generation

- AI-generated test cases for various flows
- Support for multiple test types (positive, negative, edge cases)
- Mapping between elements and actions
- Inline validation checks
- Scenario variations
- Export to Playwright/Puppeteer

### 📊 Test Data Generation

- Auto-generate dummy data
- Define schema per screen
- Reusable dataset manager
- Manual override options

### 🧪 Test Runner (Browser Automation)

- Playwright-based test execution
- Headless or visible browser mode
- Automatic element handling
- Wait and sync logic
- Parallel and batch testing
- CLI + UI runner support

### 🧭 Outcome Detection & Assertion

- Smart outcome handling after interaction
- URL change detection
- Toast/success detection
- Error/message detection
- Modal/popup detection
- AI-based change analysis

### 📈 Reporting & Logs

- HTML test report with results
- Screenshots and video recording
- Step-by-step logs
- Diff view (optional)

## 🛠️ Technologies

- ⚡️ [React 19](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- 🎨 [Tailwind CSS](https://tailwindcss.com/) for styling
- 🧩 [Shadcn UI](https://ui.shadcn.com/) for UI components
- 📦 [Vite](https://vitejs.dev/) for fast development and building
- 🏪 [Zustand](https://zustand-demo.pmnd.rs/) for state management
- 🌐 [React Router](https://reactrouter.com/) for routing
- 🔄 [Axios](https://axios-http.com/) for HTTP requests
- 🤖 [Playwright](https://playwright.dev/) for browser automation
- 🔍 [ESLint](https://eslint.org/) for code linting
- 💅 [Prettier](https://prettier.io/) for code formatting
- 🐶 [Husky](https://typicode.github.io/husky/) for Git hooks
- 📋 [Commitlint](https://commitlint.js.org/) for conventional commits

## � Prerequisites

- Node.js (v18 or higher)
- Bun (latest version)

## 📦 Installation

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/automation-test-generator.git
   cd automation-test-generator
   ```

2. Install dependencies

   ```bash
   bun install
   ```

3. Start the development server
   ```bash
   bun dev
   ```

## 🚀 Usage

### Creating a Project

1. Navigate to the Projects page
2. Click "Create New Project"
3. Fill in the project details
4. Click "Create Project"

### Adding Features

1. Open a project
2. Click "Add Feature" or "Generate with AI"
3. Fill in the feature details or provide an AI prompt
4. Click "Create Feature" or "Generate Feature"

### Creating Test Cases

1. Open a feature
2. Click "Add Test Case" or "Generate with AI"
3. Fill in the test case details or provide an AI prompt
4. Click "Create Test Case" or "Generate Test Case"

### Adding Test Steps

1. Open a test case
2. Click "Add Step"
3. Select an action type (navigate, click, fill, assert, etc.)
4. Provide the selector and any required values
5. Click "Add Step"

### Running Tests

1. Open a test case or feature
2. Click "Run Tests"
3. View the test execution in real-time
4. Check the test report after completion

## 📁 Project Structure

```
src/
├── assets/           # Static assets (images, fonts, icons)
├── components/       # Reusable UI components
│   ├── ui/           # Base UI components (Button, Input, etc.)
│   ├── AITestGeneratorForm/  # AI test generation form
│   ├── TestCaseForm/  # Test case creation/editing form
│   ├── TestStepForm/  # Test step creation/editing form
│   └── ...
├── configs/          # Configuration files
├── constants/        # Application constants
├── hooks/            # Custom React hooks
├── layouts/          # Layout components
├── pages/            # Page components
├── providers/        # React context providers
├── router/           # Routing configuration
├── services/         # Browser services
├── store/            # State management with Zustand
├── styles/           # Global styles
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
└── views/            # View components
```

## 🔧 Configuration

### Environment Variables

Create `.env` files for different environments:

```
VITE_ENV=development
VITE_API_URL=your_api_url
```

### TypeScript

The project includes two TypeScript configurations:

- `tsconfig.app.json` - Application configuration
- `tsconfig.node.json` - Node.js configuration

### ESLint & Prettier

- ESLint is configured with TypeScript and React rules
- Prettier is set up with custom formatting rules
- Pre-commit hooks ensure code quality

## 🌍 Internationalization (i18n)

This project uses [i18next](https://www.i18next.com/) with [react-i18next](https://react.i18next.com/) for internationalization support. The translations are stored in JSON files located in the `src/i18n/translations` directory.

### Adding a New Language

1. Create a new JSON file in the `src/i18n/translations` directory with the language code as the filename (e.g., `fr.json` for French).

2. Add your translations in the new JSON file. For example:

   ```json
   {
   	"translation": {
   		"welcome": "Bienvenue à React, tailwindcss et plus"
   	}
   }
   ```

### Switching Languages

The `SwitchLanguage` component allows users to switch between available languages. It uses the `useTranslation` hook from `react-i18next` to change the language dynamically.

Example usage in a component:

```typescript:src/views/HomeView/HomeView.tsx
import {useTranslation} from 'react-i18next'
import SwitchLanguage from '@/components/SwitchLanguage/SwitchLanguage'

const HomeView = () => {
  const {t} = useTranslation()
  return (
    <div>
      <p>{t('welcome')}</p>
      <SwitchLanguage />
    </div>
  )
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes using conventional commits
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
