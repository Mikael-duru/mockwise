# 🧑‍💼 MockWise — AI Mock Interview Platform

MockWise helps candidates practice realistic voice interviews and get actionable AI feedback — all in a simple, modern experience.

---

## 🧰 Tech Stack

| Tech               | What it Does                                      |
|--------------------|---------------------------------------------------|
| **Next.js 15**     | App Router, Server Actions, SSR                   |
| **Tailwind CSS**   | Utility-first styling                             |
| **shadcn/ui**      | Accessible, reusable React components             |
| **Vapi**           | Voice AI workflow — dynamic spoken conversations  |
| **Gemini AI**      | Google’s LLM — generates questions & feedback     |
| **Firebase**       | Auth and Firestore database                       |
| **Cloudinary**     | Image upload, storage, and on-the-fly optimization|

---

## 🎙️ Built for Practice Interviews

- ✅ **Realistic Voice Interviews** — Vapi handles spoken conversation flow.
- 🧠 **Dynamic AI Questions** — Gemini generates custom, role-specific interview questions.
- 📊 **Constructive Feedback & Scoring** — Gemini analyzes transcripts and provides detailed performance scores.
- 🔒 **Secure Authentication** — Firebase Auth with both Google and email/password sign-in. User data is protected with strict Firestore rules.
- ☁️ **Image Uploads** — Cloudinary stores and optimizes user profile pictures.
- 🎨 **Modern UI** — Tailwind CSS and shadcn/ui keep the interface accessible, clean, and responsive.

---

## 📦 Installation  
1. Clone the repository:  
   ```bash
   git clone https://github.com/Mikael-duru/mockwise.git
   cd mockwise
   ```
2. Install dependencies:  
   ```bash
   npm install
   ```
3. Set up environment variables in a `.env` file:  
   ```env
    # Firebase
    NEXT_PUBLIC_FIREBASE_API_KEY=
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
    NEXT_PUBLIC_FIREBASE_APP_ID=
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=


    FIREBASE_PROJECT_ID=
    FIREBASE_PRIVATE_KEY=
    FIREBASE_CLIENT_EMAIL=

    # Gemini
    GOOGLE_GENERATIVE_AI_API_KEY=

    # Vapi
    NEXT_PUBLIC_VAPI_WEB_TOKEN=
    NEXT_PUBLIC_VAPI_WORKFLOW_ID=

    # Cloudinary
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=
   ```
4. Run the development server:  
   ```bash
   npm run dev
   ```
5. Open `http://localhost:3000` in your browser.  

---  
Built with ❤️ and Nextjs.  
