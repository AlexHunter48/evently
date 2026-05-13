const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const router = require("./routes/todoRoutes");
const live_url =
  "mongodb://dev_Samuel:<db_password>@ac-fgwz52s-shard-00-00.n1fna5z.mongodb.net:27017,ac-fgwz52s-shard-00-01.n1fna5z.mongodb.net:27017,ac-fgwz52s-shard-00-02.n1fna5z.mongodb.net:27017/?ssl=true&replicaSet=atlas-o5qtrt-shard-0&authSource=admin&appName=Cluster0"
const local_url = "mongodb://localhost:27017/userDB";

mongoose
  .connect(live_url)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Connection Error: ", err));

const app = express();
app.use(cors());
app.use(express.json());
app.use("/todos", router);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});