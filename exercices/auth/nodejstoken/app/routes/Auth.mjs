import express from "express";
import { connectToDatabase } from "../utils/dbUtils.mjs";
import bcrypt from "bcrypt";

const router = express.Router();

// Middleware pour la connexion à la base de données
const connectToDatabaseMiddleware = async (req, res, next) => {
  try {
    req.dbConnection = await connectToDatabase();
    next();
  } catch (error) {
    console.error("Error connecting to the database:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

router.post("/", connectToDatabaseMiddleware, async (req, res) => {
  const { username, password } = req.body;

  const queryString = "SELECT * FROM t_users WHERE useName = ?";

  try {
    const [rows] = await req.dbConnection.query(queryString, [username]);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.usePassword); // compare hashed password

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    res.status(200).json({ message: "Authentication successful" });
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
export default router;
