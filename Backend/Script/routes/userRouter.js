import { Router } from "express";
import uploadUserImage from "../services/multer/uploadUserImage.js";
import ProfileImage from "../controllers/handleUserImage.js";
import { updateUserProfile } from "../controllers/handleUpdateInfo.js";
import CrimeReportController from "../controllers/handleCrimeReport.js";
import uploadCrimeEvidence from "../services/multer/uploadCrimeEvidence.js";
import getAllUsers from "../controllers/getAllUsers.js";
import getAllCrimeReports from "../controllers/getAllCrimeReport.js";
import { updateUserStatus } from "../controllers/updateUserStatus.js";

const userRouter= Router();


userRouter.post("/user-image",uploadUserImage.single("userImage"),ProfileImage.updateProfileImage);
userRouter.delete("/user-image",ProfileImage.deleteProfileImage);

userRouter.patch("/update-profile",updateUserProfile);

userRouter.post("/crime-report",uploadCrimeEvidence.array("evidences", 5),CrimeReportController.createReport);
userRouter.put("/crime-report/:reportId",uploadCrimeEvidence.array("evidences", 5),CrimeReportController.updateReport);
userRouter.delete("/crime-report/:reportId",CrimeReportController.deleteReport);
userRouter.get("/get-all-users",getAllUsers);
userRouter.get("/get-all-reports",getAllCrimeReports);
userRouter.patch("/update-user-report/:reportId",uploadCrimeEvidence.array("evidences", 5),CrimeReportController.updateReport);
userRouter.delete("/delete-report/:reportId",CrimeReportController.deleteReport);
userRouter.patch("/update-user-status/:userId",updateUserStatus);

export default userRouter;