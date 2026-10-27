import { pool } from "../../db";
import type { Iuser } from "./user.interface";

const createUserIntoDb = async (payload: Iuser) => {
    const { name, email, password, age } = payload;
    const result = await pool.query(
        `
        INSERT INTO users(name, email, password, age) VALUES($1,$2,$3,$4)
        RETURNING *
        `,
        [name, email, password, age],
    );
    // console.log(result)
    return result;
};

const getAllUsersFromDb = async () => {
    const result = await pool.query(`
            SELECT * FROM users`);
    return result;
};

const getSingleUserFromBb = async (id: string) => {
    const result = await pool.query(
        `
        SELECT * FROM users WHERE id =$1
            `,
        [id],
    );
    return result;
};

const updateUserFromDb = async (payload: Iuser, id: string) => {
    const { name, password, age, is_active } = payload;
    const result = await pool.query(`
    UPDATE users
     SET name=COALESCE($1, name),
     password=COALESCE($2, password),
     age=COALESCE($3, age),
     is_active=COALESCE($4, is_active)

    WHERE id =$5 RETURNING * 
         `, [name, password, age, is_active, id]
    )
    return result;
}

const deleteUserFromDb = async (id: string) => {
    const result = await pool.query(`
        DELETE FROM users WHERE id=$1
            `, [id]);
    return result;
}

export const userService = {
    createUserIntoDb,
    getAllUsersFromDb,
    getSingleUserFromBb,
    updateUserFromDb,
    deleteUserFromDb
};
