/* eslint-disable no-console */
const fs = require("fs");
const ytdl = require("ytdl-core");
const express = require("express");
// eslint-disable-next-line import/no-unresolved
const session = require("express-session");
const path = require("path");
const crypto = require("crypto");
const ddbb = require("./db/ddbb");

const app = express();
const port = process.env.PORT || 3000;

// SERVE static content
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
})
);

// app.get("/", (req, res) => {

//   var idUser = req.session.idUser;
//   if (idUser == undefined){
//     res.redirect("/login");
//     console.log(idUser)
//   }

//   else{}
// });

app.use("/", express.static("static"));

// Video endpoints

app.get("/video/:parametro", (req, res) => {
  const { parametro } = req.params;
  const idButton = req.query.idbutton
  console.log(parametro);
  let linkName = `video_${parametro}.mp4`;
  if (idButton === "descargamp3") linkName = `video_${parametro}.mp3`;
  console.log(linkName);

  const qualityOptions = ["18", "22"];

  let ytdOptions = {
    quality: qualityOptions[1],
  };

  // "descarga360", "descarga720", "descargamp3"
  // eslint-disable-next-line default-case
  switch (idButton) {
    case "descarga360":
      ytdOptions = {
        quality: qualityOptions[0],
      };
      break;
    case "descarga720":
      ytdOptions = {
        quality: qualityOptions[1],
      };
      break;
    case "descargamp3":
      ytdOptions = {
        filter: "audioonly",
      };
      break;
  }
  console.log(idButton)
  console.log(ytdOptions)
  ytdl(`http://www.youtube.com/watch?v=${parametro}`, ytdOptions)
    .on("finish", () => {
      res.download(path.join(__dirname, linkName));
      res.on("finish", () => {
        // eliminar videos de la carpeta
        try {
          fs.unlinkSync(path.join(__dirname, linkName));
        } catch (err) {
          console.error(err);
        }
      });
    })
    .pipe(fs.createWriteStream(linkName));
});

// User managment

app.use("/login", express.static("login"));

app.post("/loguser", (req, res) => {
  const { user, pass } = req.body;
  console.log(`LOGUSER endpoint: User ${user} -- PASS: ${pass}`);

  // eslint-disable-next-line no-throw-literal
  if (user === undefined || pass === undefined) throw "USER IS EMPTY";
  // eslint-disable-next-line no-unused-expressions
  req.session.idUser;
  ddbb.login({ user, pass }, res, req);
});

app.get("/logout", (req, res) => {
  req.session.idUser = undefined;
  res.redirect("/login");
});

const validateEmail = (email) => String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

app.post("/registro", (req, res) => {
  const { nombre, apellidos, email, cumple, user, pass } = req.body;

  const newUser = {
    nombre: nombre,
    apellidos: apellidos,
    mail: validateEmail(email),
    birth_date: cumple,
    user: user,
    pass: pass,
    salt: crypto.randomBytes(22).toString("hex"),
  };

  ddbb.registrar(newUser, res);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
