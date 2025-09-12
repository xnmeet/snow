# 🌨️ Snow - AI-Powered Browser Extension

[中文版本](README_CN.md) | [English Version](README_EN.md)

Snow is a sophisticated browser extension that brings AI-powered chat and automation capabilities directly to your browser. Built with modern web technologies, it provides seamless AI model configuration and intelligent test automation.

## ✨ Features

- **🤖 Multi-Model AI Support**: Configure and switch between different AI providers (OpenAI, Claude, etc.)
- **🧪 Intelligent Test Automation**: Generate and execute automated tests using AI
- **📱 Responsive Design**: Optimized for browser extension with 375px+ minimum width
- **⚡ Real-time Updates**: Live status updates for test execution
- **🎯 In-place Rerun**: Re-execute failed test steps without creating new messages
- **💾 Session Management**: Save and restore chat sessions
- **🔍 Vision Model Support**: Advanced image analysis capabilities
- **🧠 Reasoning Display**: Real-time AI reasoning process visualization
- **🌐 Cross-Browser Compatibility**: Works on Chrome, Firefox, Edge

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
- **ModelCard**: Reusable component for displaying model configurations
- **ModelFormDialog**: Dedicated form for adding/editing AI models
- **TestStepItem**: Interactive test step display with rerun functionality
- **AutomationAgent**: Test execution engine with AI capabilities
- **PromptManager**: Intelligent prompt generation and management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm package manager
- Modern browser (Chrome, Firefox, Edge)

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
- **Model Configuration**: Add, edit, delete AI models with full validation
- **Responsive Design**: Works from 375px width (browser extension constraint)
- **Shadcn UI**: Consistent design system throughout
- **Form Validation**: Comprehensive input validation with user feedback

### Chat Interface
- **Real-time Streaming**: Live AI response streaming
- **Message Types**: User messages, assistant responses, test execution status
- **Progress Indicators**: Visual feedback for generation and execution
- **Error Handling**: Detailed error messages with retry options

### Test Execution Panel
- **Real-time Status**: Shows step-by-step execution progress
- **Step Visualization**: Color-coded status (pending, running, success, failed)
- **Rerun Capability**: Individual step retry without full test rerun
- **Execution Details**: Timing, results, and error information

## 🔧 Configuration

### AI Model Types
- **Language Models**: Text-based AI (GPT-4, Claude, etc.) for text generation
- **Vision Models**: Image-capable AI (GPT-4V, etc.) for visual analysis

### Model Configuration Fields
- **Basic Info**: Name, description, model identifier
- **API Configuration**: API key, base URL, model name
- **Advanced Options**: Deep thinking mode, reasoning display
- **Default Settings**: Mark as default for each model type

## 🧪 Test Automation

### AI-Powered Testing
- **Natural Language to Code**: Convert test descriptions to executable code
- **Multi-Step Automation**: Complex test scenario execution
- **Smart API Integration**: Fallback to smart API when custom models not configured
- **Real-time Execution**: Live progress updates during test runs

### Test Step Types
- **AI Actions**: Automated planning and execution
- **Interaction Actions**: Click, input, hover operations
- **Validation Actions**: Assertions, waiting conditions
- **Data Operations**: Query, extract, transform data
- **Advanced Operations**: Screenshots, JavaScript execution, YAML scripts

### Execution Lifecycle
```
User Input → AI Analysis → Test Generation → Step Execution → Results
```

## 📦 Build & Distribution

### Extension Build Process
1. **Development**: `pnpm dev` - Hot reload development with live updates
2. **Production**: `pnpm build:extension` - Optimized, minified build
3. **Testing**: `pnpm test` - Comprehensive test suite
4. **Linting**: `pnpm lint` - Code quality enforcement

### Browser Compatibility
- **Chrome**: Full support (Manifest V3)
- **Firefox**: Full support with WebExtensions API
- **Edge**: Full support (Chromium-based)
- **Safari**: Limited support (requires additional configuration)

## 🛠️ Development Guidelines

### Technology Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build Tools**: Vite, esbuild, pnpm workspaces
- **Testing**: Jest, Testing Library
- **Code Quality**: ESLint, Prettier, TypeScript strict mode

