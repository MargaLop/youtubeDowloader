var mysql = require('mysql');
const envData= require('../.env.json'); 


var con = mysql.createConnection({
  host: envData.host,
  user: envData.user,
  password: envData.password,
  database: "ytdownload"
});


con.connect(function(err) 
{
    if (err) throw err;
        con.query("SELECT * FROM ytdownload.users",function(err, result)
        {
            if (err) throw err;
                console.log("Connected!");
        });
});