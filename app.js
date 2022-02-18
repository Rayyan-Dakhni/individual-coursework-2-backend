const express = require('express');
require('dotenv').config();
const mongodb = require('mongodb');

const cors = require('cors');
const { MongoClient } = require('mongodb');

const logger = require('./middleware/logger');

const app = express();

var db;

const port = process.env.PORT;
const mongo_url = process.env.MONGO_URI;

app.use(express.json())
app.use(cors());

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     next();
// })

app.use(express.static('images'))

// routes for lessons
app.post('/lesson', logger, (req, res) => {
    db.collection('lessons').insertOne(req.body, (err, result) => {
        if (err) throw err;
        res.send(result);
    })
})
app.get('/lessons', logger, (req, res) => {
    db.collection('lessons').find({}).toArray((err, result) => {
        res.send(result);
    })
})
app.put('/lesson/:id', (req, res) => {
    const { spaces } = req.body;
    const updatedData = { $set: { spaces } }
    db.collection('lessons').findOneAndUpdate({ _id: new mongodb.ObjectId(req.params.id) }, updatedData)
        .then(obj => {
            res.send(obj);
        })
})

app.post('/order', logger, (req, res) => {

    db.collection('orders').insertOne(req.body, (err, result) => {
        if (err) throw err;
        res.send(result);
    })
})
app.get('/orders', logger, (req, res) => {
    db.collection('orders').find({}).toArray((err, result) => {
        res.send(result);
    })
})

app.get('/search/:value', logger, (req, res) => {
    const value = req.params.value;

    console.log(value)

    const query = { $text: { $search: `${value}`, $caseSensitive: false } }

    db.collection('lessons').find(query).toArray((err, result) => {
        if (err) throw err;
        res.send(result);
    })
})

app.use((req, res) => {
    res.send({
        "error": "Bad Request"
    })
})

app.listen(port, () => {
    console.log(`server listening on port: ${port}`);

    MongoClient.connect(mongo_url, (err, client) => {
        if (err) throw err;
        console.log('database connected!!');

        db = client.db('Individual-Coursework-Mdx')
    })


})