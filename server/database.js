var MongoDB 	= require("mongodb"),
	secret 		= require("./secret.js");

var API = module.exports = exports;

(function(mongo) {
	var Server		= mongo.Server(secret.db.url, secret.db.port)
		, Database	= mongo.Db(secret.db.name, Server, {safe: false});

	API.connect = function initMongoDB(cb) {
		console.log('Starting DB Connection');
		Database.open(function(err, db) {
			if(err) { return cb(err); }
			Database.authenticate(secret.db.user, secret.db.pass, cb);
			API.db = Database;
		});
	};

	// helpers
	API.finder = function APIfinder(collectName, searchObj, cb) {
	Database.collection(collectName, function(err, collection){
		collection.find(searchObj, {_id:0}, {safe:true}).sort({_id: -1})
			.toArray(function(err, docs){
				if(err) throw err
				cb(docs);
		});
	});
}


})(MongoDB);

