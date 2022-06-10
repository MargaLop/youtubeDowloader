// https://www.youtube.com/watch?v=bmfudW7rbG0

var cont = 0;
var server="127.0.0.1:3000";

function getVideo() {
    var parmLink = document.getElementById("caja-texto").value.split('=')[1]

    var link = "https://www.youtube.com/embed/" + parmLink;
    // document.getElementById("my-frame").src = link

    var dowLink = `/video/${parmLink}`

    // httpGet()

    fetch(dowLink)
        .then(resp => resp.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            // the filename you want
            a.download = `${parmLink}.mp4`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            alert('your file has downloaded!'); // or you know, something with better UX...
        })
        .catch(() => alert('oh no!'));
}

function anim() {
    var barrBusqueda = document.getElementById("barr-busqueda");
    barrBusqueda.classList.toggle('running');
    //barrBusqueda.classList.toggle('paused');

    var video = document.getElementById("video");
    video.classList.toggle('running');
    //video.classList.toggle('paused');

    var BD = document.getElementById("boton-descarga");
    BD.classList.toggle('running');
    //BD.classList.toggle('paused');
}

function functions() {
    cont++;
    getVideo();
    if(cont <= 1){
        anim();
    }

    console.log(cont);
}

function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
