import User from "../model/User.js";
import { generateToken } from "../utils/jwt.js";






export const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const userExits = await User.findOne({ email });
        if (userExits) {
            return res.status(400).json({
                success: false,
                error: 'User already exists with this email'
            })
        }

        //create a new user
        const user = await User.create({
            name,
            email,
            password
        })


        //generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    profilePicture: user.profilePicture
                },
                token
            },
            message: 'User register successfully'
        })

    } catch (error) {
        next(error)
    }
}

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            })
        }

        //check if password matche


        const isPasswordMatch = await user.matchPassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            })
        }




        //generate token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    profilePicture: user.profilePicture
                },
                token
            },
            message: 'User login successfully'
        })

    } catch (error) {
        next(error)
    }
}



export const getMe = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            })
        }


        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    profilePicture: user.profilePicture
                },
            },
            message: 'User fetched successfully'
        })
    } catch (error) {
        next(error)
    }
}

export const updateProfile = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { name, profilePicture } = req.body;

        const updatedFields = {};
        if (name) updatedFields.name = name;
        if (profilePicture !== undefined) updatedFields.profilePicture = profilePicture;

        const user = await User.findByIdAndUpdate(userId, updatedFields, { new: true, runValidators: true });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            })
        }

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    profilePicture: user.profilePicture
                },
            },
            message: 'User updated successfully'
        })
    } catch (error) {
        next(error);
    }
}