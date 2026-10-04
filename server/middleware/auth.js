import mongoose from "mongoose";
import { verifyToken } from "../utils/jwt.js";

export const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized, no token provided'
            });
        }

        try {
            const decode = verifyToken(token);
            if (!decode?.userId || !mongoose.Types.ObjectId.isValid(decode.userId)) {
                return res.status(401).json({
                    success: false,
                    error: 'Not authorized, malformed token payload'
                });
            }
            req.user = decode;
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized, invalid or expired token'
            });
        }
    } catch (error) {
        next(error);
    }
};