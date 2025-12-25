import { Router } from "express";
import handleUserBeforeRegister from "../controllers/handleUserBeforeRegister.js";
import verifyUserAndCreateAccount from "../controllers/verifyTokenAndCreateUser.js";
import loginUser from "../controllers/handleLogin.js";

const authRouter= Router();

authRouter.post("/user-before-register",handleUserBeforeRegister);
authRouter.post("/register",verifyUserAndCreateAccount);
authRouter.post("/login",loginUser);



export default authRouter;