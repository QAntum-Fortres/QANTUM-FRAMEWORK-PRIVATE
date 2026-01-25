# GitHub Copilot Instructions for QANTUM Framework

This repository contains the QANTUM Framework - an autonomous bio-digital organism with self-healing capabilities, trading systems, and multiple integrated modules across TypeScript, Python, and Rust.

## Project Overview

**QANTUM Framework** is a multi-language, multi-component system featuring:
- **Core Framework**: TypeScript/Node.js with Temporal.io orchestration
- **Backend Services**: Python (Flask) and Rust (Actix-web)
- **Frontend Dashboard**: React 19 + Vite + TypeScript + Tailwind CSS
- **Key Features**: Self-healing systems, trading automation, payment processing, AI integration

## Technology Stack

### Primary Technologies
- **TypeScript**: 5.9.3 (CommonJS modules for Node.js, ES modules for frontend)
- **Node.js**: 18+ (ES modules in package.json)
- **React**: 19.2.0 with TypeScript
- **Python**: 3.9+
- **Rust**: 1.70+

### Key Dependencies
- **Temporal.io**: Workflow orchestration (`@temporalio/worker`, `@temporalio/client`)
- **Pinecone**: Vector database integration
- **Solana Web3.js**: Blockchain integration
- **CCXT**: Cryptocurrency trading
- **Express/Fastify**: Backend servers
- **Tailwind CSS**: Utility-first styling
- **Zod**: Schema validation

## Project Structure

```
/
├── src/                    # TypeScript core framework
│   ├── core/              # Core orchestration, evolution, monitoring
│   ├── modules/           # Feature modules (sales, hydrated, etc.)
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── scripts/               # CLI tools, automation scripts
├── Backend/               # Python services and Rust core
│   ├── *.py              # Flask services (payments, ledger)
│   └── rust_core/        # Rust economy server
├── Frontend/              # React dashboard
│   ├── src/              # React components and services
│   └── public/           # Static assets
├── tests/                 # Test suites
├── docs/                  # Documentation
└── micro-saas/           # Micro-SaaS modules (SEO audit, etc.)
```

## Build, Test, and Lint Commands

### TypeScript/Node.js Core
```bash
# Build TypeScript
npm run build

# Lint TypeScript
npm run lint
npm run lint:fix

# Run tests
npm test

# Start ecosystem
npm run ecosystem:start
npm run ecosystem:status
```

### Frontend (React)
```bash
cd Frontend
npm run dev          # Development server on port 5173
npm run build        # Production build
npm run lint         # ESLint check
npm run preview      # Preview production build
```

### Backend Services

**Python Services:**
```bash
cd Backend
python3 -m pip install -r requirements.txt
python3 OmniCore_Scribe.py              # Main backend (port 5050)
python3 stripe_webhook_handler.py        # Webhook handler (port 5051)
```

**Rust Economy Server:**
```bash
cd Backend/rust_core
cargo build --release
cargo run --release --bin lwas_economy   # Port 8890
```

## Coding Standards

### TypeScript
- **Module System**: CommonJS for Node.js backend, ES modules for frontend
- **Strict Mode**: Disabled (`strict: false` in tsconfig.json)
- **Path Aliases**: Use `@core/*`, `@modules/*`, `@scripts/*`
- **Naming**: PascalCase for classes, camelCase for functions/variables
- **Exports**: Prefer named exports over default exports
- **Error Handling**: Use try-catch blocks with descriptive error messages

### React/Frontend
- **Components**: Functional components with TypeScript
- **State Management**: Zustand for global state
- **Styling**: Tailwind CSS utility classes
- **Animations**: Framer Motion for animations
- **Icons**: Lucide React
- **Type Safety**: Props interfaces for all components

### Python
- **Version**: Python 3.9+
- **Style**: PEP 8 compliant
- **Imports**: Group stdlib, third-party, and local imports
- **Type Hints**: Use type hints where practical

### Rust
- **Edition**: 2021
- **Style**: Follow `rustfmt` defaults
- **Error Handling**: Use `Result<T, E>` pattern

## Security Guidelines

### Critical Security Practices
1. **LivenessToken Validation**: Always verify HMAC-SHA256 signatures
2. **No Secrets in Code**: Use environment variables (`.env` files)
3. **Token Expiry**: Implement 5-minute expiry for LivenessTokens
4. **Input Validation**: Validate all external inputs with Zod schemas
5. **Webhook Verification**: Verify Stripe webhook signatures

### Cryptographic Standards
```typescript
// Example: Proper LivenessToken generation
const signature = crypto
  .createHmac('sha256', TOKEN_SECRET)
  .update(payload)
  .digest('hex');
```

## Files and Directories to Avoid Modifying

