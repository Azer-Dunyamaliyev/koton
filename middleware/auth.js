import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    
    if (!token) {
        return res.status(401).json("Elaqe qurulmadi! Token yoxdu.");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        
        next(); 
    } catch (error) {
        res.status(400).json("Geçersiz token!");
    }
};

export default authMiddleware;
