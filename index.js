/* eslint-disable no-console */
const fs = require("fs");
const ytdl = require("ytdl-core");
const express = require("express");
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

app.use("/", express.static("static"));

// Video endpoints

app.get("/video/:parametro", (req, res) => {
  const { parametro } = req.params;
  console.log(parametro);
  const linkName = `video_${parametro}.mp4`;
  console.log(linkName);

  const qualityOptions = ["18", "22"];

  const ytdOptions = {
    // filter: (format) => format.container === "mp4"
    quality: qualityOptions[1],
  };

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

  ddbb.login({ user, pass }, res);
});

app.post("/registro", (req, res) => {
  const { nombre, apellidos, email, cumple, user, pass } = req.body;

  const newUser = {
    nombre: nombre,
    apellidos: apellidos,
    mail: email,
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
