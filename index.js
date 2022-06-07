const fs = require('fs');
const ytdl = require('ytdl-core');
const express = require('express');
const path = require('path');


const app = express()
const port = 3000


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
                fs.unlinkSync(__dirname+path.sep +linkName);
              } catch(err) {
                console.error(err)
              }
            })
        })
        .pipe(fs.createWriteStream(linkName)); 
    
});

app.listen(port, () =>
{
  console.log(`Example app listening on port ${port}`)
});
