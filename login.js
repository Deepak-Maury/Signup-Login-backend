const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./db/model");
require("./db/mongoose");
const app = express();
app.use(express.json());
const secretkey = "secretkey";
const port=process.env.PORT || 5000
app.post("/signup", async (req, res) => {
  try {
    const data = ({ username, email, password } = req.body);
    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Email and password are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: "Email already in use" });
    }
    const newUser = new User(req.body);
    await newUser.save();
    // await data.save();
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(500)
        .send({ message: "Email and password is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).send({ message: "Invalid credentials." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).send({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ userId: user._id }, secretkey, {
      expiresIn: "1h",
    });
    return res
      .status(200)
      .send({ token, message: "User logged in successfully" });
  } catch (error) {
    return res.status(500).send({ message: "server error" });
  }
});
app.listen(port, () => {
  
    console.log("server runing port:"+ port);
  
});
