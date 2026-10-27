import type { Request, Response } from "express";
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

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const result = await userService.getAllUsersFromDb();

        res.status(200).json({
            success: true,
            message: "User retrived successfully",
            data: result.rows,
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            data: error,
        })
    }
}

const getSingleUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {

        const result = await userService.getSingleUserFromBb(id as string);

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "User not found!",
                data: {},
            })
        }
        res.status(200).json({
            success: true,
            message: "User retrived successfully",
            data: result.rows[0],
        })

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            data: error,
        })
    }
}

const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {

        const result = await userService.updateUserFromDb(req.body, id as string)

        // Check if user exists
        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "User not found!",
            })
        }
        // User updated successfully
        res.status(200).json({
            success: true,
            message: "User Updated successfully",
            data: result.rows[0],
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            data: error,
        })
    }
}

const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {

        const result = await userService.deleteUserFromDb(id as string);

        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "User not found!",
            })
        }
        res.status(200).json({
            success: true,
            message: "User Deleted successfully",
        })

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            data: error,
        })
    }
}

export const userController = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser,
}