# 📱 PROJECT 09: TELEGRAM UPLINK

## Mobile Command & Control Integration

**Role:** Full-Stack Developer  
**Tech Stack:** Node.js, Telegram Bot API, Webhooks  
**Status:** Live / Production

---

### 📄 Executive Summary

**Telegram Uplink** bridges the gap between complex backend algorithms and human oversight. It transforms a standard messaging app into a fully functional "Command & Control" terminal. Users can not only receive rich-media alerts (Charts, PnL reports) but also issue voice or text commands to control the trading engine from anywhere in the world.

---

### ⚡ Key Technical Achievements

#### 1. Interactive Command Menus

Utilized Telegram's Inline Keyboard API to create dynamic, interactive menus that allow users to approve trades, pause the bot, or switch strategies with a single tap.

#### 2. Rich Media Rendering

Integrated a chart rendering engine that generates `.png` snapshots of market indicators and sends them directly to the chat stream, providing instant visual context.

#### 3. Authentication Layer

Built a whitelist-based middleware that ensures only the owner's Telegram ID can issue commands, ignoring all other messages.

---

### 💻 Code Snippet: The Notification Pipe

```typescript
// Sending High-Priority Alerts
public async sendAlert(message: string, priority: 'HIGH' | 'LOW') {
    if (priority === 'HIGH') {
        // Bypass mute settings with "disable_notification: false"
        await this.bot.sendMessage(CHAT_ID, `🚨 ${message}`, { 
            parse_mode: 'Markdown',
            disable_notification: false 
        });
    } else {
        // Silent log
        await this.bot.sendMessage(CHAT_ID, `ℹ️ ${message}`, { 
            disable_notification: true 
        });
    }
}
```

---

### 📊 Engagement Metrics

| Metric | Value |
|:---|:---|
| **Delivery Time** | < 1s |
| **Uptime** | 99.9% |
| **Usage** | Daily |

---

### ⚙️ Enterprise Hardening

* **Monitoring:** Datadog Cloud Telemetry (Live Pulse Enabled)
* **Security:** SLSA Level 1 Supply-Chain Provenance
* **Deployment:** GitHub Actions Automated CI/CD

---

> *"Communication is the soul of an empire."*
