document.getElementById("incStock").addEventListener("click", Stock);
document.getElementById("Sale").addEventListener("click", Sale);


function Stock(){

    //get all data

    let req = new XMLHttpRequest;
    let itemVendor = document.getElementById("bulkItemVendor").value;
    let itemCategory = document.getElementById("bulkItemCat").value;
    let itemStock = document.getElementById("bulkItemStock").value;

    let stockInt = parseFloat(itemStock);

    //validation check

    if(itemVendor==="" || itemStock===""){
        alert("Vendor and Stock need to be at least filled");
        return;
    }

    if(isNaN(stockInt)){
        alert("Stock field is empty or needs to be a number");
        return;
    }

    //send data

    let urlAdd = "?vendor=" + itemVendor + "&category=" + itemCategory + "&stock=" + stockInt; 

    let url = "http://localhost:3000/bulk" + urlAdd;

    console.log(url);

    req.open("PUT", url);
    req.send();
    redirect();
}

function Sale(){

    let req = new XMLHttpRequest;

    //get data

    let itemVendor = document.getElementById("bulkItemVendor").value;
    let itemCategory = document.getElementById("bulkItemCat").value;
    let itemSale = document.getElementById("bulkItemSale").value;

    //validation check

    let saleInt = parseFloat(itemSale);
    let sale = 1 - (saleInt/100);

    if(itemVendor==="" || itemSale===""){
        alert("Vendor and Sale percent need to be at least filled");
        return;
    }

    if(isNaN(saleInt)){
        alert("Sale percentage field is empty or needs to be a number");
        return;
    }

    if(saleInt > 100 || saleInt< 0){
        alert("Sale percentage need to be between 0-100");
        return;
    }

    //send Data

    let urlAdd = "?vendor=" + itemVendor + "&category=" + itemCategory + "&sale=" + sale; 

    let url = "http://localhost:3000/sale" + urlAdd;

    console.log(url);

    req.open("PUT", url);
    req.send();
    redirectSales();
    
}

function redirect(){
    alert("We have updated the filtered Items Stock");
    window.location.href = "/home";
}

function redirectSales(){
    alert("We have placed the filtered items on sale");
    window.location.href = "/home";
}