# SafeRoute AI — System Architecture & Engineering Documentation

This document provides a technical walkthrough of the architectural patterns, state orchestration, vector cartography, and data models implemented in **SafeRoute AI**.

---

## 1. High-Level Architecture Overview

SafeRoute AI is built as a modular, client-side Single Page Application (SPA) inside an interactive mobile preview emulator. It is optimized for zero-dependency offline demonstration, deterministic safety simulations, and high-contrast monochrome visualization.

```mermaid
flowchart TD
    subgraph UI_Shell [Hardware Emulator & Navigation Shell]
        MF[MobileFrame.tsx<br/>Phone / Fluid Device Shell]
        TB[Prototype Toolbar & Screen Switcher]
        BNB[BottomNavBar.tsx<br/>5-Tab Primary Navigation]
        FAA[FloatingAiAssistant.tsx<br/>Contextual AI Copilot]
    end

    subgraph State_Management [Context & Lifecycle Orchestration]
        TC[ThemeContext.tsx<br/>Pure White / Pure Black Monochrome]
        LC[LanguageContext.tsx<br/>i18n: EN, HI, ES, FR]
        APP[App.tsx<br/>Screen Dispatcher & Global State]
        NLM[LiveNavigationScreen.tsx<br/>Navigation Lifecycle: Navigating | Paused | Completed]
    end

    subgraph Core_Engines [Visualization & Explainability]
        ME[MapEngine.tsx<br/>Custom SVG Vector Cartographic Engine]
        XAI[ShapExplainabilityScreen.tsx<br/>Feature Attribution Engine]
        SIM[Auto-Progression & Anomaly Simulator]
    end

    subgraph Mock_Data_Store [Data Models & Seed Stores]
        MD[mockData.ts<br/>Routes, SHAP Weights, POIs, Incidents]
        TR[translations.ts<br/>Multilingual Dictionary]
        TY[types.ts<br/>Domain Interfaces & Type Contracts]
    end

    MF --> APP
    TB --> APP
    APP --> NLM
    APP --> BNB
    NLM --> ME
    APP --> XAI
    APP --> FAA
    TC -.-> ME
    TC -.-> MF
    LC -.-> APP
    MD --> ME
    MD --> NLM
    MD --> XAI
    TY -.-> APP
    TY -.-> ME
```

---

## 2. Component Hierarchy & Screen Routing

The application uses an explicit state-driven screen dispatcher in `src/App.tsx` governed by the `ScreenId` union type (`src/types.ts`).

### Screen Registry (19 Total Screens)

| Screen ID | Category | Component | Key Responsibility |
| :--- | :--- | :--- | :--- |
| `splash` | Onboarding | `SplashScreen.tsx` | Brand promise, safety features, get started CTA |
| `login` | Onboarding | `LoginScreen.tsx` | Phone input, simulated OTP, biometric toggle, guardian setup |
| `dashboard` | Core Route | `DashboardScreen.tsx` | Live Safety Index (94%), night status, quick actions, SOS |
| `route_search` | Core Route | `RouteSearchScreen.tsx` | Origin/Destination search, safety criteria filters |
| `route_comparison` | Core Route | `RouteComparisonScreen.tsx` | Multi-corridor comparison (Routes A, B, C) with score badges |
| `shap_explain` | Core Route | `ShapExplainabilityScreen.tsx` | SHAP waterfall attribution: lighting, crowd, transit, incident |
| `live_navigation` | Journey & Emergency | `LiveNavigationScreen.tsx` | Turn-by-turn HUD, lux meter, unified action rail, arrival card |
| `safety_alert` | Journey & Emergency | `SafetyAlertModal.tsx` | Sudden hazard/illumination drop alert modal with bypass CTA |
| `dynamic_reroute` | Journey & Emergency | `DynamicReroutingScreen.tsx` | Side-by-side detour comparison (+2 min, +18% safety) |
| `safety_checkin` | Journey & Emergency | `SafetyCheckInScreen.tsx` | 30s countdown timer with "I Am Safe" or SOS escalation |
| `emergency_sos` | Journey & Emergency | `EmergencySosScreen.tsx` | 5s panic button, siren, live GPS dispatch, 112/1091 links |
| `trusted_contacts` | Personal & Community | `TrustedContactsScreen.tsx` | Guardian list, live location-sharing status, phone battery telemetry |
| `safety_analytics` | Personal & Community | `SafetyAnalyticsScreen.tsx` | Weekly safety trends, 8 PM - 1 AM hourly ratings, risk breakdown |
| `profile_settings` | Personal & Community | `ProfileSettingsScreen.tsx` | Night mode config, sensitivity sliders, offline cache, language |
| `public_gathering_hub` | Personal & Community | `PublicGatheringHubScreen.tsx` | Assembly tracker, metro gate alerts, Green Medical Corridor |
| `safe_haven_network` | Personal & Community | `SafeHavenNetworkScreen.tsx` | 24/7 verified refuges (police, pharmacies, campus booths) |
| `transport_companion` | Personal & Community | `TransportCompanionScreen.tsx` | Cab/bus monitor: plate logger, deviation & stationary alarms |
| `infrastructure_reporting`| Personal & Community | `InfrastructureReportingScreen.tsx` | Dark spot/streetlight geotagging, community upvotes, resolution tracker |
| `community_safe_walk` | Personal & Community | `CommunitySafeWalkScreen.tsx` | Peer escort requests, verified campus wardens, group safe walks |

