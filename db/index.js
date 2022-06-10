var crypto = require('crypto');
var mysql = require('mysql');
const envData= require('../.env.json'); 

var con = mysql.createConnection({
  host: envData.host,
  user: envData.user,
  password: envData.password,
  database: "ytdownload"
});

function imprimeUsuarios(result)
{
    function imprimeUsuario(u)
    {
        console.log(`UsuSaurios: ${u.username} -- ${u.hash}`)
    }

    for (i in result)
    {
        imprimeUsuario(result[i]);
    }
}


con.connect(function(err) 
{
  if (err) throw err;

  var newUser = {
    nombre: 'ramon',
    apellidos: 'garcia',
    mail: 'ramon@gmail.com' ,
    birth_date: '1996/07/06',
    user: 'ramoncito',
    pass: '123456',
    salt: crypto.randomBytes(22).toString("hex")
  }


  var queryIns = `
  INSERT INTO users
  (nombre, apellidos, mail, birth_date, user, salt, hash)
  VALUES
  (
    '${newUser.nombre}',
    '${newUser.apellidos}',
    '${newUser.mail}',
    '${newUser.birth_date}',
    '${newUser.user}',
    '${crypto.createHash('sha256').update(newUser.pass + newUser.salt).digest('hex')}',
    '${newUser.salt}'
  );`;

  con.query(queryIns, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });

  var querySel = "SELECT * FROM ytdownload.users;";

  con.query(querySel, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    imprimeUsuarios(result)
  });

});