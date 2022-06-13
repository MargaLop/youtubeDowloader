/* eslint-disable no-console */
const fs = require("fs");
const ytdl = require("ytdl-core");
const express = require("express");
const path = require("path");
const crypto = require("crypto");
const regs = require("./db/registro");
const { Console } = require("console");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({
  extended: true
}));

app.use("/", express.static("static"));

app.get("/video/:parametro", (req, res) => {
  const { parametro } = req.body;
  console.log(parametro);
  const linkName = `video_${parametro}.mp4`;
  console.log(linkName);

  const qualityOptions = ["18", "135", "22", "137"];

  const ytdOptions = {
    //filter: (format) => format.container === "mp4",
    quality: qualityOptions[3],
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

app.use("/login", express.static("login"));


app.post("/registro", (req, res) => {

  const newUser = {
    nombre: req.body.nombre,
    apellidos: req.body.apellidos,
    mail: req.body.email,
    birth_date: req.body.cumple,
    user: req.body.user,
    pass: req.body.pass,
    salt: crypto.randomBytes(22).toString("hex"),
  };

  regs.registrar(newUser);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
