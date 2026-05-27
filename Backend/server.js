require("dotenv").config()
const app=require("./src/app")

const connectToDB=require("./src/config/database");


connectToDB();

//console.log(process.env.GOOGLE_GENAI_API_KEY);
app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})

