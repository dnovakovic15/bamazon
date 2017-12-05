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
        choices: ['View Products Sales by Department', 'Create New Department'],
    }

    ]).then(function(answer){
        initializeConnection();

        switch(answer.id){
            case 'View Products Sales by Department':
                producSales();
                break;
            case 'Create New Department':
                lowInventory();
                break;
        }
    });
}

let departmentArray = [];

function TempDepartment(name, overhead){
    name = this.name;
    overhead = this.overhead;
    profit = this.profit;
    totalSales = this.totalSales;
}

function initializeConnection(){
   con.connect(function(err) {
        if (err) throw err;
    });

    let sql = `SELECT * FROM departments`;

    con.query(sql, function (err, result) {
        for(let i = 0; i < result.length; i++){
            let temp = new TempDepartment(result[i].department_name, result[i].over_head_costs);
            departmentArray.push(temp);
        }
    });

}

function producSales(callback){
    let sql = `SELECT departments.department_name, products.product_sales FROM departments INNER JOIN products WHERE departments.department_name = products.department_name`;

    console.log(sql);
    con.query(sql, function (err, result) {
        console.log(result);

        for(let i = 0; i < result.length; i++){
            for(let j = 0; j < departmentArray.length; j++){
                if(result[i].department_name == departmentArray[j].name){
                    departmentArray[j].totalSales = departmentArray[j].totalSales + result[i].product_sales;
                }
            }
        }
    });

//Not finished Yet!