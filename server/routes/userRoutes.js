import { Router } from "express";
import { loginUser, logout, getUserProfile, updateUserProfile, registerUser } from "../controller/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const userRouter = Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/logout', logout);
userRouter.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

export default userRouter;