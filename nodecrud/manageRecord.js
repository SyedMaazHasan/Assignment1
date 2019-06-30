const mongoose = require("mongoose");
const express = require("express");
const app = express();
//csmco
const schema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true
  },
  keyword: {
    type: String,
    required: true,
    max: 50
  }
});

const Model = mongoose.model("demo", schema);

app.get("/get", async (req, res) => {
  console.log("under get");
  const result = await Model.find();
  res.send(result);
});

app.post("/post", async (req, res) => {
  console.log("came in post ");
  const data = new Model({
    _id: req.body.id,
    keyword: req.body.keyword
  });

  //mongoose schema validation
  try {
    const recordSaved = await data.save();
    res.send(recordSaved);
  } catch (e) {
    res.send("ID Already registered");
  }
});

app.post("/delete", async (req, res) => {
  console.log("Got a DELETE request at /user", req.body);
  try {
    const find = await Model.findOneAndRemove({ _id: req.body._id });
    res.send("record removed");
  } catch (e) {
    res.send("error occourred while deleting");
  }
});

module.exports = app;
