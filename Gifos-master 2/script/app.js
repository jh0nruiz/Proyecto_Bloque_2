window.onload = function () {
    cambioTema();
    cargarTrending();
    /*_____________________CREACIÓN KEYS EN LOCAL STORAGE_____________________*/
    if (!obtenerListadoFavoritos()) {
        localStorage.setItem('gifsFavoritos', JSON.stringify([]));
    }
    if (!obtenerListadoGifsGuardados()) {
        localStorage.setItem('gifsGuardados', JSON.stringify([]));
    }
};

let listado_favoritos = obtenerListadoFavoritos();
let listado_misgifos = obtenerListadoGifsGuardados();

/*_____________________NAVBAR STICKY_____________________*/
window.onscroll = function () { addStickyNavbar() };
var navbar = document.getElementById('navbar');
var sticky = navbar.offsetTop;
function addStickyNavbar() {
    if (window.pageYOffset >= sticky) {
        navbar.classList.add('sticky-nav')
    } else {
        navbar.classList.remove('sticky-nav');
    }
}

/*_____________________MENÚ HAMBURGUESA_____________________*/
let btnmenu = document.getElementById('menu-burguer');
btnmenu.addEventListener("click", function () {
    document.getElementById('ul-menu').classList.toggle("menudesplegado");
    btnmenu.classList.toggle("menudesplegado");
})

/*_____________________MODO NOCTURNO_____________________*/
let tema = localStorage.getItem('mode');
let cambioTema = () => {
    tema === 'dark'
        ? document.documentElement.setAttribute('data-theme', 'dark')
        : document.documentElement.setAttribute('data-theme', 'light');
    document.getElementById('sp-tema').innerHTML = tema == 'dark' ? 'Diurno' : 'Nocturno';
}

document.getElementById('liModoMocturno').addEventListener("click", function (e) {
    tema = (localStorage.getItem('mode') || 'dark') === 'dark' ? 'light' : 'dark';
    localStorage.setItem('mode', tema);
    cambioTema();
})

/*_____________________FUNCIONAMIENTO TRENDING MOBILE_____________________*/
const track = document.getElementById('contenedor-cards');
if (!!track) {
    let posicionInicial = null; let movimiento = false; let transform = 0;
    const gestureStart = (e) => {
        posicionInicial = e.pageX;
        movimiento = true;
        const transformMatrix = window.getComputedStyle(track).getPropertyValue('transform');
        if (transformMatrix !== 'none') {
            transform = parseInt(transformMatrix.split(',')[4].trim());
        }
    }
    const gestureMove = (e) => {
        if (movimiento) {
            const currentPosition = e.pageX; const diff = currentPosition - posicionInicial;
            track.style.transform = `translateX(${transform + diff}px)`;
        }
    };
    const gestureEnd = (e) => {
        movimiento = false;
    }
    if (window.PointerEvent) {
        window.addEventListener('pointerdown', gestureStart);
        window.addEventListener('pointermove', gestureMove);
        window.addEventListener('pointerup', gestureEnd);
    } else {
        window.addEventListener('touchdown', gestureStart);
        window.addEventListener('touchmove', gestureMove);
        window.addEventListener('touchup', gestureEnd);
        window.addEventListener('mousedown', gestureStart);
        window.addEventListener('mousemove', gestureMove);
        window.addEventListener('mouseup', gestureEnd);
    }
}

/*_____________________FUNCIONAMIENTO TRENDING DESKTOP_____________________*/
const trendings_contenedor = document.querySelector('.contenedor-cards');
const trendings_boton = document.querySelectorAll('.contenedor-trending-button');
const trendings_gif = document.querySelectorAll('.contenedor-cards .card').length;
let contador_gif = 1;
let translateX = 0;

trendings_boton.forEach(button => {
    button.addEventListener('click', (event) => {
        if (event.target.id === 'btn-anterior') {
            if (contador_gif !== 1) {
                contador_gif--;
                translateX += 386;
            }
        } else {
            if (contador_gif !== trendings_gif) {
                contador_gif++;
                translateX -= 386;
            }
        }
        trendings_contenedor.style.transform = `translateX(${translateX}px)`;
    });
});

/*_____________________GENERALIDADES GIPHY_____________________*/
const APIkey = "5g6jRUJypS9HTlHyI0k2xQJMA7nSkpz2";

//Función general para los request a la api 
async function logFetch(url) {
    return fetch(url)
        .then((data) => {
            return data.json();
        })
        .catch(error => console.error('Error:', error));
};

