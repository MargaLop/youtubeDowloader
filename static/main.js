// https://www.youtube.com/watch?v=bmfudW7rbG0

let cont = 0;

function getVideo() {
  const parmLink = document.getElementById("caja-texto").value.split("=")[1];
  const link = `https://www.youtube.com/embed/${parmLink}`;
  document.getElementById("my-frame").src = link;
}

function anim() {
  const barrBusqueda = document.getElementById("barr-busqueda");
  barrBusqueda.classList.toggle("running");
  // barrBusqueda.classList.toggle('paused');
  const video = document.getElementById("video");
  video.classList.toggle("running");
  // video.classList.toggle('paused');
  const BD = document.getElementById("botones");
  BD.classList.toggle("running");
  // BD.classList.toggle('paused');
}

function functions() {
  cont += 1;
  getVideo();
  if (cont === 1) {
    anim();
  }
  console.log(cont);
}

function descarga(event) {
  const paramLink = document.getElementById("caja-texto").value.split("=")[1];
  const dowLink = `/video/${paramLink}?idbutton=${event.target.id}`;
  // httpGet()
  fetch(dowLink)
    .then((resp) => resp.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      // the filename you want
      a.download = `${paramLink}.mp4`;
      if(event.target.id == "descargamp3")
        a.download = `${paramLink}.mp3`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      });
}

document.getElementById("btn-enter").onclick = functions;

["descarga360", "descarga720", "descargamp3"].forEach((id) => {
  document.getElementById(id).onclick = descarga;
});

/*

function httpGet(theUrl) {
  const xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", theUrl, false); // false for synchronous request
  xmlHttp.send(null);
  return xmlHttp.responseText;
}
*/
