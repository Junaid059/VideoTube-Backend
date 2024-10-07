import Router from "express";
import { registerUser } from "../controllers/user.controller.js";
import User from "../models/user.models.js";
import upload from "../middlewares/multer.middleware.js";

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

export default router;
