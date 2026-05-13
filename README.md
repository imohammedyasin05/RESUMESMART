# AI Resume Analyzer + Smart Editor

A high-performance, responsive web application designed to help job seekers optimize their resumes using AI. This tool analyzes resumes against specific job descriptions, provides an ATS (Applicant Tracking System) score, and offers a smart editor for real-time improvements.

## 🚀 Features

- **PDF Resume Extraction**: Upload your resume in PDF format to automatically extract text.
- **Role-Based Analysis**: Enter a target job role and paste a job description for context-aware feedback.
- **AI-Powered ATS Insights**:
    - **ATS Score**: A numerical evaluation of how well your resume matches the job.
    - **Keyword Analysis**: Identification of missing keywords extracted from the job description.
    - **Weakness Detection**: Pinpoint areas that need more quantification or better phrasing.
    - **Actionable Suggestions**: Concrete advice on how to improve specific sections.
- **Smart Resume Editor**: 
    - **AI Rewrite**: One-click "Smart Rewrite" that optimizes your resume content for ATS.
    - **Rich Text Integration**: Integrated with React Quill for a professional editing experience.
    - **Live Preview**: See your resume changes reflected in a professional document format.
- **Mobile Responsive Design**: Fully optimized for mobile, tablet, and desktop viewing.

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS (Mobile-first design)
- **Icons**: Lucide React
- **Editor**: React Quill (Rich text editing)
- **State Management**: React Hooks (useState, useEffect)

### Backend (Full-Stack)
- **Server**: Express.js
- **Runtime**: Node.js
- **PDF Processing**: `pdf-parse`
- **AI Integration**: Google Gemini API (`@google/genai`)

## 🏗 Project Structure

```bash
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── AnalysisPanel   # Visualizes AI feedback
│   │   ├── ResumeEditor    # Rich text editor component
│   │   └── ResumeUpload    # PDF upload & extraction logic
│   ├── services/           # External API integrations
│   │   └── gemini.ts       # Gemini API client proxy
│   ├── App.tsx             # Main application layout & logic
│   └── index.css           # Global Tailwind & Custom styles
├── server.ts               # Express backend handler
├── package.json            # Dependencies & Scripts
└── .env.example            # Environment variable template
```

## 🔋 Environment Variables

To run the AI features, you need a Gemini API Key.

```env
# .env.example
GEMINI_API_KEY=your_gemini_api_key_here
```

## 💻 Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## 🤖 AI Prompt Engineering

The application uses specific prompts for `gemini-3-flash-preview` to ensure high quality results:
- **Analysis**: Focuses on ATS metrics, keyword density, and quantitative achievement markers.
- **Improvement**: Employs strong action verbs and professional tone while maintaining the original's truthfulness.

## 📱 Responsiveness

The app uses a layout-shifting strategy:
- **Desktop**: Side-by-side view (Analysis | Editor) for maximum productivity.
- **Mobile/Tablet**: Sequential stacked view (Input -> Analysis -> Editor) for focus on smaller screens.

---

Built with ❤️ by AI Studio Builder.
