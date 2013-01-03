var mongo = require("./database.js"),
	email = require("./email.js");
			require('date-utils');

mongo.connect(function(msg) {
	if(msg == null)
		console.log("Mongo Connected!");
	else 
		console.log(msg);
});

// main page
exports.index = function index(req, res) {
	mongo.db.collection("specials", function(err, collection){
		collection.find({}, {_id:0}, {safe:true})
			.sort({_id: -1}).limit(1).each(function(err, doc){
			if(err) throw err
			var vars = {
				special: doc,
				photos: []
			}
			for (var i = 31; i >= 0; i--) {
				vars.photos.push("/photo/photo_"+i+".jpeg");
			}
			res.render('index', vars);
		});
	});
};

exports.menus = function menus(req, res) {
	res.sendfile('menus/winter13/'+req.params.type+'.pdf');
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

	if(req.body.type != undefined && req.body.type instanceof Array) {

		for(x in req.body.type) {
			obj.food.push({
				type: req.body.type[x], 
				desc: req.body.desc[x]
			})
		}
	} else {
		obj.food.push({
			type: req.body.type,
			desc: req.body.desc
		})
	}

	mongo.db.collection("specials", function(err, collection){
		collection.insert(obj, function(err, docs){
			if(err) throw err
			res.send(docs)
		});
	});
};

// email test
exports.email = function(req, res){
	email.send({ 
		name: "Otto",
		email: "ottosipe@gmail.com"
	} 
	// templates defined in /server/email/
	,'template.jade', function(msg) { 
		console.log(msg);
		res.send(msg);
	});
};

// db test
exports.db = function(req, res){
	mongo.db.collection("test", function(err, collection){
		collection.insert({ msg: "hello world" }, function(err, docs){
			if(err) throw err
			res.send(docs);
		});
	})
};

