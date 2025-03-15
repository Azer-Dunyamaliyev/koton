import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URL)
        console.log('Data-Base qaldirildi', connection.connection.host);
        
    } catch (error) {
        console.log('Data-Base error',connection.connection.host);
    }
}

export default connectDB
















// MONGO_USERNAME = naviboy687@andinews.com
// MONGO_PASSWORD = naviboy555
// MONGODB_USERNAME = naviboy687
// MONGODB_PASSWORD = iNcRhkMwJeTQrqZH
// MONGO_URL = mongodb+srv://naviboy687:iNcRhkMwJeTQrqZH@cluster0.fujyd.mongodb.net/
// JWT_SECRET = supersifrelitokenqourmasi1234
// FRONT_END_SECRET = pk_test_51QtvfzRR8oYWn0OLVYyPZLfIYNDY7YZFI4J4RKV6Q6aRtq3r9bepdZII4mTENzuXZqJgFG0QenXgfifvseTuFync00uV4pLk3F
// STRIPE_SECRET_KEY = sk_test_51QtvfzRR8oYWn0OLvYuNFyP24BC3Tr9ogcdLQTAIAyZuZZEIaSMGdDtfcGqKrQEySZNeJnsFpaRyS33XxKANv3DB00wfpZo5mF
// SUCCESS_URL=http://localhost:3000/success
// CANCEL_URL=http://localhost:3000/cancel