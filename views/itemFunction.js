document.getElementById("update").addEventListener("click", updateItem);
document.getElementById("delete").addEventListener("click", deleteItem);

function updateItem(){

    let req = new XMLHttpRequest;

    //get all data from pug page

    let id = document.title;
    let itemName = document.getElementById("itemName").value;
    let itemCategory = document.getElementById("itemCat").value;
    let itemVendor = document.getElementById("itemVen").value;
    let price = document.getElementById("itemPrice").value;
    let stock = document.getElementById("itemStock").value;
    let desc = document.getElementById("itemDesc").value;
    let rating = document.getElementById("itemRating").value;

    //validation check


    let priceInt = parseFloat(price);
    let stockInt = parseFloat(stock);
    let ratingInt = parseInt(rating);


    if(isNaN(priceInt)){
        alert("Price field is empty or is not a number");
        return;
    }

    if(isNaN(stockInt)){
        alert("Stock field is empty or needs to be a number");
        return;
    }

    if(isNaN(ratingInt)){
        alert("rating field needs to be filled with a number between 0 and 5");
        return;
    }

    if((ratingInt<0 || ratingInt>5) && ratingInt!=""){
        alert("Rating needs to be between 0 and 5");
        return;
    }

    //send data

    let urlAdd = "?name=" + itemName + "&category=" + itemCategory + "&vendor=" + itemVendor + "&price=" + priceInt + "&stock=" + stockInt + "&description=" + desc + "&rating=" + ratingInt;

    let url = "http://localhost:3000/items/" + id + urlAdd;

    console.log(url);

    

    req.open("PUT", url);
    req.send();
    
    redirect();


}

//redirect function for each button

function redirect(){
    alert("Item has been updated");
    window.location.href = "/home";
}

function redirectDelete(){
    alert("Item has been Deleted");
    window.location.href = "/items";
}


function deleteItem(){

    let req = new XMLHttpRequest;

    let id = document.title;
    let itemName = document.getElementById("itemName").value;


    let urlAdd = "?name=" + itemName
    let url = "http://localhost:3000/items/" + id + urlAdd;


    req.open("DELETE", url);
    req.send();

    redirectDelete();


}