const crypto = require("crypto");
const mysql = require("mysql");
const envData = require("../.env.json");

const connConf = {
  host: envData.host,
  user: envData.user,
  password: envData.password,
  database: "ytdownload",
};

function sha2(string) {
  return crypto.createHash("sha256").update(string).digest("hex");
}

function registrar(
  { nombre, apellidos, mail, birth_date, user, pass, salt },
  res
) {
  const con = mysql.createConnection(connConf);
  con.connect((connErr) => {
    if (connErr) throw connErr;

    const queryIns = `
      INSERT INTO users
      (nombre, apellidos, mail, birth_date, user, salt, hash)
      VALUES
      (
        '${nombre}',
        '${apellidos}',
        '${mail}',
        '${birth_date}',
        '${user}',
        '${salt}',
        '${sha2(pass + salt)}'
      );`;

    con.query(queryIns, (insErr, result, fields) => {
      if (insErr) throw insErr;
      console.log(result);
      con.end();
      res.redirect("/login");
    });
  });
}

function login({ user, pass }, res) {
  const con = mysql.createConnection(connConf);
  con.connect((connErr) => {
    if (connErr) throw connErr;

    const querySel = `
      SELECT * FROM users
      WHERE
        user='${user}'
      ;`;

    con.query(querySel, (selErr, result, fields) => {
      if (selErr) throw selErr;
      console.log(result);

      // TODO: User does not exist
      //   res.redirect('/login?s=nouser');

      // if user found:
      const { salt, hash } = result.pop();
      if (sha2(pass + salt) === hash) {
        res.redirect("/#");
      } else {
        console.log("CONTRASEÑA/USUARIO EQUIVOCADO");
      }

      con.end();
      // res.redirect('/login');
    });
  });
}

module.exports = { registrar, login };
