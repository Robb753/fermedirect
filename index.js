const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Utilisation du middleware CORS
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

const UserSchema = new mongoose.Schema({
  name: String,
  latitude: Number,
  longitude: Number,
  produce: String, // Adjust or remove this field if it doesn't make sense for users
  imageURL: String,
});

const EmailSchema = new mongoose.Schema({
  email: String,
});

const UserModel = mongoose.model("Users", UserSchema);
const EmailModel = mongoose.model("Emails", EmailSchema);

app.get("/GetUsers", async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  try {
    const newEmail = new EmailModel({ email });
    await newEmail.save();
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error saving email:", err);
    res.status(500).json({ success: false });
  }
});

// Route de test
app.get("/", (req, res) => {
  res.send("Le serveur fonctionne correctement !");
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
