const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const app = express();

app.use(cors());
app.use(bodyParser.json());

const port = 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e8uzr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect((err) => {
	const serviceCollection = client.db("creativeAgency").collection("serviceCollection");
	const orderCollection = client.db("creativeAgency").collection("orderCollection");
	const reviewCollection = client.db("creativeAgency").collection("reviewCollection");
	console.log("DB connected 🚀");

	/* API: Getting Services Data on home page */
	app.get("/home/services", (req, res) => {
		serviceCollection.find({}).toArray((err, docs) => {
			res.send(docs);
		});
	});

	/* API: Getting Review Data on home page */
	app.get("/home/reviews", (req, res) => {
		reviewCollection.find({}).toArray((err, docs) => {
			res.send(docs);
		});
	});

	/* API: Add Review */
	app.post("/addReview", (req, res) => {
		const newReview = req.body;
		reviewCollection.insertOne(newReview).then((result) => {
			console.log(result, "Added new review ✅");
			res.send(result.insertedCount > 0);
		});
	});

	/* API: Add order */
	app.post("/addOrder", (req, res) => {
		const newOrder = req.body;
		orderCollection.insertOne(newOrder).then((result) => {
			console.log(result, "Added new order ✅");
			res.send(result.insertedCount > 0);
		});
	});

	/* API: Getting service list */
	app.get("/serviceList", (req, res) => {
		orderCollection.find({ email: req.query.email }).toArray((error, documents) => {
			res.send(documents);
		});
	});

	/* API : get all service list */
	app.get("/admin/serviceList", (req, res) => {
		orderCollection.find({}).toArray((error, documents) => {
			res.send(documents);
		});
	});
});

/* API : Default */
app.get("/", (req, res) => {
	res.send("Hello from Express, API is working 👨🏻‍💻");
});

app.listen(process.env.PORT || port);
