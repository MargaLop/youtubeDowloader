/* eslint-disable no-console */
const fs = require("fs");
const ytdl = require("ytdl-core");
const express = require("express");
const path = require("path");
const crypto = require("crypto");
const regs = require("./db/registro");

const app = express();
const port = process.env.PORT || 3000;

app.use("/", express.static("static"));

app.get("/video/:parametro", (req, res) => {
  const { parametro } = req.params;
  console.log(parametro);
  const linkName = `video_${parametro}.mp4`;
  console.log(linkName);

  const ytdOptions = {
    filter: (format) => format.container === "mp4",
    quality: "highest",
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
app.get("/login", (req, res) => {
  res.sendFile(`${__dirname}/login/index.html`);
});

app.post("/registro", (req, res) => {
  // var newUser = req.newUser;
  const newUser = {
    nombre: "ramona",
    apellidos: "pereza",
    mail: "ramona@gmail.com",
    birth_date: "1996/07/06",
    user: "ramoncita",
    pass: "123456",
    salt: crypto.randomBytes(22).toString("hex"),
  };

  regs.registrar(newUser);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
