// Clarifai
const Clarifai = require('clarifai');
const app = new Clarifai.App({
    apiKey: '70a77ae9130e4aef8946431e48bdc317'
});

// Multer
var multer = require('multer');
var storage = multer.diskStorage({
    filename: function(req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

// Cloudinary
const cloudinary = require("cloudinary");
cloudinary.config({ 
    cloud_name: 'dxku2xjon', 
    api_key: '151736735698485', 
    api_secret: 'B7bEacvBQp8ihdI6HXK9WEeuK_Q'
});

// Handle Image Upload
const handleImageUpload = () => (req, res) => {
    console.log(req.files);
    const values = Object.values(req.files);
    const promises = values.map(image => cloudinary.uploader.upload(image.path));

    Promise
        .all(promises)
        .then(results => res.json(results));
}

// Handle API Call
const handleApiCall = () => (req, res) => {
	app.models.predict("a403429f2ddf4b49b307e318f00e528b", req.body.input)
	.then(data => {
		res.json(data);
	})
	.catch(err => res.status(400).json(-1));
}

// Handle Image
const handleImage = (db) => (req, res) => {
	const { id } = req.body;

	db("users")
		.where("id", "=", id)
		.increment("entries", 1)
		.returning("entries")
	.then( entries => {
		if(entries.length){
			res.json(entries);
		} else {
			res.status(400).json("Unable to get entries of user with id = " + id);
		}
	})
	.catch( err => res.status(400).json("Unable to get entries"));
}


module.exports = {handleImage, handleApiCall, handleImageUpload}