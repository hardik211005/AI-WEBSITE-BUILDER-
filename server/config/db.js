import mongoose from "mongoose"

let isConnected = false

const connectDb = async () => {
    if (isConnected) {
        return
    }
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            serverSelectionTimeoutMS: 30000,
        })
        isConnected = true
        console.log("db connected")
    } catch (error) {
        console.log("db error", error.message)
        throw error
    }
}

export default connectDb