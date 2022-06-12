const fs = require('fs');
const ytdl = require('ytdl-core');
const express = require('express');
const path = require('path');

const regs = require("./db/registro");
var crypto = require('crypto')





const app = express()
const port = process.env.PORT || 3000

app.use('/', express.static('static'));

app.get('/video/:parametro', (req, res) =>
{
    let parametro = req.params.parametro;
    console.log(parametro);
    var linkName = 'video_' + parametro +'.mp4';
    console.log(linkName);
    
    ytdl('http://www.youtube.com/watch?v='+ parametro)
        .on('finish', function()
        {
          res.download(__dirname+path.sep +linkName)
            res.on('finish', function()
            {
               //eliminar videos de la carpeta
              try {
                fs.unlinkSync(__dirname + path.sep + linkName);
              } catch(err) {
                console.error(err)
              }
            })
        })
        .pipe(fs.createWriteStream(linkName)); 
});
app.get('/login', (req, res) =>
{
res.sendFile(__dirname +'/login/index.html')
});

app.post('/registro', (req, res) =>
{
  //var newUser = req.newUser;
  var newUser = {
    nombre: 'ramona',
    apellidos: 'pereza',
    mail: 'ramona@gmail.com' ,
    birth_date: '1996/07/06',
    user: 'ramoncita',
    pass: '123456',
    salt: crypto.randomBytes(22).toString("hex")
  }

  regs.registrar(newUser)
});

app.listen(port, () =>
{
  console.log(`Example app listening on port ${port}`)
});

