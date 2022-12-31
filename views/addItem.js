document.getElementById("addNewItem").addEventListener("click", addItem);

function addItem (){

    //get all data from pug page

    let req = new XMLHttpRequest;
    let itemName = document.getElementById("newItemName").value;
    let itemCategory = document.getElementById("newItemCat").value;
    let itemVendor = document.getElementById("newItemVen").value;
    let price = document.getElementById("newItemPrice").value;
    let stock = document.getElementById("newItemStock").value;
    let desc = document.getElementById("newItemDesc").value;
    let rating = [-1,1];

    //make sure all number fields are numbers
    let priceInt = parseFloat(price);
    let stockInt = parseFloat(stock);

    //validation check

    if(itemName==="" || itemCategory==="" || itemVendor==="" || price ==="" || stock==="" || desc===""){
        alert("Some fields empty");
        return;
    }

    if(isNaN(priceInt)){
        alert("Price field is empty or is not a number");
        return;
    }

    if(isNaN(stockInt)){
        alert("Stock field is empty or needs to be a number");
        return;
    }

    //send data

    let urlAdd = "?name=" + itemName + "&category=" + itemCategory + "&vendor=" + itemVendor + "&price=" + priceInt + "&stock=" + stockInt + "&description=" + desc + "&rating=" + rating;

    let url = "http://localhost:3000/items" + urlAdd;

    console.log(url);

    

    req.open("POST", url);
    req.send();
    
    redirect(itemName);

}

//redirect to correct page

function redirect(itemName){
    let req = new XMLHttpRequest();

    req.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            alert("Item has been added");
            window.location.href = "/items/" + req.responseText;
        }
    }
    req.open("GET", "/redirect?name=" + itemName);
    req.send();
}