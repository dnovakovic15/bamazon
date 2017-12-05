let inquirer = require('inquirer');
let mysql = require('mysql');

let con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Myfavri0te21',
    database: 'bamazon'
});

askQuestion();

function askQuestion(){
    inquirer.prompt([
    {
        name: 'id',
        type: 'list',
        message: 'Please select an option: ',
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
    }

    ]).then(function(answer){
        initializeConnection();

        switch(answer.id){
            case 'View Products for Sale':
                displayAll();
                break;
            case 'View Low Inventory':
                lowInventory();
                break;
            case 'Add to Inventory':
                addToInventory();
                break;
            case 'Add New Product':
                addNewProduct();
                break;
        }
    });
}

let quantityArray = [];

function initializeConnection(){
    con.connect(function(err) {
        if (err) throw err;
    });

    let sql = `SELECT * FROM products`;

    con.query(sql, function (err, result) {
        for(let i = 0; i < result.length; i++){
            quantityArray.push(result[i].stock_quantity);
        }
    });
}


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
            quantityArray.push(result[i].stock_quantity);
        }
        if(callback){
            callback();
        }
    });
}

function lowInventory(callback){
    let sql = 'SELECT * FROM products';

    con.query(sql, function (err, result) {
        for(let i = 0; i < result.length; i++){
            if(result[i].stock_quantity <= 5){
                console.log('#: ' + result[i].item_id);
                console.log('Product Name: ' + result[i].product_name);
                console.log('Departement: ' + result[i].department_name);
                console.log('Price($): ' + result[i].price);
                console.log('Quantity: ' + result[i].stock_quantity);
                console.log('----------------------------------');
            }
        }
        if(callback){
            callback();
        }
    });
}

function addToInventory(callback){

    inquirer.prompt([
    {
        name: 'id',
        message: 'Please provide an item identification #: '
    },
    {
        name: 'quantity',
        message: 'Please provide the amount to add to the inventory: '
    }

    ]).then(function(answer){
        let sql = 'UPDATE products set ? WHERE ?';

        findSpecific('SELECT * FROM products WHERE item_id=' + answer.id, updateQuantity);

        function updateQuantity(currentQnt){
            let newQuantity = parseInt(currentQnt + parseInt(answer.quantity, 10));
            console.log('new: ' + newQuantity);
            let info = [
                {
                    stock_quantity: newQuantity,
                },
                {
                    item_id: answer.id,
                }
            ]

            con.query(sql, info, function (err, result) {
                console.log('You Request Has Been Processed.');
                con.end();
            });
        } 
    });
}

function findSpecific(sql, callback){
    con.query(sql, function (err, result) {
        console.log(result[0].stock_quantity);
        callback(result[0].stock_quantity);
    });
}


function addNewProduct(callback){

    inquirer.prompt([
    {
        name: 'newProduct',
        message: 'What is the name of the new product?: '
    },
    {
        name: 'cost',
        message: 'What is the cost of the new product?: '
    },
    {
        name: 'quantity',
        message: 'What is the quantity of the new product?: '
    },
    {
        name: 'department',
        message: 'What is the department of the new product?: '
    }


    ]).then(function(answer){
        let sql = `INSERT INTO products (product_name, department_name, price, stock_quantity) values ('${answer.newProduct}', '${answer.department}','${answer.cost}','${answer.quantity}')`;
        console.log('sql: ' + sql);
            con.query(sql, function (err, result) {
                console.log('sql: ' + sql);
                console.log('You Request Has Been Processed.');
                con.end();
            });
        }); 
}








//     let sql = 'SELECT * FROM products';

//     con.query(sql, function (err, result) {
//         for(let i = 0; i < result.length; i++){
//             if(result[i].stock_quantity <= 5){
//                 console.log('#: ' + result[i].item_id);
//                 console.log('Product Name: ' + result[i].product_name);
//                 console.log('Departement: ' + result[i].department_name);
//                 console.log('Price($): ' + result[i].price);
//                 console.log('Quantity: ' + result[i].stock_quantity);
//                 console.log('----------------------------------');
//             }
//         }
//         if(callback){
//             callback();
//         }
//     });
// }