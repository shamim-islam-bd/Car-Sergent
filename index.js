const express = require('express');
const app = express();
const port = 5000;
const ObjectId = require('mongodb').ObjectId;

// Simple Usage (Enable All CORS Requests)
const cors = require("cors");
//middloe arire
app.use(cors());
app.use(express.json());

// dotenv file for secure password.
require('dotenv').config()

// used password & database name is .env.
// pass : 5HZeCRO7xLpRBD70
// db : car-machanism

const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u6fw9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  // client.close();
});


// Main work start from here
// insert function

async function run() {

  try {
    await client.connect();
    // console.log("Connected to Mongo");

    const database = client.db("car-machanism");
    const Allservice = database.collection("services");
    
 
  // POST API..................  
  app.post("/services", async (req, res) => { 
    const service = req.body;
    console.log("hit the api", service);
    res.send("post hitted")

    const result = await Allservice.insertOne(service);
    console.log(result);
  });


   // GET API............
   app.get("/services", async (req, res) => {
    const cursor = Allservice.find({});  // for show all services useing empty object. ({})
    const services = await cursor.toArray();
    res.send(services);
   })

  
  // Get Single Service (Dybamic id for showing single data.)
  app.get("/services/:id", async (req, res) => {
    const id = req.params.id; // if i wanna use id, i have to declare objectID in top.
    console.log('getting single service', id);
    const query = { _id: ObjectId(id) };
    const services = await Allservice.findOne(query);
    res.json(services);
  })


  // DELETE API 
  app.delete('/services/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await Allservice.deleteOne(query);
    res.json(result);
  })


  } catch {
    // await client.close(); 
  }

}
run().catch(console.dir);











// req patabe then kisu akta return patabo,
//as return - params, query, body.data, header dite pare
app.get('/', (req, res) => {
  res.send('Running Genius Server!')
});

app.listen(port, () => {
    console.log('Running server port :', port )
});

