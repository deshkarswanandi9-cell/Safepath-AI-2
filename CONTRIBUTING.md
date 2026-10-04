# Contributing to SafeRoute AI

Thank you for your interest in contributing to **SafeRoute AI**. This guide outlines our development workflow, coding standards, and verification procedures.

---

## 1. Prerequisites

Before working on the project, ensure you have:
- **Node.js**: Version 18.0.0 or higher (Node.js 20+ LTS recommended)
- **npm**: Version 9.0.0 or higher
- **Git**

---

## 2. Development Workflow

### Step 1: Clone the Repository
```bash
git clone https://github.com/deshkarswanandi9-cell/Safepath-AI-2.git
cd Safepath-AI-2
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 3. Code Standards & Architecture Guidelines

1. **Monochrome Design System:**
   - Follow pure-white Light mode (`#FFFFFF`) and pure-black Dark mode (`#000000`).
   - Use neutral grays for borders and secondary text.
   - Restrict semantic colors: Emerald (`#10B981`) for verified safe states, Amber (`#F59E0B`) for caution, and Red (`#EF4444`) for emergency alerts.
   - Avoid decorative neon glows, purple gradients, or uncurated bright colors.
2. **Deterministic Navigation & Simulations:**
   - Do not claim real-world GPS or external API integration unless backed by genuine service implementations.
   - Maintain the `NavigationLifecycle` state machine (`navigating`, `paused`, `completed`).
3. **Responsive Emulation:**
   - Preserve the Phone (`390 x 844` aspect ratio) and Fluid preview modes in `MobileFrame.tsx`.
   - Never apply scale transforms to inner application text or icons during layout transitions.
4. **Motion & Accessibility:**
   - Always wrap motion variants with `useReducedMotion()` from `motion/react` to respect user accessibility preferences.

---

## 4. Verification & Testing Checklist

Before submitting a Pull Request, run the following verification checks:

```bash
# 1. Typecheck with zero errors
npx tsc --noEmit

# 2. Production build bundle validation
npm run build
```

Both commands must exit with code `0`.

---

## 5. Submitting Pull Requests

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. Commit your changes with clear, descriptive messages following Conventional Commits (e.g. `feat:`, `fix:`, `docs:`):
   ```bash
   git commit -m "feat: add verified safe haven marker filtering"
   ```
3. Push to your fork and submit a Pull Request to `main`.
4. Ensure your PR description clearly describes:
   - What changes were made and why.
   - Evidence of passing `npx tsc --noEmit` and `npm run build`.
