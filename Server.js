// require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const formData = require('express-form-data');

const register = require("./controllers/register.js");
const signin = require("./controllers/signin.js");
const profile = require("./controllers/profile.js");
const image = require("./controllers/image.js");

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(formData.parse());

const db = knex({
	client: 'pg',
	connection: {
		connectionString: process.env.DATABASE_URL,
		ssl: {
			rejectUnauthorized: false
		}
		// host : '127.0.0.1',
		// user : 'postgres',
		// password : 'database',
		// database : 'projek-abw'
	}
});

app.get("/", (req, res) => {
	res.send("Welcome");
});
app.post("/signin", signin.handleSignIn(db, bcrypt));
app.post("/register", register.handleRegister(db, bcrypt));
app.get("/profile/:id", profile.handleProfile(db));
app.put("/image", image.handleImage(db));
app.post("/imageurl", image.handleApiCall());
app.post("/image-upload", image.handleImageUpload());

app.get("*", (req, res) => {
	res.send("Sorry, there's nothing here :(");
});

app.listen(process.env.PORT || 3000, function(){
	console.log("Server starts");
});

// app.listen(3000, function(){
// 	console.log("server starts");
// });