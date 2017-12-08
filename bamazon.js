let mysql = require('mysql');
let inquirer = require('inquirer');

let con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '*',
    database: 'bamazon'
});

initializeConnection();

displayAll(askQuestion);

function displayAll(callback){
    let sql = `SELECT * FROM products`;

    con.query(sql, function (err, result) {
        for(let i = 0; i < result.length; i++){
            console.log('#: ' + result[i].item_id);
            console.log('Product Name: ' + result[i].product_name);
            console.log('Departement: ' + result[i].department_name);
            console.log('Price($): ' + result[i].price);
            console.log('Quantity: ' + result[i].stock_quantity);
            console.log('----------------------------------');
        }
        callback();
    });
}



function askQuestion(){
    inquirer.prompt([
    {
        name: 'id',
        message: 'Please provide an item identification #: '
    },
    {
        name: 'quantity',
        message: 'Please provide a quantity amount #: '
    }

    ]).then(function(answer){
        let sql = 'SELECT * FROM products WHERE item_id=' + answer.id;
        queryItem(sql, answer.quantity);
    });
}

function initializeConnection(){
    con.connect(function(err) {
        if (err) throw err;
    });
}

function queryItem(sql, param){
    con.query(sql, function (err, result) {

        if(param > result[0].stock_quantity){
            console.log('Insufficient quantity!');
        }
        else{
            let cost = param * result[0].price;
            updateDB(param, result[0].item_id, result[0].stock_quantity, cost, result[0].product_sales, result[0].price);
        }
    });
}

function updateDB(amountPurchased, itemID, stockQuantity, cost, productSales, individualCost){
    let sql = 'UPDATE products set ? WHERE ?';

    let newQuantity = stockQuantity - amountPurchased;

    let info = [
        {
            stock_quantity: newQuantity,
        },
        {
            item_id: itemID,
        }
    ]

    con.query(sql, info, function (err, result) {
        console.log('You Have Bought the Item!');
        console.log('Total Price($): ' + cost)
    }); 

    updateSales(amountPurchased, individualCost, productSales, itemID);
}

function updateSales(amountPurchased, cost, productSales, itemID){
    let sql = 'UPDATE products set ? WHERE ?';

    console.log('amount:' + amountPurchased);
    console.log('price: ' + cost);

    let newSales = productSales + (cost * amountPurchased);

    let info = [
        {
            product_sales: newSales,
        },
        {
            item_id: itemID,
        }
    ]

    con.query(sql, info, function (err, result) {
        console.log('Products Sales Updated!');
        con.end();
    }); 
}
