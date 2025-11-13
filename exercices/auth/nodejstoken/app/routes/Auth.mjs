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

  try {
    // Recherche de l'utilisateur
    const [rows] = await req.dbConnection.query(
      "SELECT * FROM user WHERE useName = ?",
      [username]
    );

    if (rows.length === 0) {
      return res
        .status(401)
        .json({ error: "Username ou mot de passe incorrect" });
    }

    const user = rows[0];

    // Vérification du mot de passe
    const match = await bcrypt.compare(password, user.userPassword);

    if (!match) {
      return res
        .status(401)
        .json({ error: "Username ou mot de passe incorrect" });
    }

    res.json({ message: "Connexion réussie" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Erreur serveur" });
  } finally {
    if (req.dbConnection) req.dbConnection.end();
  }
});

export default router;
