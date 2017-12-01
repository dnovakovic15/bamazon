let mysql = require('mysql');
let inquirer = require('inquirer');

let con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Myfavri0te21',
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
            updateDB(param, result[0].item_id, result[0].stock_quantity, cost);
        }
    });
}

function updateDB(param0, param1, param2, param3){
    let sql = 'UPDATE products set ? WHERE ?';

    let newQuantity = param2 - param0;

    let info = [
        {
            stock_quantity: newQuantity,
        },
        {
            item_id: param1,
        }
    ]

    con.query(sql, info, function (err, result) {
        console.log('You Have Bought the Item!');
        console.log('Total Price($): ' + param3)
        con.end();
    }); 
}
