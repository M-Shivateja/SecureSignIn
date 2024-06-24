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
mongoose
  .connect("add Mongodp connection string here")
  .then(() => console.log("connected to Mongo Database"));

/// defines the body format as json in each level where ever require
app.use(express.json());

app.use(cors({ origin: "*" }));

//// registration data checks

app.post("/register", async function (req, res) {
  try {
    const { email, Name, phone, password, confirmpassword } = req.body;

    const existinguser = await Registerdata.findOne({ email });

    if (existinguser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (!(password === confirmpassword)) {
      return res.status(400).json({ message: "passwords do not match" });
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
    res.status(200).send({ message: "registed successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "internal server error" });
  }
});

//// login data

app.post("/login", async function (req, res) {
  try {
    const { email, password } = req.body;

    const existinguser = await Registerdata.findOne({ email });

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
        id: existinguser.id,
      },
    };
    jwt.sign(payload, "Scrt", { expiresIn: 120000 }, (err, token) => {
      if (err) throw err;
      return res.json({ token });
    });
    // res.status(200).send({ message: "logged in successfully" });
  } catch (error) {
    console.log(error);
  }
});

/// protected route my profile

app.get("/myprofile", Verify, async (req, res) => {
  try {
    const existinguser = await Registerdata.findById(req.user.id);
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
