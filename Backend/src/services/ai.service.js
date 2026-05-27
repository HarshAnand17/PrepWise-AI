const { GoogleGenAI}=require("@google/genai");
const {z}=require("zod");
const {zodToJsonSchema}=require("zod-to-json-schema");

const ai=new GoogleGenAI({
    apiKey:process.env.GOOGLE_GENAI_API_KEY
})


const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
     title: z.string().describe("The title of the job for which the interview report is generated"),
})

// async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    
//     const prompt = `Generate an interview report for a candidate with the following details:
//                         Resume: ${resume}
//                         Self Description: ${selfDescription}
//                         Job Description: ${jobDescription}
// `

//     const response = await ai.models.generateContent({
//         //model: "gemini-2.0-flash",
//         //model: "gemini-2.5-flash",
//         model: "gemini-3-flash-preview",
//         contents: prompt,
//         config: {
//             responseMimeType: "application/json",
//             responseSchema: zodToJsonSchema(interviewReportSchema),
//         }
//     })

//       //return JSON.parse(response.text)
//     const parsedData = JSON.parse(response.text);

// const extractedTitle =
//   parsedData.position ||
//   parsedData.job_title ||
//   jobDescription?.split("\n")[0] ||
//   "Interview Report";

// return {
//   title: extractedTitle,
//   ...parsedData
// };
      

// }

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    
    const prompt = `
Generate a detailed interview report in STRICT JSON format:

{
  "title": "Job title",
  "technicalQuestions": [
    {
      "question": "question",
      "intention": "why interviewer asks",
      "answer": "how to answer"
    }
  ],
  "behavioralQuestions": [
    {
      "question": "question",
      "intention": "why interviewer asks",
      "answer": "how to answer"
    }
  ],
  "skillGaps": [
    {
      "skill": "skill name",
      "severity": "low | medium | high"
    }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focus": "topic",
      "tasks": ["task1", "task2"]
    }
  ]
}

Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}

IMPORTANT:
- Follow exact structure
- No plain strings
- Always return objects
`;

    const response = await ai.models.generateContent({
        //model: "gemini-2.0-flash", // stable use karo
        model: "gemini-3-flash-preview", // stable use karo
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema),
        }
    });

    const parsedData = JSON.parse(response.text);

//     const formatQuestions = (arr) =>
//   arr?.map(q => ({
//     question: q.question || q || "No question provided",
//     intention: q.intention || "Not provided",
//     answer: q.answer || "Not provided"
//   })) || [];

const formatQuestions = (arr) =>
  arr?.map(q => {
    // 👇 agar string hai to parse karo
    if (typeof q === "string") {
      try {
        const parsed = JSON.parse(q);
        return {
          question: parsed.question || "No question",
          intention: parsed.intention || "Not provided",
          answer: parsed.answer || "Not provided"
        };
      } catch {
        return {
          question: q,
          intention: "Not provided",
          answer: "Not provided"
        };
      }
    }

    // 👇 agar already object hai
    return {
      question: q.question || "No question",
      intention: q.intention || "Not provided",
      answer: q.answer || "Not provided"
    };
  }) || [];


// const formatSkills = (arr) =>
//   arr?.map(s =>
//     typeof s === "string"
//       ? { skill: s, severity: "medium" }
//       : s
//   ) || [];


const formatSkills = (arr) =>
  arr?.map(s => {
    if (typeof s === "string") {
      try {
        const parsed = JSON.parse(s);
        return {
          skill: parsed.skill || s,
          severity: parsed.severity || "medium"
        };
      } catch {
        return { skill: s, severity: "medium" };
      }
    }

    return {
      skill: s.skill || "Unknown",
      severity: s.severity || "medium"
    };
  }) || [];



// const formatPlan = (arr) =>
//   arr?.map((p, i) =>
//     typeof p === "string"
//       ? { day: i + 1, focus: p, tasks: [] }
//       : p
//   ) || [];

//     const formatPlan = (arr) =>
//   arr?.map((p, i) => {
//     // agar number aaya (jaise 1,2,3)
//     if (typeof p === "number") {
//       return {
//         day: p,
//         focus: "General Preparation",
//         tasks: []
//       };
//     }

//     // agar string aaya
//     if (typeof p === "string") {
//       return {
//         day: i + 1,
//         focus: p,
//         tasks: []
//       };
//     }

//     // agar object hai but incomplete
//     return {
//       day: p.day || i + 1,
//       focus: p.focus || "General Preparation",
//       tasks: Array.isArray(p.tasks) ? p.tasks : []
//     };
//   }) || [];

const formatPlan = (arr) =>
  arr?.map((p, i) => {
    if (typeof p === "string") {
      try {
        const parsed = JSON.parse(p);
        return {
          day: parsed.day || i + 1,
          focus: parsed.focus || "General",
          tasks: parsed.tasks || []
        };
      } catch {
        return {
          day: i + 1,
          focus: p,
          tasks: []
        };
      }
    }

    return {
      day: p.day || i + 1,
      focus: p.focus || "General",
      tasks: p.tasks || []
    };
  }) || [];

  

    const extractedTitle =
      parsedData.title ||
      jobDescription?.split("\n")[0] ||
      "Interview Report";
     


 

  return {
  title: extractedTitle,
  matchScore: parsedData.matchScore || 85,
  technicalQuestions: formatQuestions(parsedData.technicalQuestions),
  behavioralQuestions: formatQuestions(parsedData.behavioralQuestions),
  skillGaps: formatSkills(parsedData.skillGaps),
//   preparationPlan: formatPlan(parsedData.preparationPlan)
preparationPlan: Array.isArray(parsedData.preparationPlan)
  ? formatPlan(parsedData.preparationPlan)
  : []
};
}
module.exports=generateInterviewReport