/*_____________________CARGUE INFORMACIÓN DE TRENDING_____________________*/
async function cargarTrending() {
    let puntoFinalTendencia = `https://api.giphy.com/v1/gifs/trending?api_key=${APIkey}`;
    let gifsTrending = await logFetch(puntoFinalTendencia);
    let contenedor = document.getElementById('contenedor-cards');
    for (let i = 0; i < gifsTrending.data.length; i++) {
        let divtrending = document.createElement('div');
        let imggif = document.createElement('img');
        divtrending.classList.add('card');
        divtrending.innerHTML = `<div id="${gifsTrending.data[i].id}" class="card-opciones">
                                    <div class="opciones-gif">
                                        <button id="btn-favorito" class="opcion-button">
                                            <img src="images/icon-fav-hover.svg" alt="icono-favorito">
                                        </button>
                                        <button id="btn-descargar" class="opcion-button">
                                            <img src="images/icon-download.svg" alt="icono-descarga">
                                        </button>
                                        <button id="btn-max" class="opcion-button">
                                            <img src="images/icon-max.svg" alt="icono-maximizar">
                                        </button>
                                    </div>
                                    <div class="opciones-descripcion">
                                        <p class="descripcion user">${gifsTrending.data[i].username}</p>
                                        <p class="descripcion titulo">${gifsTrending.data[i].title}</p>
                                    </div>
                                </div>`;
        //Eventos para cada uno de los botones (Favoritear, descargar y expandir fullscreen)
        divtrending.querySelector('#btn-favorito').addEventListener('click', () => {
            agregarFavoritos(gifsTrending.data[i].id);
        });
        divtrending.querySelector('#btn-descargar').addEventListener('click', () => {
            descargarGif(gifsTrending.data[i].images.original.url);
        });
        divtrending.querySelector('#btn-max').addEventListener('click', () => {
            maximizarGif(gifsTrending.data[i].id);
        });
        //Evento para mobile, presionar tarjeta para fullscreen (no hay hover)
        divtrending.addEventListener('touchstart', () => {
            maximizarGif(gifsTrending.data[i].id);
        })
        imggif.srcset = `${gifsTrending.data[i].images.downsized_large.url}`
        imggif.alt = `${gifsTrending.data[i].id}`;
        divtrending.appendChild(imggif);
        //Validación de que el html contenga el contenedor de trendings
        if (!!contenedor) {
            contenedor.appendChild(divtrending);
        }
    }
};

/*_____________________OBTENER DATOS DEL LOCAL STORAGE_____________________*/
function obtenerListadoFavoritos() {
    return JSON.parse(localStorage.getItem('gifsFavoritos'));
}

function obtenerListadoGifsGuardados() {
    return JSON.parse(localStorage.getItem('gifsGuardados'));
}

/*_____________________INFORMACIÓN DE GIF QUE SE DESEA VISUALIZAR EN FULLSCREEN_____________________*/
async function maximizarGif(idGif) {
    if (!!idGif) {
        let puntoFinalGif = `https://api.giphy.com/v1/gifs/${idGif}?api_key=${APIkey}`;
        let gifInfo = await logFetch(puntoFinalGif);
        let contenedor_maximizado = document.getElementById('gif-max');
        contenedor_maximizado.style.display = 'flex';
        contenedor_maximizado.innerHTML =
            `<button id="btnmax-close" class="close-button">
                    <img src="images/close.svg" alt="icono-busqueda">
             </button>
             <img srcset="${gifInfo.data.images.downsized_large.url}"
                    alt="${gifInfo.data.id}" id="img-maximizado" class="gif-maximizado">
             <article>
                   <div>
                       <p>${gifInfo.data.username}</p>
                       <p class="titulo">${gifInfo.data.title}</p>
                   </div>
                   <div class="maximizado-opciones">
                       <button id="btnmax-favorito">
                           <img src="images/icon-fav-hover.svg" alt="icono-busqueda">
                       </button>
                       <button id="btnmax-descarga">
                           <img src="images/icon-download.svg" alt="icono-busqueda">
                       </button>
                   </div>
             </article>`;
        //Eventos para cada uno de los botones en fullscreen (Favoritea, descargar y cerrar)
        contenedor_maximizado.querySelector('#btnmax-favorito').addEventListener('click', () => {
            agregarFavoritos(gifInfo.data.id);
        });
        contenedor_maximizado.querySelector('#btnmax-descarga').addEventListener('click', () => {
            descargarGif(gifInfo.data.images.original.url);
        });
        contenedor_maximizado.querySelector('#btnmax-close').addEventListener('click', () => {
            contenedor_maximizado.style.display = 'none';
        });
    }
};

/*_____________________AGREGAR FAVORITOS AL LOCAL STORAGE_____________________*/
function agregarFavoritos(nuevoGifFavoritoId) {
    console.log(listado_favoritos);
    listado_favoritos.push(nuevoGifFavoritoId);
    localStorage.setItem('gifsFavoritos', JSON.stringify(listado_favoritos));
}

/*_____________________DESCARGA DEL GIF_____________________*/
async function descargarGif(urlGif) {
    let blob = await fetch(urlGif).then(data => data.blob());;
    invokeSaveAsDialog(blob, "gifos.gif");
}
/*-------------------JRR--------------------*/

async function fetchSuggestedWords(term) {
  return await fetch(
    `https://api.giphy.com/v1/tags/related/${term}?api_key=${APIkey}`
  ).then((response) => response.json());
}

async function fetchSeachGifs(term, offset = 0, limit = 12) {
  return await fetch(
    `https://api.giphy.com/v1/gifs/search?api_key=${APIkey}&q=${term}&limit=${limit}&offset=${offset}`
  ).then((response) => response.json());
}

async function fetchTrendingSearchTerms() {
  return await fetch(
    `https://api.giphy.com/v1/trending/searches?api_key=${APIkey}`
  ).then((response) => response.json());
}

async function fetchTrendingGifos(limit = 3, offset = 0) {
  return await fetch(
    `https://api.giphy.com/v1/gifs/trending?api_key=${APIkey}&limit=${limit}&offset=${offset}`
  ).then((response) => response.json());
}

async function uploadGif(formdata) {
  var requestOptions = {
    method: "POST",
    body: formdata,
    redirect: "follow",
  };

  return await fetch(
    `https://upload.giphy.com/v1/gifs?api_key=${APIkey}`,
    requestOptions
  ).then((response) => response.json());
}

async function fetchGifById(id) {
  console.log(id);
  return await fetch(
    `https://api.giphy.com/v1/gifs/${id}?api_key=${APIkey}`
  ).then((response) => response.json());
}