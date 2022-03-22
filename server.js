const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
const PORT = 5000;
app.use(express.json());

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const serviceAccount = require("./ServiceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
const collection = db.collection("users");

app.post("/create", async (req, res) => {
  await collection.add({
    name: req.body.name,
    value: req.body.value,
  });
  res.send({ message: "data inserted" });
});

app.get("/", async (req, res) => {
  let arr = [];
  const data = await collection.get();
  data.forEach((doc) => {
    arr.push(doc.data());
  });
  res.send(arr);
});

app.listen(PORT, () => console.log(`Server starting in ${PORT}`));
