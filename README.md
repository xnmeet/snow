# 🌨️ Snow - AI-Powered Browser Extension

Snow is a sophisticated browser extension that brings AI-powered chat and automation capabilities directly to your browser. Built with modern web technologies, it provides seamless AI model configuration and intelligent test automation.

## ✨ Features

- **🤖 Multi-Model AI Support**: Configure and switch between different AI providers (OpenAI, Claude, etc.)
- **🧪 Intelligent Test Automation**: Generate and execute automated tests using AI
- **📱 Responsive Design**: Optimized for browser extension with 375px+ minimum width
- **⚡ Real-time Updates**: Live status updates for test execution
- **🎯 In-place Rerun**: Re-execute failed test steps without creating new messages
- **💾 Session Management**: Save and restore chat sessions

## 🏗️ Architecture

```
snow/
├── packages/
│   ├── core/           # Shared utilities and AI configuration management
│   └── extension/      # Browser extension with React-based UI
├── pnpm-workspace.yaml # Monorepo configuration
└── README.md
```

### Core Components

- **AIConfigManager**: Central service for managing AI model configurations
- **ModelCard**: Reusable component for displaying model configurations (4 props)
- **ModelFormDialog**: Dedicated form for adding/editing AI models
- **TestStepItem**: Interactive test step display with rerun functionality

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd snow

# Install dependencies
pnpm install

# Start development
pnpm dev

# Build extension
pnpm build:extension
```

### Development Commands

```bash
# Development
pnpm dev                    # Start all packages in dev mode
pnpm build                  # Build all packages
pnpm build:extension        # Build extension specifically

# Quality Assurance
pnpm lint                   # Run ESLint
pnpm format                 # Format with Prettier
pnpm test                   # Run tests
pnpm test:watch             # Watch mode testing

# Package-specific
cd packages/extension
pnpm dev                    # Extension dev server
pnpm build                  # Extension build
```

## 🎨 UI Components

### Settings Panel
- **Model Configuration**: Add, edit, delete AI models
- **Responsive Design**: Works from 375px width (browser extension constraint)
- **Shadcn UI**: Consistent design system throughout

### Test Execution
- **Real-time Status**: Shows step-by-step execution progress
- **Error Handling**: Detailed error messages with retry capability
- **Visual Feedback**: Color-coded status indicators

### Component Structure
```typescript
// ModelCard - Display model info
interface ModelCardProps {
  config: AIConfig;
  onSetDefault: (config: AIConfig) => void;
  onEdit: (config: AIConfig) => void;
  onDelete: (config: AIConfig) => void;
}

// ModelFormDialog - Add/edit models
interface ModelFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingConfig: AIConfig | null;
  onSubmit: (data: ModelFormData) => Promise<void>;
}
```

## 🔧 Configuration

### AI Model Types
- **Language Models**: Text-based AI (GPT-4, Claude, etc.)
- **Vision Models**: Image-capable AI (GPT-4V, etc.)

### Model Configuration Fields
- Name, API Key, Base URL, Model ID
- Description (optional)
- Default model flag
- Deep thinking mode
- Reasoning display toggle

## 🧪 Testing

### Test Automation Features
- **Step Generation**: AI generates test steps from natural language
- **Step Execution**: Real-time execution with status updates
- **Rerun Capability**: Re-execute failed steps in place
- **Error Recovery**: Detailed error handling and retry mechanisms

### Test Step Lifecycle
```
pending → running → success/failed
```

## 📦 Build & Distribution

### Extension Build Process
1. **Development**: `pnpm dev` - Hot reload development
2. **Production**: `pnpm build:extension` - Optimized build
3. **Package**: Generates installable extension files

### Browser Compatibility
- Chrome (Manifest V3)
- Firefox
- Edge
- Safari (with limitations)

## 🛠️ Development Guidelines

### Code Style
- **TypeScript**: Full type safety throughout
- **ESLint**: Enforced coding standards
- **Prettier**: Consistent code formatting
- **Shadcn/ui**: Design system consistency

### Component Patterns
- **Reusable Components**: FormField, FormCheckbox for DRY code
- **State Management**: React hooks with local state
- **Responsive Design**: Mobile-first approach
- **Accessibility**: Keyboard navigation and screen reader support

### File Structure
```
packages/extension/src/
├── side-panel/
│   ├── components/
│   │   ├── Settings.tsx
│   │   ├── ModelCard.tsx
│   │   ├── ModelFormDialog.tsx
│   │   ├── TestStepItem.tsx
│   │   └── CodeDisplay.tsx
│   └── features/
│       └── chat-panel/
│           └── index.tsx
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `pnpm test`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For issues and questions:
- Check existing [GitHub Issues](https://github.com/your-repo/issues)
- Create a new issue with detailed reproduction steps
- Join our [Discord community](https://discord.gg/your-server)