# ChocoFarms - Developer & AI Agent Guide

Welcome to **ChocoFarms**! This document provides all essential architectural decisions, directory structures, conventions, routes, and features for AI agents and human developers working on this codebase.

---

## 1. Project Overview

ChocoFarms is an agro-resort, staycation, and farm-to-table cocoa discovery platform (*"Where Nature Meets Sweet Adventures"*).
- **Core Mission**: Combine rustic farm stays, cocoa orchard tourism, and artisanal handcrafted cocoa confections.
- **Brand Aesthetic**: Warm chocolate earth tones (`#3b2219`, `hsl(25, 45%, 30%)`), warm cream, lush farm greens, and golden jaggery accents. Modern, playful, and responsive.

---

## 2. Tech Stack

- **Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite 5](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/) with CSS variables (HSL), [shadcn/ui](https://ui.shadcn.com/) (`@radix-ui` primitives), and `tailwindcss-animate`.
- **Typography**: Google Fonts pairing configured in `index.html` and `tailwind.config.ts`:
  - `Outfit` / `Plus Jakarta Sans` for modern English headings & body.
  - `Noto Sans Telugu` for Telugu typography.
- **Routing**: [React Router v6](https://reactrouter.com/) (`BrowserRouter`, `Routes`, `Route`).
- **Icons**: [lucide-react](https://lucide.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/) toast notifications.
- **Audio Synthesizer**: Self-contained Web Audio API synthesizer (`src/lib/soundEffects.ts`) for zero-dependency clicks, chimes, kitchen timer alarms, and victory melodies.

---

## 3. Directory Structure

```
ChocoFarms/
├── public/
│   ├── mascot.png                   # Official ChocoFarms mascot illustration
│   ├── recipes/                     # High-res photography for recipes
│   │   ├── artisan-hot-cocoa.jpg
│   │   ├── cocoa-sunnundalu.jpg
│   │   ├── cacao-pulp-smoothie.jpg
│   │   ├── jaggery-lava-cake.jpg
│   │   ├── choco-filter-coffee.jpg
│   │   └── cacao-nib-brittle.jpg
│   └── favicon.*, manifest, etc.
├── src/
│   ├── components/
│   │   ├── cookbook/
│   │   │   ├── CookbookNavbar.tsx     # Sticky header with brand, language & sound toggles
│   │   │   ├── CookbookHero.tsx       # Hero with bilingual copy, search input & mascot
│   │   │   ├── RecipeFilters.tsx      # Category & dietary filter pills
│   │   │   ├── RecipeCard.tsx         # Responsive recipe card with quick cook mode
│   │   │   ├── KitchenTimer.tsx       # Interactive kitchen countdown timer with sound
│   │   │   ├── ChefCookModeModal.tsx  # Full-screen step-by-step cooking mode
│   │   │   └── AddRecipeModal.tsx     # Interactive multi-tab recipe creation modal
│   │   └── ui/                        # Radix + Tailwind UI components
│   ├── context/
│   │   ├── LanguageContext.tsx        # Bilingual (EN / TE) context with localStorage persistence
│   │   └── RecipeContext.tsx          # Dynamic recipe state (defaults + custom user recipes)
│   ├── data/
│   │   ├── recipes.ts                 # Full recipe database with bilingual content
│   │   └── translations.ts            # UI translation dictionary for English and Telugu
│   ├── hooks/
│   │   └── useFavorites.ts            # Bookmarking / favorites state with localStorage
│   ├── lib/
│   │   ├── soundEffects.ts            # Web Audio API chime, timer alarm & victory audio
│   │   └── utils.ts                   # Tailwind cn merge helper
│   ├── pages/
│   │   ├── Index.tsx                  # Landing page with hero, mascot & cookbook spotlight
│   │   ├── Cookbook.tsx               # Main cookbook grid & search (/cook, /cookbook)
│   │   ├── RecipeDetail.tsx           # Deep link recipe detail (/cook/:recipeId)
│   │   └── NotFound.tsx               # 404 fallback page
│   ├── App.tsx                        # Router setup with LanguageProvider
│   ├── index.css                      # Design tokens, CSS variables, and print styles
│   └── main.tsx                       # React DOM entry point
└── tailwind.config.ts                 # Extended theme, fonts, and keyframes
```

---

## 4. Routing Architecture

| Route | Component | Description |
|---|---|---|
| `/` | `Index.tsx` | Landing page with hero, mascot, cookbook preview cards, and WhatsApp contact. |
| `/cook` | `Cookbook.tsx` | Main cookbook page with search, category tabs, dietary filters, and recipe grid. |
| `/cookbook` | Redirect | Automatically redirects to `/cook`. |
| `/cook/:recipeId` | `RecipeDetail.tsx` | Individual recipe view with dynamic servings scaler, checklist, timer, print, and cook mode. |
| `/admin` | `AdminRecipes.tsx` | Admin Recipe Studio: manage, add, edit, and delete recipes with direct sync to GitHub. |
| `/cook/admin` | Redirect | Automatically redirects to `/admin`. |
| `*` | `NotFound.tsx` | 404 page for unmatched routes. |

---

## 5. Key Features & Implementation Details

### A. Bilingual Support (English & Telugu)
- **Context**: `LanguageProvider` (`src/context/LanguageContext.tsx`).
- **Storage**: User preference persisted in `localStorage` under key `chocofarms_lang`.
- **Translations**: UI strings stored in `src/data/translations.ts`.
- **Recipes**: Every recipe in `src/data/recipes.ts` has complete, authentic English (`en`) and Telugu (`te`) titles, taglines, descriptions, ingredients, and steps.

### B. Interactive Chef Cook Mode
- **Component**: `src/components/cookbook/ChefCookModeModal.tsx`
- **Features**:
  - Full-screen immersive cooking experience.
  - Large, readable typography for cooking at a kitchen counter.
  - Keyboard navigation: `Left Arrow` (previous step), `Right Arrow` (next step), `Escape` (close).
  - Step progression bar and step checklist.
  - Embedded kitchen timer for steps with cook times.
  - Mascot secret tips at each step.
  - Celebratory victory flourish with audio cues when finished.

### C. Scalable Servings Calculator
- In `RecipeDetail.tsx`, users can increment (`+`) or decrement (`-`) servings.
- Ingredient quantities automatically recalculate in real-time based on the ratio: `servings / baseServings`.

### D. Interactive Pantry Checklist
- Users can tap ingredients and cooking steps to check them off as they prepare.
- Checked items play an audio chime and display clean strike-through styling.

### E. Web Audio API Sound Effects
- `src/lib/soundEffects.ts` uses native browser `AudioContext` to synthesize pleasant musical notes:
  - `playChime()`: High pleasant bell note for checkboxes & step advances.
  - `playClick()`: Subtle woodblock click for buttons & toggles.
  - `playTimerAlarm()`: 4-tone ascending bell chime when kitchen timer expires.
  - `playVictory()`: Harmonic chord melody when recipe is completed.
- Includes a global mute toggle button in `CookbookNavbar` that respects `localStorage` (`chocofarms_sound_muted`).

### F. Print-Friendly Recipe Cards
- `@media print` styles in `src/index.css` automatically hide navigation bars, buttons, and headers when printing.
- Clicking the "Print Recipe Card" button generates a clean, readable hardcopy suitable for kitchens.

### G. Admin Recipe Studio & Direct GitHub Storage (Zero-DB Architecture)
- **Concept**: Following the serverless GitHub file pattern (similar to OrthoLife), recipes are stored as a version-controlled JSON database in [`public/recipes-data.json`](file:///Users/manoj/Documents/GitHub/ChocoFarms/public/recipes-data.json) directly in the `Dr-Anonymous/ChocoFarms` repository.
- **Client Fetching**:
  - The client automatically checks `https://raw.githubusercontent.com/Dr-Anonymous/ChocoFarms/main/public/recipes-data.json?t=<timestamp>` on startup.
  - Any recipe added or edited by the admin is immediately served to all visitors worldwide without redeploying or needing a backend database.
- **Dedicated Admin Page (`/admin`)**:
  - Located at [`src/pages/AdminRecipes.tsx`](file:///Users/manoj/Documents/GitHub/ChocoFarms/src/pages/AdminRecipes.tsx) (`/admin`, `/cook/admin`).
  - Regular visitors on `/cook` never see technical git details, branch names, or upload buttons.
  - Dashboard includes search, category filters, recipe status, view live, edit, delete, and manual GitHub sync.
- **Cross-Device Token Persistence (No Prompts on Every Device)**:
  - Configuration file: [`src/config/admin.ts`](file:///Users/manoj/Documents/GitHub/ChocoFarms/src/config/admin.ts).
  - Configured via GitHub Actions Secrets/Variables (`VITE_GITHUB_TOKEN`) during deployment or locally via `.env` (gitignored), allowing devices accessing `/admin` to add, edit, and delete recipes immediately without exposing credentials in the public repository. Alternatively, users can enter tokens directly into browser `localStorage`.
- **Admin Direct Commits**:
  - Module: [`src/lib/githubStorage.ts`](file:///Users/manoj/Documents/GitHub/ChocoFarms/src/lib/githubStorage.ts).
  - When saving, editing, or deleting a recipe, the frontend fetches the current SHA of `public/recipes-data.json`, base64 encodes the UTF-8 content, and sends a `PUT` request to GitHub's Contents API (`https://api.github.com/repos/Dr-Anonymous/ChocoFarms/contents/public/recipes-data.json`).
- **Admin Password Protection**:
  - The admin route is protected by a password lock screen.
  - The password is configurable in [`src/config/admin.ts`](file:///Users/manoj/Documents/GitHub/ChocoFarms/src/config/admin.ts) (`adminPassword`) or via `VITE_ADMIN_PASSWORD` (default: `chocofarms2026`).
  - Active sessions are remembered in `sessionStorage` (`chocofarms_admin_authenticated`) with a manual "Lock" button in the header.
- **Creation & Edit Modal**: [`src/components/cookbook/AddRecipeModal.tsx`](file:///Users/manoj/Documents/GitHub/ChocoFarms/src/components/cookbook/AddRecipeModal.tsx) supports both creating new recipes and editing existing ones.

---

## 6. Development & Build Commands

- **Install dependencies**: `npm install`
- **Start dev server**: `npm run dev` (Runs Vite on `http://localhost:5173/`)
- **Build production bundle**: `npm run build`
- **Preview production build**: `npm run preview`
- **Lint**: `npm run lint`

---

## 7. Guidelines for Future AI Agents

1. **Maintain Bilingual Parity**: Whenever adding a new recipe or feature, ensure both `en` and `te` fields are populated in `recipes.ts` and `translations.ts`.
2. **Design Quality**: Do not degrade the visual polish. Keep buttons rounded (`rounded-xl` or `rounded-2xl`), use HSL colors from the design system, and avoid unstyled placeholder graphics.
3. **No External Sound Assets**: Keep using the Web Audio API in `src/lib/soundEffects.ts` to prevent missing file or CORS issues with audio playback.
