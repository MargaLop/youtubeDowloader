const fs = require('fs');
const ytdl = require('ytdl-core');
const express = require('express');


const app = express()
const port = 3000


app.get('/video/:parametro', (req, res) =>
{
    let parametro = req.params.parametro
    ytdl('http://www.youtube.com/watch?v='+ parametro)
        .on('finish', function(){ res.download(__dirname+'\\video.mp4')})
        .pipe(fs.createWriteStream(parametro +'.mp4')); 

});

app.listen(port, () =>
{
  console.log(`Example app listening on port ${port}`)
})
