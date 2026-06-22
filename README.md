The workflow of PrepWise AI – Interview Assistant starts when a user logs into the platform and uploads their resume or provides a self-description. The user then enters the job description of the role they are targeting.

The frontend sends this data to the backend through REST APIs. The backend processes the information and sends a structured prompt to the Gemini AI model. Gemini analyzes the resume and job description, then generates a match score, skill-gap analysis, personalized roadmap, and technical and behavioral interview questions with answers.

The backend receives the AI response, processes it, stores the results in MongoDB, and sends the formatted data back to the frontend. Finally, the user can view all the generated insights through an interactive dashboard.
