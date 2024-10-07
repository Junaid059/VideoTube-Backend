import Router from "express";
import { registerUser } from "../controllers/user.controller";

const router = Router();

router.route("/register").post(
  upload.field([
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
