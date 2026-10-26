import type { Request, Response } from "express";
import { pool } from "../../db";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
    // console.log(req.body);
    // const { name, email, password, age } = req.body;
    try {
        const result = await userService.createUserIntoDb(req.body)
        res.status(201).json({
            "message": "user created successful!",
            data: result.rows[0],
            success: true,
        })
    } catch (error: any) {

        res.status(500).json({
            "message": error.message,
            error: error,
            success: false,
        })
    }
}

export const userController = {
    createUser,
}