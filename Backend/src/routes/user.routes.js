import { Router } from "express";
import { googleLogin, loginUser, logoutUser, registerUser, authGoogle } from "../controllers/user.controller.js";

const router = Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').post(logoutUser)
router.route('/google').post(googleLogin)
router.route('/authGoogle').post(authGoogle)

export default router;