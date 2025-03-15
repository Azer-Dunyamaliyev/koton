import express, { urlencoded } from 'express';
import { configDotenv } from "dotenv";
import cors from 'cors';
import connectDB from './config/connection.js';
import userRoutes from './routes/auth.js';
import cookieParser from 'cookie-parser';
import productsRouter from './routes/productsRoute.js'
import wishlistRouter from './routes/wihslistRoute.js'
import ordersRouter from './routes/ordersRoute.js'
import succesOrdersRouter from './routes/successOrderRoute.js'
import subscribeRouter from './routes/subscribeRoute.js'
import path from "path"
import uploadRouter from './routes/uploadsRoute.js'
import fs from "fs";
configDotenv();

const app = express();

// Middleware
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

// CORS
const corsOptions = {
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization'],
  credentials: true, 
};

app.use(cors(corsOptions));

// Route
app.use('/users', userRoutes);
app.use("/products", productsRouter);
app.use("/favorites", wishlistRouter);
app.use("/orders", ordersRouter);
app.use("/success", succesOrdersRouter);
app.use("/subscribe", subscribeRouter);

const __dirname = path.resolve();
app.use("/upload", uploadRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// DB Bağlantısı
connectDB().then(() => {
  console.log('DB quruldu');
}).catch((err) => {
  console.error('Veritabanına bağlanırken hata oluştu:', err);
});

// SERVER
const PORT = 5500;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalişir...`);
});
