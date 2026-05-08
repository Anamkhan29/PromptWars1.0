# 🌍 VoyageEngine: AI-Powered Travel Experience

VoyageEngine is a production-grade travel planning suite that combines generative AI with Google Maps Platform to craft highly personalized, map-integrated itineraries in seconds.

## 🚀 Key Features

- **🧠 Smart Itinerary Engine**: Leverages Gemini 1.5 Flash to generate context-aware, day-wise travel plans based on budget, interests, and transport preferences.
- **🗺️ Interactive Map Experience**: Real-time visualization of your trip routes using Advanced Markers and the Google Maps Routes API.
- **⚡ Dynamic Re-planner**: AI-driven "on-the-fly" modifications for weather changes, mood shifts, or spontaneous discoveries.
- **💼 Comprehensive Dashboard**: Save, revisit, and manage your travel history in one unified interface.
- **📱 Mobile-First Design**: Fully responsive, dark-mode-ready UI built with Tailwind CSS and shadcn/ui.

## 🛠️ Technical Architecture

- **Frontend**: React 18, Vite, Tailwind CSS, Motion (Framer Motion).
- **Backend Proxy**: Express + Vite Middleware for full-stack capability.
- **AI Integration**: `@google/genai` with structured output schema enforcement.
- **Maps Platform**: `@vis.gl/react-google-maps` for performance and modern API support.
- **State Management**: React Hooks + LocalStorage (ready for Firebase migration).
- **Validation**: Zod + React Hook Form.

## 🛠️ Setup Instructions

### Prerequisites
1. **Google AI Studio Key**: Get your `GEMINI_API_KEY` from AI Studio.
2. **Google Maps Platform Key**: Get your `GOOGLE_MAPS_PLATFORM_KEY` from Google Cloud Console. Enable "Maps JavaScript API", "Places API", and "Routes API".

### Development
1. Clone the repository.
2. Install dependencies: `npm install`.
3. Add your keys to the `.env` or as AI Studio Secrets.
4. Run: `npm run dev`.

## 🧪 Testing

VoyageEngine includes a suite of unit and integration tests using Vitest and React Testing Library.
Run tests: `npx vitest`

## ♿ Accessibility

The application is built with WCAG compliance in mind:
- High-contrast color palette.
- Keyboard-accessible interactive elements.
- Semantic HTML and ARIA labels.
- screen-reader compatible timeline views.

---
Built with ❤️ by AI Studio Build Agent
