//Create express app
const express = require('express');
let app = express();

//Database variables
let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;
let db;

//View engine
app.set("view engine", "pug");
app.use(express.static("public"));
app.use(express.static("views"));

//routes
app.get(["/", "/home"], homePage);
app.get("/items", itemPage);
app.get("/additem", addItemPage);
app.get("/items/:thatItemsUniqueID", item);
app.put("/items/:thatItemsUniqueID", updateItem);
app.delete("/items/:thatItemsUniqueID", DeleteItem);
app.post("/items", addItem);
app.get("/redirect", redirectPage);
app.get("/bulk", addBulkPage);
app.put("/bulk", Stock);
app.put("/sale", Sale);



//Homepage GET request 
function homePage(request, response) {
    response.render("home");
}

//Itempage Get request

function itemPage(request, response){

    db.collection("supplies").find().toArray(function(err,supplies){
        if(err)throw err;

        response.render("itemPage", {supplies: supplies});
    });
    
    
}

//Get each item custom page 
function item(request, response){
    let id;
    let star = 0;

    try{
		id = new mongo.ObjectId(request.params.thatItemsUniqueID);
	}catch{
		response.status(404).send("Unknown ID");
		return;
	}


    //use findone to find the correct item and display the correct information
    db.collection("supplies").findOne({"_id":id}, function(err, result){
		if(err){
			response.status(500).send("Error reading database.");
			return;
		}
		if(!result){
			response.status(404).send("Unknown ID");
			return;
		}

        let length = result.rating.length;


        

        for(let i=0; i<(length); i++ ){
            star = star + result.rating[i];
        }

        if(result.rating.length === 2){
            star = "None";
        }
        else{
            star = star/ ((result.rating.length)-2);
        }


		response.status(200).render("item", {result, star});
	});

}


//Put Request to replace an Item 
function updateItem(request, response) {


    let oldRating;
    let id = mongo.ObjectId(request.params.thatItemsUniqueID);

    let itemUpdateName1;
    let itemUpdateCategory;
    let itemUpdateVendor;
    let itemUpdatePrice;
    let itemUpdateStock;
    let itemUpdateRating;
    let itemUpdateDesc;

    let itemOriginal;

    //first we need to find the item we want to replace
    db.collection("supplies").findOne({"_id":id}, function(err, result){
		if(err){
			response.status(500).send("Error reading database.");
			return;
		}
		if(!result){
			response.status(404).send("Unknown ID");
			return;
		}

        itemOriginal= result.name;
        oldRating = result.rating;

        //setting up all the new information to replace the old information


        if(request.query.name){
            itemUpdateName1 = request.query.name;
        }
    
        if(request.query.category){
            itemUpdateCategory = request.query.category;
        }
    
        if(request.query.vendor){
            itemUpdateVendor = request.query.vendor;
        }
    
        if(request.query.price){
            itemUpdatePrice = parseInt(request.query.price);
        }
    
        if(request.query.stock){
            itemUpdateStock = parseInt(request.query.stock);
        }
    
        if(request.query.rating){
            itemUpdateRating = oldRating
            itemUpdateRating.push(parseInt(request.query.rating));
        }
    
        if(request.query.description){
            itemUpdateDesc = request.query.description;
        }


        //replace old with new

        db.collection("supplies").replaceOne({name:itemOriginal},{name:itemUpdateName1, category:itemUpdateCategory, vendor:itemUpdateVendor, price:itemUpdatePrice, stock:itemUpdateStock, rating:itemUpdateRating, description:itemUpdateDesc },{upsert: true}, function(err, replacement){
            if(err){
                response.status(500).send("Error reading database.");
                return;
            }
            if(!replacement){
                response.status(404).send("Unknown ID");
                return;
            }
            
           response.status(201).send("Created");

            db.collection("supplies").find().toArray(function(err,supplies){
                if(err)throw err;
        
                response.render("itemPage", {supplies: supplies});
            });
            
        });
    

	});



}

//Put Request to delete an item
function DeleteItem(request, response){

    let itemUpdateName2 = request.query.name;

    db.collection("supplies").deleteOne({name:itemUpdateName2}, function(err, replacement){
        if(err){
            response.status(500).send("Error reading database.");
            return;
        }
        if(!replacement){
            response.status(404).send("Unknown ID");
            return;
        }
        response.status(201).send("Created");
    });

}

//Get Request for the add Item Page
function addItemPage(request, response){
    response.render("newItem");
}

