const express = require('express')
const app = express();
require('dotenv').config()
const cors = require('cors')
const port = process.env.PORT || 5000;



app.use(cors());
app.use(express.json())




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mbkwd8x.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)

        const toyCollection = client.db("toyCars").collection("toys")

        /**
         * =======================================
         * Get Toy Cars Data From Mongo DB
         * =======================================
         */

        // app.get('/toys', async (req, res) => {
        //     const result = await toyCollection.find().toArray();
        //     res.send(result)
        // })

        app.get('/toys',async(req,res)=>{
            const cursor = toyCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/toys/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id)}
            const result = await toyCollection.findOne(query);
        
            res.send(result)
        })

        app.get("/toyss", async (req, res) => {
            let query = {};
            if (req.query?.email) {
                query = { sellerEmail: req.query?.email }
            }
            const result = await toyCollection.find(query).toArray()
            res.send(result);

        })


        app.post('/toys', async (req, res) => {
            const newItem = req.body;
            const result = toyCollection.insertOne(newItem)
            res.send(result)
        })


        app.delete('/toys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = toyCollection.deleteOne(query)
            res.send(result)
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})