---

## 3. Interactive SVG Vector Cartography (`MapEngine.tsx`)

Rather than relying on third-party mapping SDKs (Google Maps, Mapbox, Leaflet) that require paid API keys and external network access, SafeRoute AI implements an in-house SVG Vector Cartographic Engine:

1. **Schematic Coordinate Space:** Operates on an internal `500 x 500` SVG viewBox with responsive CSS scaling.
2. **Urban Morphology Layers:**
   - Soft-cornered parcel blocks (`rx="5"`, `ry="5"`).
   - Curved organic canal waterway with road bridge deck and parapet geometry.
   - Public green spaces: Civic Memorial Park and Botanical Gardens with pedestrian paths.
3. **Hierarchical Road Network:**
   - **Grand Boulevard:** Major arterial corridor (14px casing, 10px fill).
   - **Central Avenue:** Primary horizontal thoroughfare (11px casing, 8px fill).
   - **Northway & Metro Way:** Radial connector avenues (8px casing, 6px fill).
   - **Secondary Connector Streets:** Fine neighborhood street grid (3.5px fill).
4. **Dynamic Theme Adaptation:** Reads tokenized colors directly from `useTheme()`:
   - *Light Mode:* Pure white background (`#FFFFFF`), light gray parcels (`#F5F5F7`), slate-gray road casings.
   - *Dark Mode:* Pure black background (`#000000`), deep charcoal parcels (`#0C0D0E`), dark neutral roads (`#1C1E22`).
5. **Route Legibility:**
   - **Active Route:** Continuous 11px high-contrast outline casing + 6.5px core emerald stroke + directional chevrons (`strokeDasharray="5 18"`).
   - **Alternative Routes:** Subdued 2.5px neutral dashed lines (`strokeDasharray="4 4"`).
   - **GPS Puck:** Dynamic heading beam (visible during motion), pulse ring, and position dot. At 100% progress, puck aligns with destination pin `(440, 75)` and locks into arrived status.

---

## 4. Navigation Lifecycle State Machine (`LiveNavigationScreen.tsx`)

Live navigation is governed by an explicit finite state machine:

```
[IDLE / MOUNT]
      │
      ▼
[NAVIGATING] ◄────────┐
      │               │ (Resume / Restart)
 (Pause Button)   (Play Button)
      │               │
      ▼               │
  [PAUSED] ───────────┘
      │
 (nextProgress >= 100%)
      │
      ▼
 [COMPLETED] ───(Restart Button)───► [NAVIGATING] (progress = 0%)
```

### Deterministic State Variables:
- **`lifecycle`**: `'navigating' | 'paused' | 'completed'`
- **`progress`**: `0` to `100` (clamped)
- **`currentStepIdx`**: Synchronized index `[0..4]` into `NAV_STEPS`
- **`remainingKm`**: Dynamically computed as `totalDistanceKm * (1 - progress / 100)`
- **`remainingMin`**: Dynamically computed as `Math.ceil(totalMinutes * (1 - progress / 100))`
- **Terminal State Contract**: At `progress === 100`, interval timers stop, remaining values strictly equal `0 m` and `0 min`, and the active turn HUD transforms into the arrival confirmation presentation.

---

## 5. Explainable AI (XAI) & SHAP Scoring Architecture

To solve the "black-box" dilemma in safety routing, the platform implements a transparent feature attribution model based on **SHAP (SHapley Additive exPlanations)** values (`src/components/screens/ShapExplainabilityScreen.tsx`):

- **Base Baseline Safety:** Standard urban street benchmark (50 points).
- **Positive Attributions:**
  - Street Illumination (Lux sensor uptime): `+35 pts`
  - Pedestrian Density / Storefront Footfall: `+22 pts`
  - Transit Proximity (Metro station CCTV): `+15 pts`
  - Police Coverage / Helpdesk: `+8 pts`
- **Negative Attributions:**
  - Recent Incident Reports / Low Illumination Pockets: `-12 pts`
- **Net Computed Safety Index:** `93%` (Displayed across Route C and verified by the interactive waterfall chart).

---

## 6. Theme and Localization Systems

### High-Contrast Monochrome Design System
The visual architecture enforces strict monochrome aesthetics for distraction-free night use:
- **Light Mode:** `#FFFFFF` background, `#000000` text, neutral gray borders (`#E4E4E7`).
- **Dark Mode:** `#000000` background, `#FFFFFF` text, neutral gray borders (`#27272A`).
- **Semantic Accents:** Emerald (`#10B981`) for verified safe states, Amber (`#F59E0B`) for caution/check-ins, and Red (`#EF4444`) for emergency SOS alerts.

### Multilingual Dictionary (`LanguageContext.tsx`)
- Provides synchronous on-device localization across English (`en`), Hindi (`hi`), Spanish (`es`), and French (`fr`).
- Stored ephemerally and persisted in `localStorage` under `saferoute_language`.
