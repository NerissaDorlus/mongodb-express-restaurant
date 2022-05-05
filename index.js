require("dotenv/config"); // must have .env file in order to use MONGO_URL link
const express = require("express");
const mongoClient = require("mongodb").MongoClient;
const mongo = require("mongodb");

const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// prevent warnings from Mongo
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

let menudb, customersdb; // made these variables reusable throughout the code
mongoClient.connect(url, options, (err, mongoClient) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log("we are connected!");

  app.listen(3000, () => console.log("app is listening on port 3000"));

  const db = mongoClient.db("restaurant");
  customersdb = db.collection("customers"); // assigning a the 'customer' collection to the customerdb
  menudb = db.collection("menu"); // assigning a 'menu' collection to the menudb
});

app.get("/", (req, res) => res.status(200).send("Hey class!"));

// get all menu items
app.get("/menu", (req, res) => {
  menudb.find().toArray((err, allMenuItems) => {
    if (err) {
      res.send(err);
      return;
    }
    res.status(200).send(allMenuItems);
  });
});

// add/post
app.post("/", (req, res) => {
  menudb
    .insertOne(req.body)
    .then(() => res.status(200).send("Item was added"))
    .catch((err) => res.status(500).send(err));
});

// update menu item byId
app.patch("/:id", (req, res) => {
  const { id } = req.params;
  menudb
    .updateOne(
      { _id: mongo.ObjectId(id) },
      { $set: { name: "tequila", cost: 60, stock: true, brand: "Patron" } }
    )
    .then(() => res.status(200).send("item was updated"))
    .catch((err) => res.status(500).send(err));
});

// delete menu by name
delete app.delete("/", (req, res) => {
  menudb
    .deleteOne({ name: req.body.name })
    .then(() => res.send("item was deleted"))
    .catch((err) => res.status(500).send(err));
});
