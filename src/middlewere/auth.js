const { use } = require("bcrypt/promises");
const res = require("express/lib/response");
const async = require("hbs/lib/async");
const jwt = require("jsonwebtoken");
const Dynamic_Web = require("../models/schema");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
    console.log(verifyUser);

    const user = await Dynamic_Web.findOne({ _id: verifyUser });
    const users = await Dynamic_Web.findOne({ _id: verifyUser });
    console.log(user.firstname);

    req.token = token;
    req.user = user;
    req.users = users;
    next();
  } catch {
    res.status(401).render("404", {
      Errormsg: "You Are Not Valid User Go Back",
    });
  }
};

module.exports = auth;
