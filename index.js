const fs = require('fs');
const ytdl = require('ytdl-core');
const express = require('express');
var ffmpeg = require('fluent-ffmpeg');


  const app = express()
  const port = 3000
  var respuesta = {}
  
  function dowloadYt()
  {

    ytdl('http://www.youtube.com/watch?v=aqz-KE-bpKQ')
        .pipe(fs.createWriteStream('video.mp4')); 
    


        ffmpeg.ffprobe('video.mp4',function(err, metadata) 
        {
            console.log(metadata);
            return metadata
        });
        
  }
  
  
  app.get('/', (req, res) =>
  {
    
    ytdl('http://www.youtube.com/watch?v=aqz-KE-bpKQ')
        .pipe(fs.createWriteStream('video.mp4')); 
    
    setTimeout(() => 
    {
        res.download(__dirname+'\\video.mp4')
    }, 2000);

    
  })
  
  app.listen(port, () =>
  {
    console.log(`Example app listening on port ${port}`)
  })