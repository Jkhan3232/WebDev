const mongoose = require("mongoose");

const db = process.env.DATABASE;
mongoose
  .connect(db)
  .then(() => console.log("Conection Successfull..."))
  .catch((err) => console.log(err));
