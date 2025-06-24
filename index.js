const express = require('express')
const app = express()
const port = process.env.PORT || 4000
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.COFFEE_USER}:${process.env.COFFEE_PASS}@cluster0.ft0um.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();

        const database = client.db("coffeedb");
        const coffeeCollection = database.collection("coffees");

        app.get("/coffees", async (req, res) => {
            const cursor = coffeeCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get("/coffees/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await coffeeCollection.findOne(query)
            res.send(result)
            console.log("details id : ", id)
        })

        app.post("/coffees", async (req, res) => {
            const coffee = req.body
            const result = await coffeeCollection.insertOne(coffee)
            res.send(result)
            console.log("new cofee from client site :", coffee)
        })

        app.put("/coffees/:id", async (req, res) => {
            const id = req.params.id
            const coffee = req.body
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: coffee.name,
                    chef: coffee.chef,
                    supplier: coffee.supplier,
                    taste: coffee.taste,
                    category: coffee.category,
                    details: coffee.details,
                    photo: coffee.photo
                }
            }
            const result = await coffeeCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })

        app.delete("/coffees/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) };
            const result = await coffeeCollection.deleteOne(query);
            res.send(result)
            console.log("delete this id :", id)
        })

        console.log("express server connect in mongodb")
    } finally {


    }
}
run().catch(console.dir);





app.get("/", (req, res) => {
    res.send("hello world")
})

app.listen(port, () => {
    console.log(`express server running port :`, port)
})