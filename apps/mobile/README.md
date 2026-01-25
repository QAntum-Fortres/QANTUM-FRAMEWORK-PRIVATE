# 📱 QAntum Mobile

**Coffee Monitoring Interface** - Watch your systems while sipping espresso.

## 🚀 Quick Start

```bash
cd apps/mobile
npm install
npm start
```

## 📂 Structure

```
apps/mobile/
├── App.tsx                 # Entry point
├── src/
│   ├── api/
│   │   └── client.ts       # QAntum API Client
│   └── screens/
│       └── Dashboard.tsx   # Main Dashboard UI
└── assets/                 # Images & Icons
```

## 🎨 Features

- **Stats Grid:** LOC, Vectors, Modules, Departments
- **Health Monitor:** Real-time service status
- **Pull-to-Refresh:** Update data on demand
- **Dark Theme:** QAntum brand colors (#020205, #00f5ff, #1a1a3a)

## 🔌 API Integration

The app connects to the GhostShield SaaS backend:

```typescript
import apiClient from './src/api/client';

apiClient.setApiKey('YOUR_API_KEY');
const stats = await apiClient.getStats();
```

## 📱 Platforms

- iOS (via Expo Go)
- Android (via Expo Go)
- Web (via `npm run web`)

---

*Part of QAntum Empire v40.0*
