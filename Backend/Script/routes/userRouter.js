import { Router } from "express";
import uploadUserImage from "../services/multer/uploadUserImage.js";
import ProfileImage from "../controllers/handleUserImage.js";
import { updateUserProfile } from "../controllers/handleUpdateInfo.js";

const userRouter= Router();


userRouter.post("/user-image",uploadUserImage.single("userImage"),ProfileImage.updateProfileImage);
userRouter.delete("/user-image",ProfileImage.deleteProfileImage);

userRouter.patch("/update-profile",updateUserProfile);


export default userRouter;