# JulesBridge Neural Nexus

**Live Sovereign Monitor API Server - Port 7777**

## Overview

JulesBridge transforms the static dashboard mockup into a **Live Sovereign Monitor** by providing real-time telemetry, system statistics, and WebSocket-based log streaming.

## Features

### ✅ Phase 1: Neural Link (Connectivity)
- **WebSocket Server** on port 7777
- **Health Check**: `GET /api/health` - Server ping/status
- **Live Status Indicator**: Dashboard shows GREEN when online, RED when offline
- **Auto-reconnect**: Retries connection every 3 seconds if disconnected

### ✅ Phase 2: Entropy Visualization (Data Stream)
- **Telemetry Endpoint**: `GET /api/telemetry`
- **Real-time Updates**: Dashboard polls every 2 seconds
- **Entropy Monitoring**: Returns current entropy and stability metrics
- **Critical Alert**: Red flashing indicator when entropy > 0.01
- **Data Points**:
  ```json
  {
    "status": "ONLINE",
    "entropy": 0.0042,
    "stability": 0.9958,
    "timestamp": 1770074496612,
    "uptime": 14.085,
    "memoryUsage": { ... }
  }
  ```

### ✅ Phase 3: Reality Anchor (File System Sync)
- **Stats Endpoint**: `GET /api/stats`
- **Real File Scanning**: Recursively scans project directory
- **Accurate Metrics**: 
  - Project Files: Real count (not placeholders)
  - Lines of Code: Actual LOC from source files
  - Supports: `.ts`, `.js`, `.tsx`, `.jsx`, `.py`, `.java`, `.go`, `.rs`, `.c`, `.cpp`, `.h`, `.cs`, `.php`, `.rb`, `.swift`, `.kt`
- **Dashboard Cards**: Two new stat cards show real-time file/LOC data

### ✅ Phase 4: Orchestrator Logs (WebSocket Streaming)
- **Live Log Stream**: Server broadcasts logs via WebSocket
- **Log Types**: `info`, `success`, `warning`, `error`
- **Color Coded**: Logs display with appropriate colors in UI
- **Real-time Updates**: Logs appear instantly in the Singularity Audit Log
- **Buffer Management**: Keeps last 100 log entries

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Server health check |
| `/api/telemetry` | GET | Current entropy, stability, uptime, memory |
| `/api/stats` | GET | File system statistics (files, LOC) |
| `/api/logs` | GET | Recent log entries (query: `?limit=50`) |

## WebSocket Events

| Event Type | Description |
|------------|-------------|
| `connected` | Initial connection established |
| `telemetry` | Entropy/stability update (every 2s) |
| `log` | New log entry |
| `logs` | Batch of historical logs |
| `heartbeat` | Keep-alive ping (every 5s) |

## Installation & Usage

### Start JulesBridge Server

```bash
# Install dependencies (if not already installed)
npm install

# Start the server
npm run jules
# or
npm run jules:bridge
# or directly
npx tsx JulesBridge.ts
```

Server will start on **http://localhost:7777**

### Access Dashboard

1. Serve the dashboard:
   ```bash
   python3 -m http.server 8080
   ```

2. Open browser: **http://localhost:8080/dashboard.html**

3. Dashboard will automatically:
   - Connect to JulesBridge on port 7777
   - Start streaming telemetry every 2 seconds
   - Fetch file stats initially and every 30 seconds
   - Display live logs from the server

## Visual Indicators

### Connection Status
- 🟢 **GREEN**: JulesBridge online and connected
- 🔴 **RED**: Offline, retrying connection

### Entropy Warning
- **Normal**: Green indicator, entropy < 0.01
- **CRITICAL**: Red flashing indicator, entropy ≥ 0.01
  - Triggers alert in logs
  - Visual flash animation on status indicator

## File Structure

```
JulesBridge.ts          # Main server file (port 7777)
dashboard.html          # Live dashboard UI
package.json            # npm scripts: 'jules' and 'jules:bridge'
```

## Architecture

```
┌─────────────────┐         WebSocket (7777)        ┌──────────────┐
│                 │ ◄─────────────────────────────► │              │
│  Dashboard UI   │                                 │ JulesBridge  │
│  (Browser)      │         HTTP/REST API           │   Server     │
│                 │ ◄─────────────────────────────► │              │
└─────────────────┘                                 └──────────────┘
     │                                                      │
     │  Real-time Updates:                                 │
     │  • Entropy (2s interval)                            │
     │  • Stats (30s interval)                             │
     │  • Logs (WebSocket push)                            │
     │                                                      │
     │                                                      ▼
     │                                              File System Scan
     │                                              (Project directory)
     │
     ▼
  Visual Updates:
  • Connection status
  • Entropy warning
  • File/LOC metrics
  • Live log stream
```

## Development Notes

- **ES Module**: Uses `import.meta.url` for `__dirname` compatibility
- **TypeScript**: Written in TypeScript, run with `tsx`
- **Dependencies**: Express, cors, ws (WebSocket)
- **Auto-retry**: WebSocket reconnection every 3s on disconnect
- **Entropy Simulation**: Server generates realistic entropy fluctuations for demo

## Troubleshooting

### Server won't start
```bash
# Check if port 7777 is in use
lsof -i :7777

# Kill any process using the port
kill -9 <PID>
```

### Dashboard shows "OFFLINE"
1. Ensure JulesBridge server is running: `npm run jules`
2. Check browser console for WebSocket errors
3. Verify server is accessible: `curl http://localhost:7777/api/health`

### Stats not updating
1. Check server logs for scanning errors
2. Verify project directory path in `CONFIG.projectRoot`
3. Ensure file permissions allow reading

## Future Enhancements

- [ ] Historical entropy charts/graphs
- [ ] Configurable scan paths
- [ ] Custom log filters in UI
- [ ] Alert thresholds configuration
- [ ] Export stats/logs to file

---

**Status**: ✅ All phases complete (1-4)
**Version**: 1.0
**Port**: 7777
**Protocol**: HTTP/WebSocket
