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

//return all the name and value from the database
app.get("/", async (req, res) => {
  let arr = [];
  const data = await collection.orderBy("value").get();
  data.forEach((doc) => {
    arr.push(doc.data());
  });
  res.send(arr);
});

//if the name already exists, the value will be updated
//otherwise a new document will be created
app.post("/create", async (req, res) => {
  const snapshot = await collection.where("name", "==", req.body.name).get();
  if (snapshot.empty) {
    await collection.add({
      name: req.body.name,
      value: req.body.value,
    });
  } else {
    snapshot.forEach((doc) => {
      let tmp = doc.data();
      tmp.value = req.body.value;
      doc.ref.update(tmp);
    });
  }
  res.send({ message: "data inserted/updated" });
});

//document with the particular name will be deleted
app.delete("/:name", async (req, res) => {
  console.log(req.params.name);
  const snapshot = await collection.where("name", "==", req.params.name).get();
  snapshot.forEach((doc) => {
    doc.ref.delete();
  });
  res.send({ message: "data deleted" });
});

app.listen(PORT, () => console.log(`Server starting in ${PORT}`));
