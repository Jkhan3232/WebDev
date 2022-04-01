require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcrypt");
require("./database/connect");
const Dynamic_Web = require("./models/schema");
const auth = require("./middlewere/auth");
const cookie = require("cookie-parser");

const htmlPath = path.join(__dirname, "../public");
const view_Path = path.join(__dirname, "../templates/views");
const paritals = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(cookie());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(htmlPath));
app.set("view engine", "hbs");
app.set("views", view_Path);
hbs.registerPartials(paritals);

// Routing

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/webdev", auth, (req, res) => {
  // console.log(`crate our cookie ${req.cookies.jwt}`);
  res.render("webdev");
});

app.get("/logout", auth, async (req, res) => {
  try {
    // req.user.tokens = req.user.tokens.filter((currntElm) => {
    //   return currntElm.token !== req.token;
    // });

    req.user.tokens = [];

    res.clearCookie("jwt");
    console.log("logout successfully..");
    await req.user.save();
    res.render("index");
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.confirmpassword;

    if (password === cpassword) {
      const webdev = new Dynamic_Web({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        phone: req.body.phone,
        age: req.body.age,
        massage: req.body.massage,
        password: password,
        confirmpassword: cpassword,
      });

      // console.log("the jwt part" + Jkreisgter);
      const token = await webdev.genrateAuthToken();
      // console.log("The token part" + token);

      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 100000),
        httpOnly: true,
      });

      const registerjk = await webdev.save();
      // console.log("passing page" + registerjk);

      res.status(200).render("index");
      // console.log(registerjk);

      // await webdev.save();
      // console.log(webdev);
    } else {
      res.send("Password is not match");
    }

    res.status(200).render("index");
  } catch {
    res.status(400).render("404");
  }
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const usremail = await Dynamic_Web.findOne({ email: email });

    const isMail = await bcrypt.compare(password, usremail.password);

    const token = await usremail.genrateAuthToken();
    console.log("The token part" + token);

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 100000),
      httpOnly: true,
    });

    if (isMail) {
      res.status(201).render("index");
    } else {
      res.send("passwor is not match");
    }
  } catch (error) {
    res.status(400).render("404");
  }
});

app.get("*", (req, res) => {
  res.render("404", {
    Errormsg: "Opps Page Could Not Found! Go back🔄",
  });
});
app.listen(port, () => {
  console.log(`lisining port no. ${port}`);
});
