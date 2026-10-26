import { Router } from "express";
import { userController } from "./user.controller";

const router = Router()

// Create user
router.post('/', userController.createUser)

export const userRoute = router