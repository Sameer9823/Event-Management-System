import { Router } from "express";
import { login, register } from "../controllers/auth.controllers.js";
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


export default router

