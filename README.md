# COOEE Signup Flow

A modern, animated, mobile-responsive signup flow built with **React**, **Vite**, and **Tailwind CSS**.

---

## Features

- Multi-step signup with animated transitions (Framer Motion)
- Mobile responsive design
- Dark mode toggle
- Stylish UI with glassmorphism and modern visuals
- Country/number selection, plan selection, registration, and payment simulation
- Mock API for demo purposes (no backend required)

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm

### Installation

```bash
npm install
```

### Running the Dev Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Architecture Overview

- **React Functional Components & Hooks**: All UI logic is built using hooks (`useState`, `useEffect`, etc.).
- **Tailwind CSS**: Used for rapid, utility-first styling and responsive layouts.
- **Framer Motion**: Handles animated transitions between steps.
- **Mock API**: All data (countries, numbers, plans, registration, payment) is simulated with local state and `setTimeout` for realistic delays.
- **Multi-step Flow**: The app guides users through:
  1. Country & number selection
  2. Plan selection
  3. Registration
  4. Payment
  5. Confirmation
- **Responsive Design**: Layout and images adapt to mobile, tablet, and desktop screens.
- **Dark Mode**: Toggle in the header; all UI elements adapt for accessibility and style.

---

## Customization

- Add your own images to `src/assets` or `public` and use them in the UI.
- Tweak Tailwind config or CSS for custom themes and branding.
- Adjust mock API data in `src/App.jsx` for different countries, numbers, or plans.

---

## Assumptions Made

- The signup flow is linear and matches the steps described in the technical assessment.
- All data is simulated; no backend or persistent storage is used.
- UI/UX is inspired by modern onboarding flows and glassmorphism.
- The app is designed to be visually appealing and easy to use on all devices.
- Exact feature set and visuals may differ from callcooee.com, but all required steps and logic are present.

---

## License

MIT

---

## Version Control

To initialize a git repository and push your code to a remote (e.g., GitHub):

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/your-repo.git
git branch -M main
git push -u origin main
```

Replace `your-username/your-repo.git` with your actual GitHub repository URL.
