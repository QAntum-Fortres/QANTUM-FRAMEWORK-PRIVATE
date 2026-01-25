# 🧠 QAntum Demo

> Try QAntum features without installation

---

## 🎮 Interactive Demo

### Live Playground
Experience QAntum's power directly in your browser.

🔗 **[Launch Demo](https://dpengeneering.site/demo)**

---

## 📹 Video Demos

### Getting Started (5 min)
[![Getting Started](https://img.shields.io/badge/Watch-YouTube-red.svg)](#)

Learn the basics of QAntum in 5 minutes.

### Self-Healing in Action (3 min)
[![Self Healing](https://img.shields.io/badge/Watch-YouTube-red.svg)](#)

See how AI-powered locators adapt to UI changes.

### Visual Testing Demo (4 min)
[![Visual Testing](https://img.shields.io/badge/Watch-YouTube-red.svg)](#)

Catch visual regressions before they reach production.

### Security Scanning (6 min)
[![Security](https://img.shields.io/badge/Watch-YouTube-red.svg)](#)

Automatic XSS, SQL Injection, and CSRF detection.

---

## 🖼️ Screenshots

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Visual Diff Report
![Visual Diff](screenshots/visual-diff.png)

### Security Report
![Security](screenshots/security-report.png)

### Performance Metrics
![Performance](screenshots/performance.png)

---

## 💻 Code Examples

### Basic Test
```typescript
import { mm } from 'qantum';

describe('Login Flow', () => {
  it('should login successfully', async () => {
    await mm
      .goto('https://example.com/login')
      .fill('#email', 'user@test.com')
      .fill('#password', 'password123')
      .click('button[type="submit"]')
      .assertUrl('/dashboard')
      .assertText('.welcome', 'Welcome back!');
  });
});
```

### Self-Healing
```typescript
// Even if the button's selector changes, this will still work
const loginBtn = await mm.selfHeal('login-button');
await loginBtn.click();

// AI learns from previous successful interactions
```

### Visual Testing
```typescript
// Take baseline screenshot
await mm.visual().captureBaseline('homepage');

// Compare on subsequent runs
const result = await mm.visual().compare('homepage');
if (!result.match) {
  console.log(`Diff: ${result.diffPercentage}%`);
}
```

### Security Scan
```typescript
const scanner = mm.security();

// Full security audit
const report = await scanner.scan({
  xss: true,
  sqli: true,
  csrf: true,
  headers: true
});

console.log(`Vulnerabilities found: ${report.total}`);
```

---

## 🚀 Try It Now

### Option 1: Online Playground
No installation required. Try in browser.

🔗 **[Open Playground](https://dpengeneering.site/playground)**

### Option 2: Local Demo
```bash
# Clone demo repository
git clone https://github.com/QAntum-Fortres/QAntum-FRAMEWORK.git

# Install dependencies
npm install

# Run demo
npm run demo
```

### Option 3: Docker
```bash
docker run -it papica777/QAntum-demo
```

---

## 📊 Demo Features

| Feature | Available in Demo |
|---------|-------------------|
| Basic Automation | ✅ Full |
| Self-Healing | ✅ Full |
| Visual Testing | ⚠️ Limited (10 screenshots) |
| Security Scanning | ⚠️ Limited (basic scans) |
| Performance Testing | ✅ Full |
| CI/CD Integration | ❌ Pro only |
| Integrations | ❌ Pro only |

---

## 📞 Get Full Version

Ready for production? Contact us for licensing.

- **Email**: contact@dpengeneering.site
- **Website**: [dpengeneering.site](https://dpengeneering.site)

---

© 2025 QAntum by DP Engineering
