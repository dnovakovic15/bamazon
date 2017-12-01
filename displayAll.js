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