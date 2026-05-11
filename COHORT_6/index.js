// import express
const express = require('express');
// cors
const cors = require('cors');
// mongoose
const mongoose = require('mongoose');
const routes = require('./routes/userRoutes');

const live_url = "mongodb://dev_Samuel:Olateju+98@ac-fgwz52s-shard-00-00.n1fna5z.mongodb.net:27017,ac-fgwz52s-shard-00-01.n1fna5z.mongodb.net:27017,ac-fgwz52s-shard-00-02.n1fna5z.mongodb.net:27017/?ssl=true&replicaSet=atlas-o5qtrt-shard-0&authSource=admin&appName=Cluster0";
const local_url = "mongodb://localhost:27017/UserDB";

mongoose
.connect(live_url,)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error('Error connecting to MongoDB:', err));

// create express app
const app = express();
const port = 7777;
app.use(cors());
app.use(express.json());

// use routes
app.use('/api', routes);

app.get('/', (req, res) => {
    res.send('api is ready for use');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
