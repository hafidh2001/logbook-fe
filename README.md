# BOILERPLATE-REACT-TS

built with React, TypeScript, and Vite.

## Technology Stack & Specifications

### Core Technologies
- **React**: 18.2.0
- **TypeScript**: 5.3.3
- **Vite**: 5.1.0
- **Node.js**: 18.20.5+ (tested with v18.20.5)
- **npm**: 10.8.2+ (tested with v10.8.2)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create .env file from example:
```bash
cp .env.example .env
```

4. **REQUIRED**: Update the decrypt secret key in .env:
```
VITE_DECRYPT_SECRET_KEY=your_secret_key_here
```
⚠️ **Important**: The application will not work without this environment variable. Make sure it matches the secret key used by your PHP backend.

## Available Scripts

### Development
```bash
npm run dev
```
Starts the development server at `http://localhost:3000` with hot module replacement (HMR).

### Build
```bash
npm run build
```
Type-checks the code and builds the application for production to the `dist` folder.

### Preview
```bash
npm run preview
```
Locally preview the production build.

### Type Checking
```bash
npm run lint
```
Runs TypeScript compiler in no-emit mode to check for type errors.

## Usage

### Authentication
Edit mode requires encrypted data containing user credentials. The data is decrypted using AES-256-CBC encryption with the configured secret key.

## Development

See [PROJECT_STANDARDS.md](./PROJECT_STANDARDS.md) for coding standards and project structure guidelines.