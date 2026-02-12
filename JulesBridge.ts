/**
 * JULES BRIDGE SERVER v1.0
 * Neural Nexus API Server on Port 7777
 * Provides telemetry, stats, and real-time monitoring for the Dashboard
 */

import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ES Module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Configuration constants
const SUPPORTED_EXTENSIONS = [
  '.ts', '.js', '.tsx', '.jsx', '.py', '.java', '.go', '.rs', 
  '.c', '.cpp', '.h', '.cs', '.php', '.rb', '.swift', '.kt'
];

const ENTROPY_CONFIG = {
  baseValue: 0.005,
  oscillationPeriod: 10000, // ms
  variationAmplitude: 0.005,
  randomNoiseAmplitude: 0.002,
  minValue: 0.001,
  maxValue: 0.015
};

const CONFIG = {
  port: 7777,
  projectRoot: __dirname,
  saasFrameworkPath: path.resolve(__dirname, 'SaaS-Framework'),
};

// System state
let systemState = {
  status: 'ONLINE',
  entropy: 0.0042,
  stability: 0.9958,
  lastUpdate: Date.now(),
};

// Logs buffer
const logsBuffer: Array<{timestamp: number, message: string, level: string}> = [];
const MAX_LOGS = 100;

// Middleware
app.use(cors());
app.use(express.json());

// Broadcast to all WebSocket clients
const broadcast = (type: string, data: any) => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type, data, timestamp: Date.now() }));
    }
  });
};

// Add log with broadcasting
function addLog(message: string, level: string = 'info') {
  const logEntry = {
    timestamp: Date.now(),
    message,
    level
  };
  logsBuffer.push(logEntry);
  if (logsBuffer.length > MAX_LOGS) {
    logsBuffer.shift();
  }
  broadcast('log', logEntry);
}

// Count files and lines of code recursively
function countFilesAndLOC(dir: string): { files: number; loc: number } {
  let files = 0;
  let loc = 0;

  try {
    if (!fs.existsSync(dir)) {
      return { files, loc };
    }

    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      
      // Skip node_modules, .git, dist, build, etc.
      if (item === 'node_modules' || item === '.git' || item === 'dist' || 
          item === 'build' || item === '.next' || item.startsWith('.')) {
        continue;
      }

      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        const subResult = countFilesAndLOC(fullPath);
        files += subResult.files;
        loc += subResult.loc;
      } else if (stat.isFile()) {
        // Count code files
        const ext = path.extname(item);
        if (SUPPORTED_EXTENSIONS.includes(ext)) {
          files++;
          try {
            const content = fs.readFileSync(fullPath, 'utf-8');
            loc += content.split('\n').length;
          } catch (e) {
            // Skip files that can't be read
          }
        }
      }
    }
  } catch (e) {
    console.error(`Error scanning ${dir}:`, e);
  }

  return { files, loc };
}

// Simulate entropy fluctuation
function updateEntropy() {
  // Entropy oscillates using configuration parameters
  const baseEntropy = ENTROPY_CONFIG.baseValue;
  const variation = Math.sin(Date.now() / ENTROPY_CONFIG.oscillationPeriod) * ENTROPY_CONFIG.variationAmplitude;
  const randomNoise = (Math.random() - 0.5) * ENTROPY_CONFIG.randomNoiseAmplitude;
  
  systemState.entropy = Math.max(
    ENTROPY_CONFIG.minValue, 
    Math.min(ENTROPY_CONFIG.maxValue, baseEntropy + variation + randomNoise)
  );
  systemState.stability = 1 - systemState.entropy;
  systemState.lastUpdate = Date.now();
  
  // Broadcast telemetry update
  broadcast('telemetry', systemState);
}

// Update entropy every 2 seconds
setInterval(updateEntropy, 2000);

// API ENDPOINTS

// Health check / ping endpoint
app.get('/api/health', (_, res) => {
  res.json({ 
    status: 'ok',
    message: 'JulesBridge is ONLINE',
    uptime: process.uptime()
  });
});

// Telemetry endpoint
app.get('/api/telemetry', (_, res) => {
  res.json({
    status: systemState.status,
    entropy: systemState.entropy,
    stability: systemState.stability,
    timestamp: systemState.lastUpdate,
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
  });
});

// Stats endpoint - scans file system
app.get('/api/stats', (_, res) => {
  try {
    addLog('Scanning project file system...', 'info');
    
    // Scan the main project root
    const projectStats = countFilesAndLOC(CONFIG.projectRoot);
    
    // Try to scan SaaS-Framework if it exists
    let saasStats = { files: 0, loc: 0 };
    if (fs.existsSync(CONFIG.saasFrameworkPath)) {
      saasStats = countFilesAndLOC(CONFIG.saasFrameworkPath);
    }
    
    const stats = {
      projectFiles: projectStats.files,
      projectLOC: projectStats.loc,
      saasFiles: saasStats.files,
      saasLOC: saasStats.loc,
      totalFiles: projectStats.files + saasStats.files,
      totalLOC: projectStats.loc + saasStats.loc,
      lastScan: Date.now(),
    };
    
    addLog(`Scan complete: ${stats.totalFiles} files, ${stats.totalLOC.toLocaleString()} LOC`, 'success');
    
    res.json(stats);
  } catch (error: any) {
    addLog(`Error scanning files: ${error.message}`, 'error');
    res.status(500).json({ error: error.message });
  }
});

// Logs endpoint
app.get('/api/logs', (req, res) => {
  const limitParam = req.query?.limit as string;
  const limit = limitParam && !isNaN(parseInt(limitParam)) ? parseInt(limitParam) : 50;
  res.json(logsBuffer.slice(-Math.min(limit, MAX_LOGS)));
});

// WebSocket connection handler
wss.on('connection', (ws) => {
  addLog('Dashboard connected via WebSocket', 'info');
  
  // Send current state immediately
  ws.send(JSON.stringify({ 
    type: 'connected', 
    data: { 
      message: 'Connected to JulesBridge Neural Nexus',
      status: systemState.status,
      entropy: systemState.entropy,
      stability: systemState.stability,
    } 
  }));
  
  // Send initial logs
  ws.send(JSON.stringify({
    type: 'logs',
    data: logsBuffer.slice(-20)
  }));
  
  // Heartbeat
  const heartbeat = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ 
        type: 'heartbeat', 
        data: { 
          entropy: systemState.entropy,
          stability: systemState.stability,
          timestamp: Date.now()
        } 
      }));
    }
  }, 5000);
  
  ws.on('close', () => {
    clearInterval(heartbeat);
    addLog('Dashboard disconnected', 'info');
  });
  
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      if (message.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
      }
    } catch (e) {
      console.error('Error parsing WebSocket message:', e);
    }
  });
});

// Start server
server.listen(CONFIG.port, () => {
  console.log(`🌉 JULES BRIDGE v1.0 - Neural Nexus ONLINE on port ${CONFIG.port}`);
  console.log(`📊 Telemetry: http://localhost:${CONFIG.port}/api/telemetry`);
  console.log(`📈 Stats: http://localhost:${CONFIG.port}/api/stats`);
  addLog('JulesBridge Neural Nexus initialized', 'success');
});

export { app, server };
