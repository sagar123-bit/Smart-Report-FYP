import { Router } from "express";
import handleUserBeforeRegister from "../controllers/handleUserBeforeRegister.js";
import verifyUserAndCreateAccount from "../controllers/verifyTokenAndCreateUser.js";
import loginUser from "../controllers/handleLogin.js";
import resendVerificationCode from "../controllers/resendVerificationCode.js";
import handleForgetPass from "../controllers/handleForgetPass.js";
import handleResetPassword from "../controllers/handleResetPass.js";
import getAuthUser from "../controllers/getAuthUser.js";
import logoutUser from "../controllers/logoutHandler.js";


const authRouter= Router();

authRouter.post("/user-before-register",handleUserBeforeRegister);
authRouter.post("/register",verifyUserAndCreateAccount);
authRouter.post("/login",loginUser);
authRouter.post("/resend-verification-code", resendVerificationCode);
authRouter.post("/forget-password",handleForgetPass);
authRouter.post("/reset-password",handleResetPassword);

authRouter.get("/get-auth-user",getAuthUser);
authRouter.delete("/logout",logoutUser);



export default authRouter;