//Post request to add one item into the data base
function addItem(request, response){
    
    let itemUpdateName1;
    let itemUpdateCategory;
    let itemUpdateVendor;
    let itemUpdatePrice;
    let itemUpdateStock;
    let itemUpdateRating = [1,-1];
    let itemUpdateDesc;

    //Get all the information ready for database

    if(request.query.name){
        itemUpdateName1 = request.query.name;
    }

    if(request.query.category){
        itemUpdateCategory = request.query.category;
    }

    if(request.query.vendor){
        itemUpdateVendor = request.query.vendor;
    }

    if(request.query.price){
        itemUpdatePrice = parseInt(request.query.price);
    }

    if(request.query.stock){
        itemUpdateStock = parseInt(request.query.stock);
    }


    if(request.query.description){
        itemUpdateDesc = request.query.description;
    }

    //add to the collection by using insert one

    db.collection("supplies").insertOne({name:itemUpdateName1, category:itemUpdateCategory, vendor:itemUpdateVendor, price:itemUpdatePrice, stock:itemUpdateStock, rating:itemUpdateRating, description:itemUpdateDesc },function(err, replacement){
        if(err){
            response.status(500).send("Error reading database.");
            return;
        }
        if(!replacement){
            response.status(404).send("Unknown ID");
            return;
        }
        
       response.status(201).send("Created");
        
    });


}

//since i cannot redirect in the client since the mongo ID is not created. I made a redirect function to load the new item page
function redirectPage(request, response){
    let itemName = request.query.name;
    let itemID;

    db.collection("supplies").findOne({name:itemName},function(err, result){
        if(err){
            response.status(500).send("Error reading database.");
            return;
        }
        if(!result){
            response.status(404).send("Unknown ID");
            return;
        }
        
       

       itemID = result._id;

       response.send(itemID.toString());
       response.status(201);
        
    });


}

//Get request for the bulk page
function addBulkPage(request, response){
    response.render("bulkPage");
}


//Put request to increase stock of filtered items
function Stock(request, response){
    
    console.log("hi");

    let items = {};
    let itemStock = {};

    //data need to filter items

    if(request.query.vendor){
		items["vendor"] = {"$regex" : ".*" + request.query.vendor + ".*", "$options": "i"};
	}

    if(request.query.category){
		items["category"] = {"$regex" : ".*" + request.query.category + ".*", "$options": "i"};
	}

    if(request.query.stock){
		itemStock["$lt"] = parseInt(request.query.stock);
	}

    if(request.query.stock){
		items["stock"] = itemStock;
	}

    //use find to find all items with correct filter

    db.collection("supplies").find(items).toArray(function(err, itemsArray){
		if(err){
            response.status(500).send("Error reading database.");
            return;
        }
        if(!itemsArray){
            response.status(404).send("Unknown ID");
            return;
        }

		if (itemsArray.length === 0){
			response.status(201).send("No Matching Items");
			
		}

        console.log(itemsArray);

        //use a for loop to loop the array and update the stock one item at a time

        for(let i =0; i<itemsArray.length; i++){
            db.collection("supplies").updateOne({name:itemsArray[i].name},{$inc: {stock: 5}},function(err, replacement){
                if(err){
                    response.status(500).send("Error reading database.");
                    return;
                }
                if(!replacement){
                    response.status(404).send("Unknown ID");
                    return;
                }

                
            });

            
        }
		

	});


}

//Put request to put items on sale
function Sale(request, response){
    console.log("hi");

    let items = {};
    let sale = request.query.sale;

    // get correct filter data

    if(request.query.vendor){
		items["vendor"] = {"$regex" : ".*" + request.query.vendor + ".*", "$options": "i"};
	}

    if(request.query.category){
		items["category"] = {"$regex" : ".*" + request.query.category + ".*", "$options": "i"};
	}

    //find all items to put on sale

    db.collection("supplies").find(items).toArray(function(err, itemsArray){
		if(err){
            response.status(500).send("Error reading database.");
            return;
        }
        if(!itemsArray){
            response.status(404).send("Unknown ID");
            return;
        }

		if (itemsArray.length === 0){
			response.status(201).send("No Matching Items");
			
		}

        console.log(itemsArray);
        
        // put each item in the array on sale
        for(let i =0; i<itemsArray.length; i++){
            db.collection("supplies").updateOne({name:itemsArray[i].name},{$set: {price: ((itemsArray[i].price)*sale)}},function(err, replacement){
                if(err){
                    response.status(500).send("Error reading database.");
                    return;
                }
                if(!replacement){
                    response.status(404).send("Unknown ID");
                    return;
                }

                
            });

            
        }
		

	});

}


// Initialize database connection
MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true }, function(err, client) {
  if(err) throw err;

  //Get the t8 database
  db = client.db('a4');

  // Start server once Mongo is initialized
  app.listen(3000);
  console.log("Listening on port 3000");
});