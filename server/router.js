var mongo 		= require("./database.js"),
	email 		= require("./email.js"),
	knox 		= require("knox"),
	date 		= require('date-utils');

var filestore = knox.createClient({
    key: 'AKIAICEJ3HEXPY5KB7OQ'
  , secret: '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'
  , bucket: 'tulipnoir'
});

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

  	res.setHeader('Content-Type', 'image/jpeg');
	res.sendfile('menus/winter13/'+req.params.type+'.pdf', {maxAge:100000});
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
			res.send(docs)
		});
	});
};

exports.photos = function(req, res) {
	/*mongo.db.collection("photos", function(err, collection){
		for(var i = 0; i < 32; i++) {
			(function(i){ 
				var obj = {
					id: i,
					file: "photo_"+i+".jpg",
					comment: "none"
				}
				collection.insert(obj, function(err, docs){
					if(err) throw err
					res.send(docs)
				});
			})(i);
		}
	});*/
	mongo.finder("photos", {}, function(docs) {
		res.send(docs);
	});
};

exports.photo = function(req, res) {
	// actually serve the photo here!!
	
	filestore.getFile('/photos/photo_'+req.params.id+'.jpeg', function(err, data){
	 	data.on('data', function(data) { res.write(data); });
    	data.on('end', function(chunk) { res.end(); });
	});
};

exports.addPhoto = function(req, res) {

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


