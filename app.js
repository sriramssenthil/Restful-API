const bodyParser = require("body-parser");
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("static-files"));

mongoose.connect("mongodb://localhost:27017/musicDB", {useNewURLParser: true});

const itemSchema = {
    title: String,
    content: String
};

const Item = mongoose.model("Item", itemSchema);

app.route("/items")

.get(function(req, res){
    Item.find(function(err, found){
        if (err){
            res.send(err);
        } else {
            res.send(found);
        }
    });
})

.post(function(req, res){
    const newItem = new Item({
        title: req.body.title,
        content: req.body.content
    });

    newItem.save(function(err){
        if(err){
            res.send(err);
        } else {
            res.send("Added new item");
        }
    });
})

.delete(function(req, res){
    Item.deleteMany(function(err){
        if(err){
            res.send(err);
        } else {
            res.send("Deleted all items");
        }
    })
});



//Specific
app.route("/items/:itemTitle")

.get(function(req, res){
    Item.findOne({title: req.params.itemTitle}, function(err, found){
        if (err){
            res.send(err);
        } else {
            res.send(found);
        }
    });
})

.put(function(req, res){
    Item.update({title: req.params.itemTitle},
        {title: req.body.title, content:req.body.content},
        {overwrite: true},
        function(err){
            if(err){
                res.send(err)
            } else{
                res.send("Updated article")
            }
        });
})

.patch(function(req, res){
    Item.updateOne({title: req.params.itemTitle},
        {$set: req.body},
        function(err){
            if(err){
                res.send(err)
            } else{
                res.send("Updated article")
            }
        });
})

.delete(function(req, res){
    Item.deleteOne({title: req.params.itemTitle},
        function(err){
        if(err){
            res.send(err);
        } else {
            res.send("Deleted all items");
        }
    })
});


app.listen(3000, function(){
    console.log("Running on port 3000");
});
