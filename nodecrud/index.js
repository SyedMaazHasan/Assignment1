const express = require("express");
const app = express();
const mongoose = require("mongoose");
const manageRecord = require("./manageRecord");

var cors = require("cors");

app.use(cors());

app.use(express.json());
app.use("/", manageRecord);
////connecting to db///
//csmco

mongoose
  .connect(
    "mongodb://maazuser:abcd@cluster0-shard-00-00-aj2vh.mongodb.net:27017,cluster0-shard-00-01-aj2vh.mongodb.net:27017,cluster0-shard-00-02-aj2vh.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true",
    { useNewUrlParser: true }
  )
  .then(console.log("connected"));
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log("listening on port ", port);
});
