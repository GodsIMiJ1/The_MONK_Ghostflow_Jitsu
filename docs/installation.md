# Installation Guide

This guide will help you set up THE MONK on your local machine.

## Prerequisites

Before installing THE MONK, ensure you have the following installed:

- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- Git

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/The_MONK.git
cd The_MONK
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
NEXT_PUBLIC_APP_NAME="THE MONK"
NEXT_PUBLIC_APP_VERSION="1.0.0"
LM_STUDIO_API_KEY=your_api_key_here
```

### 4. Development Mode

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 5. Production Build

To create a production build:

```bash
npm run build
npm start
```

## Configuration Options

### AI Integration

To enable AI features, you need to:

1. Sign up for an LMStudio account
2. Get your API key
3. Add it to your `.env` file

### Customization

You can customize THE MONK by modifying:

- `src/app/monk-theme.css` - Theme colors and styles
- `src/components/ui/` - UI components
- `src/lib/config.ts` - Application configuration

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Find the process using port 3000
   lsof -i :3000
   # Kill the process
   kill -9 <PID>
   ```

2. **Dependency Installation Failed**
   ```bash
   # Clear npm cache
   npm cache clean --force
   # Remove node_modules
   rm -rf node_modules
   # Reinstall dependencies
   npm install
   ```

3. **Environment Variables Not Loading**
   - Ensure `.env` file is in the root directory
   - Check for typos in variable names
   - Restart the development server

### Getting Help

If you encounter issues not covered here:

1. Check the [GitHub Issues](https://github.com/yourusername/The_MONK/issues)
2. Join our [Discussions](https://github.com/yourusername/The_MONK/discussions)
3. Create a new issue with detailed information about your problem

## Next Steps

After installation, you might want to:

1. Read the [Quick Start Guide](quickstart.md)
2. Explore the [User Manual](user_manual.md)
3. Learn about [AI Features](ai_features.md) 