**DO NOT modify these without explicit approval:**
- `.env`, `.env.production` - Environment secrets
- `node_modules/`, `dist/`, `build/` - Generated/dependency files
- `Backend/rust_core/target/` - Rust build artifacts
- `__pycache__/`, `*.pyc` - Python cache files
- `.git/` - Git internals
- `wallet_backup.dat` - Sensitive wallet data
- `*.ledger` files - Transaction ledgers
- `.github/workflows/` - CI/CD configurations (ask before changes)

**Safe to ignore:**
- `tmp/`, `temp/` - Temporary files
- `*.log` - Log files
- `coverage/` - Test coverage reports

## Git Workflow

### Commit Messages
- Use conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`
- Be descriptive: `feat: add self-healing mechanism for trading failures`
- Reference issues: `fix: resolve token expiry bug (#123)`

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates

## Key Architectural Patterns

### 1. Self-Healing System
The VortexHealingNexus orchestrates autonomous healing across domains:
- **UI Domain**: Visual healing via NeuralMapEngine
- **Network Domain**: Connectivity recovery via HydraNetwork
- **Logic Domain**: Code repair via EvolutionaryHardening
- **Database Domain**: Schema healing (future)

```typescript
// Example: Triggering healing
const healer = new VortexHealingNexus();
await healer.heal(moduleId, domain, errorContext);
```

### 2. Temporal Workflows
Use Temporal.io for long-running processes:
- Activities in `src/core/orchestration/activities.ts`
- Workflows in `src/core/orchestration/worker.ts`
- Always handle failures with retry logic

### 3. LivenessToken Architecture
Cryptographically signed tokens prove module health:
- Generation: `generateLivenessToken(moduleId, status)`
- Validation: HMAC-SHA256 signature + timestamp verification
- Registration: `registerVitality()` in ApoptosisModule

## Environment Variables

### Required Variables
```bash
# Stripe (Backend)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_SINGULARITY=price_...
STRIPE_PRICE_AETERNA=price_...
STRIPE_PRICE_VORTEX=price_...

# Rust Economy
RUST_ECONOMY_URL=http://localhost:8890

# Frontend
VITE_BACKEND_URL=http://localhost:5050
VITE_RUST_ECONOMY_URL=http://localhost:8890

# AI Services (optional)
GOOGLE_API_KEY=...
OPENAI_API_KEY=...
```

## Testing Guidelines

### Unit Tests
- Place tests in `tests/` directory
- Use descriptive test names
- Mock external dependencies
- Test edge cases and error conditions

### Integration Tests
- Test cross-component interactions
- Use real database connections for integration tests
- Clean up test data after runs

## Performance Considerations

1. **Async Operations**: Use `async/await` for I/O operations
2. **Batch Processing**: Batch database operations where possible
3. **Caching**: Use in-memory caching for frequently accessed data
4. **Resource Management**: Always close connections and clean up resources

## Documentation

- Update README.md for major changes
- Add JSDoc comments for public APIs
- Document complex algorithms inline
- Keep CHANGELOG.md updated with version changes

## Common Patterns

### Error Handling
```typescript
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  logger.error('Operation failed', { error, context });
  throw new Error(`Failed to complete operation: ${error.message}`);
}
```

### Logging
```typescript
// Use structured logging
logger.info('Operation started', { moduleId, timestamp });
logger.error('Operation failed', { error, moduleId, attemptNumber });
```

### API Response Format
```typescript
// Success
{ success: true, data: {...} }

// Error
{ success: false, error: 'Error message', code: 'ERROR_CODE' }
```

## Dependencies and Package Management

- **Node.js**: Use `npm` (not `yarn` or `pnpm`)
- **Python**: Use `pip` with `requirements.txt`
- **Rust**: Use `cargo` with `Cargo.toml`
- Always lock dependency versions in production
- Check for security vulnerabilities before adding new packages

## Useful Scripts

```bash
# Ecosystem management
npm run ecosystem:start    # Start all services
npm run ecosystem:status   # Check service health
npm run ecosystem:list     # List available modules

# Vortex operations
npm run vortex:evolve      # Run evolution cycle
npm run vortex:chaos       # Test healing system
npm run vortex:telemetry   # Start metrics server

# Development
npm run know-thyself       # System introspection
npm run audit              # Security audit
npm run loc:count          # Count lines of code
```

## Additional Resources

- [QUICKSTART.md](../QUICKSTART.md) - Quick start guide
- [WEALTH_BRIDGE_README.md](../WEALTH_BRIDGE_README.md) - Payment integration
- [FULL_DOCUMENTATION.md](../FULL_DOCUMENTATION.md) - Complete documentation
- [VERITAS_MANUAL.md](../VERITAS_MANUAL.md) - Veritas system manual

## Contact and Support

For questions about this codebase, refer to the documentation or contact the development team through repository issues.

---

**Remember**: This is a complex, multi-component system. Always test changes locally before committing, and ensure your modifications don't break existing functionality.
