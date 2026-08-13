# Designmela — Digital Creative Studio Portfolio

High-impact portfolio website for Designmela featuring dynamic multi-currency pricing, region auto-detection, interactive multi-step project intake form, floating WhatsApp widget, and "Dee" AI assistant.

---

## 🚀 Quick Start (Local Development)

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Set Environment Variables**:
   Create a `.env` or `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *(Get your free API key from [Google AI Studio](https://aistudio.google.com/apikey))*

3. **Run Dev Server**:
   ```bash
   npm run dev
   # or
   npm start
   ```
   Open `http://localhost:8080` in your browser.

---

## 🌐 Deploying to Vercel

1. Import this repository into Vercel.
2. Add the environment variable in Vercel Project Settings:
   - `GEMINI_API_KEY`: Your production Google Gemini API key.
3. Deploy! Vercel automatically serves the static frontend and deploys `/api/chat` as a serverless backend function.

---

## 🔑 Note on Web3Forms Key
The `access_key` for Web3Forms is embedded in `index.html` and `main.js`. This is standard for Web3Forms client-side form submission and is **not a secret key**.
