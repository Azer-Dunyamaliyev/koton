import mongoose from "mongoose";

export const connectDB = async () => {
    const connection = await mongoose.connect(process.env.MONGO_URL, {
        serverSelectionTimeoutMS: 15000,
    });
    console.log('Data-Base qaldirildi', connection.connection.host);
    return connection;
}

export default connectDB
















// .env faylında olmalı dəyişənlər (dəyərləri bura yazmayın, .env-ə əlavə edin):
// MONGO_URL, JWT_SECRET, FRONT_END_SECRET, STRIPE_SECRET_KEY, SUCCESS_URL, CANCEL_URL

// FRONT (.env, layihe_front qovluğunda):
// REACT_APP_API_URL = "http://localhost:5500"  (local üçün)
// REACT_APP_API_URL = "https://koton.onrender.com"  (production üçün)