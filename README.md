# PrepWise AI – Interview Preparation Assistant
The workflow of PrepWise AI – Interview Assistant starts when a user logs into the platform and uploads their resume or provides a self-description. The user then enters the job description of the role they are targeting.

The frontend sends this data to the backend through REST APIs. The backend processes the information and sends a structured prompt to the Gemini AI model. Gemini analyzes the resume and job description, then generates a match score, skill-gap analysis, personalized roadmap, and technical and behavioral interview questions with answers.

The backend receives the AI response, processes it, stores the results in MongoDB, and sends the formatted data back to the frontend. Finally, the user can view all the generated insights through an interactive dashboard.

# Project Flow Diagram

User Registration / Login
            ↓
      JWT Authentication
            ↓
Upload Resume / Self Description
            ↓
Enter Job Description
            ↓
React Frontend
            ↓
REST API Request
            ↓
Node.js + Express Backend
            ↓
Prompt Creation
            ↓
Gemini AI API
            ↓
Resume Analysis & JD Matching
            ↓
Match Score Generation
Skill Gap Analysis
Interview Questions
Learning Roadmap
            ↓
Backend Processes Response
            ↓
Store Results in MongoDB
            ↓
Send Response to Frontend
            ↓
Interactive Dashboard
  
# Setup

Clone the repository
git clone https://github.com/HarshAnand17/PrepWise-AI

Setup backend
npm install
npm run dev

Setup frontend
cd Frontend
npm install
npm run dev

Note: Create .env files for both frontend and backend with the necessary keys (e.g., Mongo_URL,JWT_SECRET, GOOGLE_GENAI_API_KEY)
