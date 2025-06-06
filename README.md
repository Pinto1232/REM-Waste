# REM Waste Management System

A modern, accessible, and performant React application for waste management booking services.

## 🚀 Features

- **Multi-step booking form** with validation and state management
- **Real-time skip availability** with location-based search
- **Shopping cart functionality** for multiple bookings
- **Responsive design** with mobile-first approach
- **Accessibility compliant** (WCAG 2.1 AA standards)
- **Performance optimized** with code splitting and lazy loading
- **Type-safe** with TypeScript and Zod validation
- **Comprehensive testing** with Vitest and Testing Library
- **Error handling** with retry mechanisms and user-friendly messages
- **Logging system** with configurable levels
- **Performance monitoring** with Web Vitals tracking

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **State Management**: React Context, TanStack Query v5
- **Validation**: Zod schemas with runtime type checking
- **Testing**: Vitest, Testing Library, Jest DOM
- **Build Tool**: Vite
- **Code Quality**: ESLint, Prettier, Husky (pre-commit hooks)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn package manager

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd REM-Waste
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   ```env
   VITE_API_URL=https://app.wewantwaste.co.uk/api
   VITE_APP_NAME=REM Waste Management
   VITE_ENABLE_LOGGING=true
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Lint code
- `npm run type-check` - Type check without emitting
- `npm run format:all` - Format all code

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── BookingSteps/   # Multi-step form components
│   ├── CartSidebar/    # Shopping cart components
│   ├── ui/             # Base UI components
│   └── ...
├── context/            # React Context providers
├── hooks/              # Custom React hooks
├── schemas/            # Zod validation schemas
├── services/           # API services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
│   ├── accessibility.ts
│   ├── logger.ts
│   ├── performance.ts
│   └── validation.ts
└── test/               # Test utilities and setup
```

## 🧪 Testing

The project includes comprehensive testing setup:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### Test Categories

- **Unit Tests**: Individual functions and hooks
- **Component Tests**: React component behavior
- **Integration Tests**: Component interactions
- **Schema Tests**: Zod validation schemas

## 🎨 Code Quality

### ESLint Configuration
- Strict TypeScript rules
- React best practices
- Accessibility rules
- Import/export consistency

### Prettier Configuration
- Consistent code formatting
- Automatic formatting on save
- Pre-commit hooks

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | API base URL | `/api` |
| `VITE_APP_NAME` | Application name | `REM Waste Management` |
| `VITE_ENABLE_LOGGING` | Enable logging | `true` |
| `VITE_ENABLE_ANALYTICS` | Enable analytics | `false` |

### TypeScript Configuration
- Strict mode enabled
- Path mapping with `@/` alias
- Comprehensive type checking
- No unused variables/parameters

## 🚀 Performance Optimizations

- **Code Splitting**: Lazy-loaded booking steps
- **Bundle Analysis**: Automatic bundle size monitoring
- **Memory Monitoring**: Runtime memory usage tracking
- **Web Vitals**: Core Web Vitals monitoring
- **Image Optimization**: Responsive images with lazy loading
- **Caching**: Intelligent API response caching

## ♿ Accessibility Features

- **WCAG 2.1 AA Compliance**: Meets accessibility standards
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: ARIA labels and announcements
- **Focus Management**: Proper focus trapping and restoration
- **Color Contrast**: High contrast mode support
- **Reduced Motion**: Respects user motion preferences

## 🔒 Security Features

- **Input Validation**: Client-side and schema validation
- **XSS Protection**: Input sanitization
- **Rate Limiting**: API request throttling
- **Error Handling**: Secure error messages
- **Environment Variables**: Sensitive data protection

## 📊 Monitoring & Analytics

### Performance Monitoring
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)
- First Contentful Paint (FCP)
- Time to First Byte (TTFB)

### Error Tracking
- Comprehensive error boundaries
- API error categorization
- User-friendly error messages
- Automatic retry mechanisms

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Environment-Specific Builds
- Development: `npm run dev`
- Staging: `npm run build:staging`
- Production: `npm run build`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Standards
- Follow TypeScript strict mode
- Write tests for new features
- Maintain accessibility standards
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review existing issues and discussions

## 🔄 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and updates.