### Code Architecture
- **Monorepo Structure**: Clean separation between core and extension
- **Type Safety**: Full TypeScript coverage with strict typing
- **Component Reusability**: Shared components across features
- **State Management**: React hooks with proper separation of concerns

### Component Patterns
- **Reusable Components**: FormField, FormCheckbox for consistent forms
- **Custom Hooks**: useChat, useAIConfig for state management
- **Error Boundaries**: Graceful error handling throughout UI
- **Loading States**: Proper loading indicators for all async operations

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork** the repository
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** with proper testing
4. **Run tests**: `pnpm test` and `pnpm lint`
5. **Commit changes**: Use conventional commit messages
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request** with detailed description

### Development Standards
- **Code Style**: Follow existing patterns and ESLint rules
- **Testing**: Include tests for new features
- **Documentation**: Update README and code comments
- **Performance**: Consider bundle size and execution efficiency

## 📄 License

### MIT License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for complete details.

**Permissions:**
- ✅ Commercial use
- ✅ Distribution
- ✅ Modification
- ✅ Private use
- ✅ Patent use

**Limitations:**
- ❌ Liability
- ❌ Warranty

**Conditions:**
- © Must include copyright notice
- 📄 Must include license copy

### Third-Party Licenses
This project uses several open-source packages. For complete license information of dependencies, run:
```bash
pnpm licenses list
```

## 🤝 Contributing

We welcome contributions from the community! Please read these guidelines before submitting your pull request.

### Development Workflow

1. **Fork the repository** and create your feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Set up development environment**
   ```bash
   pnpm install
   pnpm dev
   ```

3. **Make your changes** following our coding standards
   - Follow TypeScript best practices
   - Use descriptive variable and function names
   - Add appropriate comments for complex logic
   - Ensure all code is properly typed

4. **Write tests** for your changes
   ```bash
   pnpm test
   pnpm test:watch
   ```

5. **Ensure code quality**
   ```bash
   pnpm lint
   pnpm format
   ```

6. **Commit your changes** using conventional commit messages
   ```bash
   git commit -m "feat: add new AI model configuration"
   git commit -m "fix: resolve test execution timing issue"
   git commit -m "docs: update API documentation"
   ```

7. **Push to your fork** and open a Pull Request
   ```bash
   git push origin feature/amazing-feature
   ```

### Pull Request Guidelines

- **Description**: Clearly describe the changes and motivation
- **Testing**: Include test cases and ensure all tests pass
- **Documentation**: Update README and code comments as needed
- **Screenshots**: Include UI screenshots for visual changes
- **Backward Compatibility**: Ensure changes don't break existing functionality

### Code Review Process

1. **Initial Review**: Maintainers will review within 48 hours
2. **Feedback**: Address all review comments and suggestions
3. **Approval**: At least one maintainer approval required
4. **Merge**: Squash and merge with descriptive commit message

### Issue Reporting

When reporting issues, please include:
- Browser version and extension version
- Detailed reproduction steps
- Expected vs actual behavior
- Screenshots or screen recordings
- Console error messages

## 🆘 Support

### Community Support
- **GitHub Issues**: [Report bugs and request features](https://github.com/your-repo/issues)
- **Discord Community**: [Join our community](https://discord.gg/your-server) for real-time help
- **Documentation**: [Comprehensive guides](https://github.com/your-repo/docs)

### Enterprise Support
For commercial support and custom development:
- Email: support@your-company.com
- Website: https://your-company.com/support

## 🔗 Resources

- **📚 Documentation**: [Complete API reference](https://github.com/your-repo/docs)
- **🔄 Changelog**: [Release notes](https://github.com/your-repo/releases)
- **🐛 Issue Tracker**: [Known issues](https://github.com/your-repo/issues)
- **💬 Community Forum**: [Discussions](https://github.com/your-repo/discussions)
- **🎥 Video Tutorials**: [YouTube channel](https://youtube.com/your-channel)

### Development Resources
- **API Reference**: [REST API documentation](https://github.com/your-repo/docs/api)
- **Component Library**: [UI components](https://github.com/your-repo/docs/components)
- **Testing Guide**: [Test automation](https://github.com/your-repo/docs/testing)
- **Deployment Guide**: [Production deployment](https://github.com/your-repo/docs/deployment)

---

**Snow** - Making AI-powered automation accessible in every browser. 🚀
