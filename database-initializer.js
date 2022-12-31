const fs = require("fs");
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
let db;

const vendors = [];
const suppliesArray = [];
const ratingConst = [-1,1];
let nxt;
nxt = 0;

//function that creates the data in the proper form and pushed into an array to be entered into the database

function createData(){
    console.log('in data creater');
    for (const vendor of vendors){
        const {name: vendorName, supplies} = vendor;
        console.log("Store: " + vendorName);
        console.log("---------------------------");
        for (const [category, item] of Object.entries(supplies)){
            console.log("Category: " +  category);
            console.log("---------------------------");
            for (const [key, value] of Object.entries(item)){
                const {name, stock, description, price} = value;
                const itemObject = {
                    _id: mongo.ObjectId(),
                    name: name, 
                    category: category,
                    vendor: vendorName,
                    price : price, 
                    stock: stock, 
                    rating: ratingConst, 
                    description: description
                }
                suppliesArray.push(itemObject);
            }
        }
    }
}

// read all three json files and connect to the mongo database

fs.readdir("./vendors", (err, files) => {
    
    if (err) return console.log(err);

    for (let i = 1; i < files.length; i++) {

        let vendorsNameRead = require("./vendors/" + files[i]);
        vendors.push(vendorsNameRead);

        nxt++;
    }
    // console.log(vendors);
    createData();
    MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true }, function (err, client){
        if(err) throw err;

        db = client.db('a4');
        db.dropCollection("supplies", function(err, result){
	        if(err){
			    console.log("Error dropping collection. Likely case: collection did not exist (don't worry unless you get other errors...)")
		    }else{
				console.log("Cleared cards collection.");
		    }

		    db.collection("supplies").insertMany(suppliesArray, function(err, result){
			    if(err) throw err;
			    console.log("Successfuly inserted " + result.insertedCount + " supplies.")
			    process.exit();
		    })
        });
        
    });
});

console.log("success");

