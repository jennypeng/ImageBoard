
exports.index = function(req, res){

	res.render('index', { title: 'Express' });
};
exports.expandpost = function(db){
	return function(req, res) {
		console.log(req.params.id + "dafdfadf");
		var collection = db.get('postcollection');
		var ObjectId = require('mongodb').ObjectID;
		collection.find({_id: {$in: [ObjectId(req.params.id)]}},{}, function(e,docs){
			res.render('expandpost', {
				"posts" : docs
			});
		});
	};

};
//posts page
exports.posts = function(db) {
	return function(req, res) {
		var collection = db.get('postcollection');
		collection.find({},{},function(e,docs){
			res.render('posts', {
				"posts" : docs
			});
		});
	};
};

//add a post
exports.newpost = function(req, res){
	res.render('newpost', { title: 'Add New Post' });
};
//reply form
exports.addreply = function(db) {
	return function(req, res) {
		var userName = req.body.username;
		if (!userName) userName = "Anonymous";
		var reply0 = req.body.reply;
		var id = req.params.id;
		var datetime = new Date();
		var collection = db.get('postcollection');
		var ObjectId = require('mongodb').ObjectID;
		var fs = require('fs');
		fs.readFile(req.files.image.path, function (err, data) {
			var imageName = req.files.image.name
			if (!imageName) {

				collection.update({_id: {$in: [ObjectId(id)]}},
					{$push: {replies: {date: datetime, username: userName, reply: reply0}}

				}, function (err, doc) {
					if (err) {
						res.send("There was a problem adding the information to the database.");
					}
					else {
						res.location("post/" + id); 
						res.redirect("post/" + id);
					}
				});
			} else {
				var newPath = __dirname+"\\uploads\\fullsize\\" + imageName;
				var thumbPath = __dirname+"\\uploads\\thumbs\\" + imageName;

				fs.writeFile(newPath, data, function (err) {
					var im = require('imagemagick');
					im.resize({
						srcPath: newPath,
						dstPath: thumbPath,
						width: 200
					}, function(err, stdout, stderr) {
						if (err) console.log(err);
					});
					console.log(err);
				});
				collection.update({_id: {$in: [ObjectId(id)]}},
					{$push: {replies: {imagePath: "/uploads/fullsize/"+imageName, date: datetime, username: userName, reply: reply0}}

				}, function (err, doc) {
					if (err) {
						res.send("There was a problem adding the information to the database.");
					}
					else {
						res.location("post/" + id); 
						res.redirect("post/" + id);
					}
				});

			}
		});

	}
}
//post form 
exports.addpost = function(db) {
	return function(req, res) {
		// Image uploading
		var fs = require('fs');
		fs.readFile(req.files.image.path, function (err, data) {
			var imageName = req.files.image.name
		///for error handling change to !imageName
		if(!imageName){
			var collection0 = db.get('postcollection');
			var datetime0 = new Date();
			var userName0 = req.body.username;
			if (!userName0) userName0 = "Anonymous";
			var content0 = req.body.content;
			collection0.insert({
				"username" : userName0,
				"content" : content0,
				"date" : datetime0,
				"replies" : []
			}, function (err, doc) {
				if (err) {
				// If it failed, return error
				res.send("There was a problem adding the information to the database.");
			}
			else {
				// If it worked, set the header so the address bar doesn't still say /adduser
				res.location("posts");
				// And forward to success page 
				res.redirect("posts");
			}
		});

		} else {

			var newPath = __dirname+"\\uploads\\fullsize\\" + imageName;
			var thumbPath = __dirname+"\\uploads\\thumbs\\" + imageName;

		  /// write file to uploads/fullsize folder
		  fs.writeFile(newPath, data, function (err) {
		  	var im = require('imagemagick');
		  	im.resize({
		  		srcPath: newPath,
		  		dstPath: thumbPath,
		  		width: 200
		  	}, function(err, stdout, stderr) {
		  		if (err) console.log(err);
		  	});
		  	console.log(err);
		  });

		// Get our form values. These rely on the "name" attributes
		var userName = req.body.username;
		if (!userName) userName = "Anonymous";
		var content = req.body.content;
		var imgur = require('imgur-upload'),
		path = require('path');
		imgur.setClientID("688fc5624327359");
		var temp;
		imgur.upload(newPath,function(err, res){
			temp = res.data.link;
    		console.log(temp); //log the imgur url
    	});
		// Set our collection
		var collection = db.get('postcollection');
		var datetime = new Date();
		// Submit to the DB
		collection.insert({
			"username" : userName,
			"content" : content,
			"imagePath" : "/uploads/fullsize/"+imageName,
			"date" : datetime,
			"replies" : []
		}, function (err, doc) {
			if (err) {
				// If it failed, return error
				res.send("There was a problem adding the information to the database.");
			}
			else {
				// If it worked, set the header so the address bar doesn't still say /adduser
				res.location("posts");
				// And forward to success page 
				res.redirect("posts");
			}
		});

	}
});
}
}