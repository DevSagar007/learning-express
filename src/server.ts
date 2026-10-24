import express, { type Application, type Request, type Response } from "express"
import { Pool } from "pg"
const app: Application = express()
const port = 5000

// app middleware
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
    connectionString: "postgresql://neondb_owner:npg_Mgu0eBLnQ8dj@ep-rough-pond-b7ylvkro-pooler.c-13.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
})

// connect Db async function
const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            name VARCHAR (20),
            email VARCHAR(20) UNIQUE NOT NULL,
            password VARCHAR(20) NOT NULL,
            is_active BOOLEAN DEFAULT true,
            age INT,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
            )`)
        console.log("Database connected successful")
    } catch (error) {
        console.log(error)
    }
}
initDB();

app.get('/', (req: Request, res: Response) => {
    // res.send('Hello World!')
    res.status(200).json({
        "message": "Express Server",
        "author": "Next Level"
    })
})

// Create user
app.post('/api/users', async (req: Request, res: Response) => {
    // console.log(req.body);
    const { name, email, password, age } = req.body;

    try {
        const result = await pool.query(`
        INSERT INTO users(name, email, password, age) VALUES($1,$2,$3,$4)
        RETURNING *
        `, [name, email, password, age])
        // console.log(result);

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
})

// Get all user
app.get('/api/users', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
            SELECT * FROM users`);

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
})

// Get single user
app.get('/api/users/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
        SELECT * FROM users WHERE id =$1
            `, [id]);
        console.log(result);
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
})

// Update user
app.put('/api/users/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, password, age, is_active } = req.body;

    try {
        const result = await pool.query(`
    UPDATE users
     SET name=COALESCE($1, name),
     password=COALESCE($2, password),
     age=COALESCE($3, age),
     is_active=COALESCE($4, is_active)

    WHERE id =$5 RETURNING * 
         `, [name, password, age, is_active, id]
        )
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
})

// Delete user
app.delete('/api/users/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
        DELETE FROM users WHERE id=$1
            `, [id]);
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
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})   