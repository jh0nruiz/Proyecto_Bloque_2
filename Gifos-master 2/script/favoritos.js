let offset = 0;
let contenedor_favoritos = document.getElementById('favoritos-gifs');
let contenedor_sinfavoritos = document.getElementById('sin-favoritos');

cargarFavoritos();

/*_____________________VISUALIZAR MIS GIFOS DEL LOCAL STORAGE_____________________*/
async function cargarFavoritos(offset) {
    contenedor_favoritos.innerHTML = "";
    if (listado_favoritos.length > 0) {
        let puntoFinalFavoritos = `https://api.giphy.com/v1/gifs?ids=${listado_favoritos.toString()}&api_key=${APIkey}&limit=12&offset=${offset}`;
        let gifsFavoritos = await logFetch(puntoFinalFavoritos);
        if (gifsFavoritos.data.length > 0) {
            for (let i = 0; i < gifsFavoritos.data.length; i++) {
                let div = document.createElement('div');
                let img = document.createElement('img');
                div.innerHTML = `<div id="${gifsFavoritos.data[i].id}" class="card-opciones">
                                    <div class="opciones-gif">
                                        <button id="btn-favorito" class="opcion-button">
                                            <img src="images/icon-favoritos-fav.svg" alt="icono-favorito">
                                        </button>
                                        <button id="btn-descargar" class="opcion-button">
                                            <img src="images/icon-download.svg" alt="icono-descarga">
                                        </button>
                                        <button id="btn-max" class="opcion-button">
                                            <img src="images/icon-max.svg" alt="icono-maximizar">
                                        </button>
                                    </div>
                                    <div class="opciones-descripcion">
                                        <p class="descripcion user">${gifsFavoritos.data[i].username}</p>
                                        <p class="descripcion titulo">${gifsFavoritos.data[i].title}</p>
                                    </div>
                                </div>`;
                div.querySelector('#btn-favorito').addEventListener('click', () => {
                    eliminarFavoritos(gifsFavoritos.data[i].id)
                    // alert('Hola');
                });
                div.querySelector('#btn-descargar').addEventListener('click', () => {
                    descargarGif(gifsFavoritos.data[i].images.original.url);
                });
                div.querySelector('#btn-max').addEventListener('click', () => {
                    maximizarGif(gifsFavoritos.data[i].id);
                });
                img.srcset = `${gifsFavoritos.data[i].images.downsized_large.url}`;
                img.alt = `${gifsFavoritos.data[i].id}`;
                div.appendChild(img);
                contenedor_favoritos.appendChild(div);
                contenedor_favoritos.classList.remove('hidden');
            }
        }
        console.log(gifsFavoritos);
    } else {
        contenedor_favoritos.classList.add('hidden');
        contenedor_sinfavoritos.classList.remove('hidden');
    }
}

function eliminarFavoritos(idGifFavorito) {
    let indiceFavorito = listado_favoritos.indexOf(idGifFavorito);
    listado_favoritos.splice(indiceFavorito, 1);
    localStorage.setItem('gifsFavoritos', JSON.stringify(listado_favoritos));
    cargarFavoritos();
}