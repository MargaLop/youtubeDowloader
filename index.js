const fs = require('fs');
const ytdl = require('ytdl-core');
const express = require('express');


const app = express()
const port = 3000
async function downloadVideo(parametro)
{
    await ytdl('http://www.youtube.com/watch?v='+ parametro)
        .pipe(fs.createWriteStream('video.mp4')); 

}
app.get('/video/:parametro', (req, res) =>
{
    let parametro = req.params.parametro

    downloadVideo(parametro)
   
    setTimeout(() => 
    {
        res.download(__dirname+'\\video.mp4')
    }, 2000);
    console.log(parametro)     
});

app.listen(port, () =>
{
  console.log(`Example app listening on port ${port}`)
})
