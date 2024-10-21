import { Router } from "express";
import { 
    changeCurrentPassword,
    getCurrentUser,
    login, 
    logout, 
    refreshToken, 
    register,
    updateAccountDetails,
    updatedAvatar
 } from "../controllers/auth.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount: 1
        }
    ]),
    register
)

router.route("/login").post(login)
router.route("/logout").post(verifyJWT, logout)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/refresh-token").post(refreshToken)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-detail").patch(verifyJWT, updateAccountDetails)
router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), updatedAvatar)



export default router;

