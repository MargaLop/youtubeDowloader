var mysql = require('mysql');
const envData = require('../.env.json');

var con = mysql.createConnection({
    host: envData.host,
    user: envData.user,
    password: envData.password,
    database: "ytdownload"
});


con.connect(function (err) {
    if (err) throw err;
    function IncSesion() {
        var User = {
            user: 'ramoncito',
            hash: 'bed6424efd434a84cd5e96172835ffe8cb72632b2e1b',
        }

        var queryIns = `SELECT * FROM ytdownload.users
        WHERE 
        user =   '${User.user}' and 
        hash =   '${User.hash}' `;



        con.query(queryIns, function (err, result, fields) {
            if (err) throw err;
            console.log(result)

        });
    }

    function getSalt(){
    var querySalt = `SELECT 
    salt
    FROM ytdownload.users
    WHERE 
    user ='${User.user}';`;

          con.query(querySalt, function (err, result, fields) {
              if (err) throw err;
              console.log(result)
          });
    };
    
});