
module.exports = function Photo(mongo, info, cb) {

	this.save = function() {
		mongo.db.collection("photos", function(err, collection){
		collection.find({}).sort({id:-1}).limit(1).each(function(err, doc){
			if(err) cb(err)
			if(doc) {
				info.id = doc.id+1;
				
				info.file = "photo_"+info.id+".jpg" // not really necessary
				//collection.insert(info, function(err, docs){
				//	if(err) cb(err)
					cb("photo saved")
				//});
			}
		});
	});
	}
}