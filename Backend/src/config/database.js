const mongoose = require("mongoose")



async function connectToDB() {

    try {
        //await mongoose.connect(process.env.MONGO_URI)
        await mongoose.connect(process.env.MONGODB_URL_LOCAL)

        console.log("Connected to Database")
    }
    catch (err) {
        console.log(err)
    }
}

module.exports = connectToDB