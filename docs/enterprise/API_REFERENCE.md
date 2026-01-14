# QAntum Vortex Enterprise - API Reference

## Core APIs

### VortexNexus

The unified entry point for all Vortex components.

#### Constructor

```typescript
import { getVortexNexus, VortexNexusConfig } from './QANTUM_VORTEX_CORE/vortex-nexus';

const config: Partial<VortexNexusConfig> = {
  projectRoot: string;       // Project root directory
  enableHUD: boolean;        // Enable Neural HUD (default: true)
  hudPort: number;           // HUD WebSocket port (default: 3847)
  autoAssimilate: boolean;   // Auto-assimilate on init (default: true)
  enableMeditation: boolean; // Enable meditation audit (default: true)
  enableHiveMind: boolean;   // Enable hive mind (default: true)
};

const nexus = getVortexNexus(config);
```

#### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `initialize()` | `Promise<void>` | Initialize all components |
| `verify(symbolName: string)` | `boolean` | Verify symbol exists in codebase |
| `getContext(query: string, maxTokens?: number)` | `string` | Get relevant context for AI |
| `refresh()` | `Promise<void>` | Re-assimilate codebase |
| `meditate()` | `Promise<MeditationResult>` | Run system health audit |
| `awakenHiveMind()` | `Promise<HiveMindResult>` | Activate hive mind |
| `getStatus()` | `VortexStatus` | Get current system status |
| `shutdown()` | `Promise<void>` | Gracefully shutdown |

#### Example

```typescript
const nexus = getVortexNexus({ projectRoot: './my-project' });
await nexus.initialize();

// Verify a class method exists
if (nexus.verify('UserService.authenticate')) {
  console.log('Method exists!');
}

// Get context for AI
const context = nexus.getContext('authentication flow', 5000);

// Run audit
const health = await nexus.meditate();
console.log(`Health: ${health.overallScore}%`);
```

---

### Assimilator

Anti-hallucination engine that verifies AI outputs.

#### Usage

```typescript
import { getAssimilator, Assimilator } from './src/core/assimilator';

const assimilator = getAssimilator({
  targetFolder: './src',
  excludePatterns: ['node_modules', 'dist']
});

await assimilator.assimilate();
```

#### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `assimilate()` | `Promise<AssimilationResult>` | Scan and index codebase |
| `verify(symbolName: string)` | `VerificationResult` | Verify symbol exists |
| `getRelevantContext(query: string, maxTokens: number)` | `string` | Get context for query |
| `getRegistry()` | `SymbolRegistry` | Get all registered symbols |
| `getLastResult()` | `AssimilationResult` | Get last assimilation result |

#### VerificationResult

```typescript
interface VerificationResult {
  valid: boolean;
  location?: string;
  line?: number;
  type?: 'class' | 'function' | 'interface' | 'type';
  suggestions?: string[];
}
```

---

### NeuralHUD

Real-time AI thought visualization dashboard.

#### Usage

```typescript
import { NeuralHUD, BrainWave } from './src/core/neural-hud';

const hud = new NeuralHUD({ port: 3847 });
await hud.start();
```

#### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `start()` | `Promise<void>` | Start HTTP/WebSocket server |
| `stop()` | `Promise<void>` | Stop server |
| `emitWave(wave: BrainWave)` | `void` | Emit brain wave event |

#### BrainWave Types

```typescript
type BrainWaveType = 
  | 'perception'      // Input processing
  | 'reasoning'       // AI thinking
  | 'decision'        // Decision made
  | 'action'          // Action taken
  | 'memory_recall'   // Memory retrieved
  | 'memory_store'    // Memory stored
  | 'error';          // Error occurred

interface BrainWave {
  type: BrainWaveType;
  source: 'gemini' | 'ollama' | 'system' | 'user';
  content: {
    summary: string;
    details: Record<string, any>;
  };
  confidence: number;  // 0-1
  duration: number;    // ms
  relatedWaves: string[];
}
```

---

### GeminiBrain

Advanced AI reasoning with Google's Gemini API.

#### Usage

```javascript
const { GeminiBrain } = require('./src/core/brain/GeminiBrain');

const brain = new GeminiBrain({
  apiKey: process.env.GEMINI_API_KEY,
  model: 'gemini-pro',
  maxTokens: 8000
});

await brain.initialize();
```

#### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `initialize()` | `Promise<void>` | Initialize Gemini client |
| `think(options)` | `Promise<ThinkResult>` | Process a thinking request |
| `chat(messages)` | `Promise<ChatResult>` | Multi-turn conversation |
| `embed(text)` | `Promise<number[]>` | Generate embedding |

#### ThinkOptions

```typescript
interface ThinkOptions {
  prompt: string;
  context?: string;
  temperature?: number;      // 0-1, default 0.7
  maxOutputTokens?: number;
  stopSequences?: string[];
}
```

---

### EnterpriseDiscovery

Enterprise-level discovery engine with stealth capabilities.

#### Usage

```typescript
import { EnterpriseDiscovery } from './src/modules/GAMMA_INFRA/core/ears/strength/EnterpriseDiscovery';

const discovery = new EnterpriseDiscovery({
  defaultStealthLevel: 'ghost',
  enableGhostProtocol: true,
  defaultMaxDepth: 5,
  defaultMaxPages: 1000
});

const job = await discovery.startDiscovery('https://target.com', {
  mode: 'deep',
  analyzeTechnologies: true
});
```

#### Stealth Levels

| Level | Description |
|-------|-------------|
| `normal` | Standard operation, visible |
| `sneaky` | Reduced fingerprint |
| `ghost` | Full anonymization |
| `paranoid` | Maximum stealth, slowest |

---

## WebSocket Events

### Neural HUD Events

Connect to `ws://localhost:3847` to receive real-time events.

#### Message Types

```typescript
// Incoming messages
interface IncomingMessage {
  type: 'subscribe' | 'unsubscribe' | 'ping';
  channel?: string;
}

// Outgoing events
interface BrainWaveEvent {
  event: 'brainwave';
  data: BrainWave;
  timestamp: string;
}

interface TelemetryEvent {
  event: 'telemetry';
  data: TelemetrySnapshot;
  timestamp: string;
}

interface StatusEvent {
  event: 'status';
  data: VortexStatus;
  timestamp: string;
}
```

---

## HTTP Endpoints

### Neural HUD REST API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `GET /` | GET | Dashboard HTML |
| `GET /api/status` | GET | System status |
| `GET /api/waves` | GET | Recent brain waves |
| `GET /api/telemetry` | GET | Hardware telemetry |
| `POST /api/waves` | POST | Emit brain wave |

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Google Gemini API key |
| `PINECONE_API_KEY` | Yes* | Pinecone API key |
| `PINECONE_INDEX` | Yes* | Pinecone index name |
| `OLLAMA_HOST` | No | Ollama server URL (default: <http://localhost:11434>) |
| `VORTEX_HUD_PORT` | No | Neural HUD port (default: 3847) |
| `VORTEX_LOG_LEVEL` | No | Log level: debug, info, warn, error |

*Required for vector memory features

---

## Error Codes

| Code | Description |
|------|-------------|
| `VORTEX_INIT_FAILED` | Initialization failed |
| `VORTEX_ASSIMILATION_FAILED` | Codebase assimilation failed |
| `VORTEX_VERIFICATION_FAILED` | Symbol verification failed |
| `VORTEX_AI_ERROR` | AI inference error |
| `VORTEX_HUD_ERROR` | Neural HUD error |
| `VORTEX_MEMORY_ERROR` | Vector memory error |

---

© 2025-2026 Dimitar Prodromov. All Rights Reserved.
