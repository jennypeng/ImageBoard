var replynum = 1000; //arbitrary reply num count start
exports.index = function(req, res){

    res.render('index', { title: 'CalChan' });
};
exports.expandpost = function(db){
    return function(req, res) {
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
        collection.find({ $query: {}, $orderby: { posted : 1 } },{},function(e,docs){
            res.render('posts', {
                "posts" : docs
            });
        });
    };
};
exports.pPosts = function(db, ppp) { //ppp is posts per page
    return function(req, res) {
        var collection = db.get('postcollection');
        collection.count({}, function(err, count){
           var pages = Math.ceil(count/ppp); 
            var index = count-(req.params.page)*ppp; //what index should it find from
            if(index < 0){ //WHAT IF ITS NOT DIVISIBLE BY PPP? 
                var temp = ppp+index;
                index = 0;
                collection.find({ $query: {}, $orderby: { posted : 1 } },{"skip": index, "limit": temp},function(e,docs){
                    res.render('posts', { //skip is the starting index, limit is how many to retrieve
                        "posts" : docs,
                        "pages" : pages
                    });
                });
            }
            else{
                collection.find({ $query: {}, $orderby: { posted : 1 } },{"skip": index, "limit": ppp},function(e,docs){
                 res.render('posts', {
                  "posts" : docs,
                  "pages" : pages
              });
             });
            }
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
        var time = datetime.getDate();
        var collection = db.get('postcollection');
        var ObjectId = require('mongodb').ObjectID;
        var fs = require('fs');
        fs.readFile(req.files.image.path, function (err, data) {
            var imageName = req.files.image.name
            if (!imageName) {
                replynum += 1;
                collection.update({_id: {$in: [ObjectId(id)]}}, {$set: {posted: time}});
                collection.update({_id: {$in: [ObjectId(id)]}},
                    {$push: {replies: {postnum: replynum, date: datetime, username: userName, reply: reply0}}

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
                    console.log(err);
                });
                collection.update({_id: {$in: [ObjectId(id)]}}, {$set: {posted: time}});
                collection.update({_id: {$in: [ObjectId(id)]}},
                    {$push: {replies: {postnum: replynum, imagePath: "/uploads/fullsize/"+imageName, date: datetime, username: userName, reply: reply0}}

                }, function (err, doc) {
                    if (err) {
                        res.send("There was a problem adding the information to the database.");
                    }
                    else {
                     replynum += 1;
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
            var newPath = __dirname+"\\uploads\\fullsize\\" + imageName;
            var thumbPath = __dirname+"\\uploads\\thumbs\\" + imageName;

          /// write file to uploads/fullsize folder
          fs.writeFile(newPath, data, function (err) {
            console.log(err);
        });

        // Get our form values. These rely on the "name" attributes
        var userName = req.body.username;
        if (!userName) userName = "Anonymous";
        var content = req.body.content;
        // Set our collection
        var collection = db.get('postcollection');
        var datetime = new Date();
        var current = datetime.getDate();
        // Submit to the DB
        collection.insert({
            "username" : userName,
            "content" : content,
            "imagePath" : "/uploads/fullsize/"+imageName,
            "date" : datetime,
            "posted" : current,
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
    });
}
}
var zip = require("node-native-zip");
exports.dlPosts = function(db) {
    return function(req, res) {
        var archive = new zip();
        var id = req.params.id;
        var collection = db.get('postcollection');
        var ObjectId = require('mongodb').ObjectID;
        collection.findOne({"_id": ObjectId(id)}, ["imagePath", "replies"],
            function(err, doc){
                if(err){res.send(err);}
                else{
                    var toBeZipped = [];
                    function parsePath(path){
                        return path.split("/").pop();
                    }
                    toBeZipped.push({"path": "routes"+doc.imagePath, "name":parsePath(doc.imagePath)});
                    for(var i = 0; i < doc.replies.length; i++){
                        toBeZipped.push({"path": "routes"+doc.replies[i].imagePath, "name": parsePath(doc.replies[i].imagePath)});
                    }
                    archive.addFiles(toBeZipped,
                        function(err){
                            if(err){
                                console.log(err);
                            }
                            else{
                                var buff = archive.toBuffer();
                                res.send(buff);
                            }
                        });
                }

            }
            );
}
}