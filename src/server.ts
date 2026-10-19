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
            email VARCHAR(20) NOT NULL,
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

app.post('/', async (req: Request, res: Response) => {
    // console.log(req.body);
    const { name, email, password } = req.body;
    res.status(201).json({
        "message": "post created",
        data: {
            name,
            email,
        }
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})   