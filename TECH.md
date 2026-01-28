# Technology Stack

This application is a **Single Page Application (SPA)** built using a modern, serverless stack. Below is a detailed breakdown of the libraries and frameworks used.

## Core Frontend

*   **React (v19):** The application uses the latest version of React for building the user interface, utilizing modern features like Functional Components and Hooks (`useState`, `useEffect`).
*   **TypeScript:** The entire application is written in TypeScript, providing static typing, interfaces, and type safety.
*   **ES Modules (via esm.sh):** The app uses an `importmap` to load dependencies directly from a CDN (`esm.sh`) as standard ES modules, eliminating the need for a local bundler step.

## Styling & UI

*   **Tailwind CSS:** Used for utility-first styling. It is loaded via CDN, allowing for rapid UI development using classes like `flex`, `min-h-screen`, and `bg-white`.
*   **Lucide React:** Provides the consistent SVG icon set used throughout the application (e.g., icons for delete, save, AI analysis).
*   **Google Fonts:**
    *   **Inter:** Used for the main UI text for high readability.
    *   **Merriweather:** Used specifically for journal entry content to provide a classic, serif writing experience.

## Backend & Database (Serverless)

*   **Supabase:** Acts as the backend infrastructure.
    *   **Database:** A hosted PostgreSQL database stores journal entries.
    *   **Authentication:** Handles secure user sign-up, login, and session management.
    *   **Row Level Security (RLS):** Policies are applied at the database level to ensure users can only access their own data.
    *   **Client SDK:** `@supabase/supabase-js` is used to communicate with the backend services.

## Artificial Intelligence

*   **Google GenAI SDK (`@google/genai`):**
    *   **Model:** Uses `gemini-3-flash-preview` for fast and efficient text analysis.
    *   **Functionality:** Analyzes journal entries to generate concise summaries, detect mood, and provide stoic advice.

## Architecture

*   **Client-Side Rendering (CSR):** The browser loads a minimal HTML shell and hydrates the application via JavaScript. Data is fetched dynamically from APIs after the initial load.

## Security Model

**Question: How does the app hide backend code from the web browser?**

Answer: It doesn't hide the `services/` code, because this is a client-side application. Instead of relying on hidden server-side logic, the security is architected as follows:


1.  **Backend-as-a-Service (Supabase):** The logic that manipulates database files resides on Supabase's remote servers. The browser only sends HTTP requests to the Supabase API using the `supabaseClient`.
2.  **Row Level Security (RLS):** Security is enforced at the *database level*, not the application level. Even though the JavaScript code is visible to the user, the database policies (SQL) defined in `supabase_schema.sql` ensure that users can only query or modify rows that match their own `user_id`.
3.  **API Keys:**
    *   **Supabase Anon Key:** Designed to be public. It connects to the DB but is restricted by RLS.
    *   **Gemini API Key:** Accessed via `process.env.API_KEY`. In a production environment, this key should be restricted by HTTP referrer (domain) in the Google Cloud Console to prevent unauthorized usage.

Netlify:
https://my-typescript-journal.netlify.app

https://www.youtube.com/watch?v=uKfx6kzdZrU



