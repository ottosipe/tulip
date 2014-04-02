var mongo 		= require("./database.js"),
	email 		= require("./email.js"),
	photo 		= require("./photo.js"),
	knox 		= require("knox"),
	date 		= require('date-utils'),
	fs 			= require('fs'),
	secret		= require('./secret.js');

var filestore = knox.createClient(secret.s3);
var MENU_BASE = 'menus/spring14/';

mongo.connect(function(msg) {
	if(msg == null)
		console.log("Mongo Connected!");
	else 
		console.log(msg);
});

// main page
exports.index = function index(req, res) {
	res.render('index');
};

exports.menus = function menus(req, res) {

  	res.setHeader('Content-Type', 'application/pdf');
	res.sendfile(MENU_BASE+req.params.type+'.pdf');
}

// admin page
exports.admin = function(req, res){
	res.render('admin');
};

// api
exports.special = function(req, res) {
	mongo.db.collection("specials", function(err, collection){
		collection.find({}, {_id:0}, {safe:true})
			.sort({_id: -1}).limit(1).each(function(err, doc){
			res.json(doc);
		});
	});
};

exports.addSpecial = function(req, res) {
	d = Date.today();
	var obj = {
		date: d.toFormat("DDDD, MMMM D"),
		quote: req.body.quote,
		person: req.body.person,
		food: []
	};

	// reorganize for db
	if(req.body.type != undefined && req.body.type instanceof Array) {
		for(x in req.body.type) {
			var item = {
				type: req.body.type[x], 
				desc: req.body.desc[x]
			};
			if (item.desc.length && item.type.length) {
				obj.food.push(item);
			}
		}
	} else {
		var item = {
			type: req.body.type, 
			desc: req.body.desc
		};
		if (item.desc.length && item.type.length) {
			obj.food.push(item);
		}
	}

  	mongo.db.collection("specials", function(err, collection){
		collection.insert(obj, function(err, docs){
			if(err) throw err
			res.send("Added Successfully")
		});
	});
};

exports.photos = function(req, res) {
	mongo.finder("photos", {}, function(docs) {
		res.send(docs);
	});
};

exports.photo = function(req, res) {
	// actually serve the photo here!!
	res.setHeader('Content-Type', 'image/jpeg');
	res.setHeader('Cache-Control', 'public, max-age=31536000');
	filestore.getFile('/photos/photo_'+req.params.id+'.jpeg', function(err, data){
	 	data.on('data', function(data) { res.write(data); });
    	data.on('end', function(chunk) { res.end(); });
	});
};

exports.photoBig = function(req, res) {
	// actually serve the photo here!!
	res.setHeader('Content-Type', 'image/jpeg');
	res.setHeader('Cache-Control', 'public, max-age=31536000');
	filestore.getFile('/photos/big/photo_'+req.params.id+'.jpeg', function(err, data){
	 	data.on('data', function(data) { res.write(data); });
    	data.on('end', function(chunk) { res.end(); });
	});
};

exports.addPhoto = function(req, res) {
	console.log(req.body);
    console.log(req.files);
	p = new photo(mongo, req.body, function(msg) {
		res.send(msg);
	});
	p.save();
};

exports.feedback = function(req, res) {
	var to = {
		subject: "Feedback - Tulip Noir",
		email: "ottosipe@gmail.com, dina@tulipnoircafe.com",
		reply: req.body.email
	};

	var info = req.body;
	info.date = Date.today().toFormat("DDDD, MMMM D, YYYY");
	email.send(to, info ,'feedback.jade', function(msg) { 
		console.log(msg);
		res.send("Thanks "+req.body.name+"! We value your opinion.")
	});

	mongo.db.collection("feedback", function(err, collection){
		collection.insert(info, function(err, docs){
			if(err) throw err
		});
	});
};

exports.apply = function(req, res) {
	var to = {
		subject: "Job App - Tulip Noir - " + req.body.name,
		email: "ottosipe@gmail.com, dina@tulipnoircafe.com",
		reply: req.body.email
	};

	var info = req.body;
	info.date = Date.today().toFormat("DDDD, MMMM D, YYYY");
	
	email.send(to, info ,'application.jade', function(msg) { 
		console.log(msg);
		res.send("Thanks for your application, "+req.body.name+"!")
	});

	mongo.db.collection("job_apps", function(err, collection){
		collection.insert(info, function(err, docs){
			if(err) throw err
		});
	});
};
