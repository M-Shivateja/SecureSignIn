const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const comparePassword = require("./Hashing/Comparepass");
const hashPassword = require("./Hashing/Hashpasw");
const Registerdata = require("./model/Register");
const Verify = require("./middleware/verify");
const cors = require("cors");
const app = express();

///Database Connection
const mongoURI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/securesignin";

let isMongoConnected = false;

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("connected to Mongo Database");
    isMongoConnected = true;
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err.message);
    console.log("Running in demo mode without database");
    isMongoConnected = false;
  });

// Demo data for testing without MongoDB
const demoUsers = [];

/// defines the body format as json in each level where ever require
app.use(express.json());

app.use(cors({ origin: "*" }));

//// registration data checks

app.post("/register", async function (req, res) {
  try {
    const { email, Name, phone, password, confirmpassword } = req.body;

    if (!(password === confirmpassword)) {
      return res.status(400).json({ message: "passwords do not match" });
    }

    if (isMongoConnected) {
      // Use MongoDB
      const existinguser = await Registerdata.findOne({ email });

      if (existinguser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const hashedPassword = await hashPassword(password);

      const newUser = new Registerdata({
        email,
        Name,
        phone,
        password: hashedPassword,
        confirmpassword: hashedPassword,
      });

      await newUser.save();
    } else {
      // Use demo mode
      const existingUser = demoUsers.find((user) => user.email === email);

      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const hashedPassword = await hashPassword(password);

      demoUsers.push({
        id: Date.now().toString(),
        email,
        Name,
        phone,
        password: hashedPassword,
        confirmpassword: hashedPassword,
      });
    }

    res.status(200).send({ message: "registered successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "internal server error" });
  }
});

//// login data

app.post("/login", async function (req, res) {
  try {
    const { email, password } = req.body;

    let existinguser;

    if (isMongoConnected) {
      // Use MongoDB
      existinguser = await Registerdata.findOne({ email });
    } else {
      // Use demo mode
      existinguser = demoUsers.find((user) => user.email === email);
    }

    if (!existinguser) {
      return res.status(400).send({ message: "please register" });
    }

    const checkPassword = await comparePassword(
      password,
      existinguser.password
    );

    if (!checkPassword) {
      return res.status(400).send({ message: "password is incorrect" });
    }

    //  object id that is genrated with uniquie value in DB For each user
    const payload = {
      user: {
        id: existinguser.id || existinguser._id,
      },
    };
    jwt.sign(payload, "Scrt", { expiresIn: 120000 }, (err, token) => {
      if (err) throw err;
      return res.json({ token });
    });
    // res.status(200).send({ message: "logged in successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "internal server error" });
  }
});

/// protected route my profile

app.get("/myprofile", Verify, async (req, res) => {
  try {
    let existinguser;

    if (isMongoConnected) {
      // Use MongoDB
      existinguser = await Registerdata.findById(req.user.id);
    } else {
      // Use demo mode
      existinguser = demoUsers.find((user) => user.id === req.user.id);
    }

    if (!existinguser) {
      return res.status(400).send("user not found");
    }
    res.json(existinguser);
  } catch (error) {
    console.log(error);
    return res.status(500).send("server error");
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
