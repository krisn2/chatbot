const jwt = require("jsonwebtoken");

export const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if(!token) return res.status(401).json({error:"Unauthorized"});

    try {
        const decode = jwt.verify(token,process.env.JWT_SECRET);
        req.userId = decode.id;
        next();
    } catch (err) {
        return res.status(401).json({error: "Invalid token"});
    }
};