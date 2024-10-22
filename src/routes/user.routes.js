import Router from "express";
import { registerUser } from "../controllers/user.controller.js";
import User from "../models/user.models.js";
import upload from "../middlewares/multer.middleware.js";
import { logOutUser } from "../controllers/user.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/logout").post(verifyJWT, logOutUser);

export default router;
