
//Elementos del buscador (input)
let input_busqueda = document.getElementById('in-busqueda');
let btn_busqueda = document.getElementById('btn-buscar');
let lista_sugerencias = document.getElementById('lista-busqueda');
let lupa_busqueda = document.getElementById('img-lupa');
let lupas_icon = document.getElementsByClassName('input_img');
let param_busqueda;
let offset = 0;

//Elementos del div resultados
let titulo = document.getElementById('titulo-resultados');
let resultados = document.getElementById('resultados-gifs');

//Elementos del slider trending
let lista_trending = document.getElementById('lista-treding');
let btn_vermas = document.getElementById('btn-vermas');

let listado_favoritos = obtenerListadoFavoritos();
cargarTrendingSugerencias();

/*_____________________CARGUE DE SUGERENCIAS DE BÚSQUEDA_____________________*/

//Autocompletado campo de búsqueda (li sugerencias)
input_busqueda.addEventListener('keyup', cargarSugerencias);

async function cargarSugerencias() {
    param_busqueda = input_busqueda.value;
    if (!!param_busqueda) {
        let puntoFinalSugerencias = `https://api.giphy.com/v1/tags/related/${param_busqueda}?api_key=${APIkey}&limit=4&rating=g`;
        let sugerenciasBusqueda = await logFetch(puntoFinalSugerencias);
        if (sugerenciasBusqueda.data.length > 0) {
            let items_lista = "";
            for (let i = 0; i < sugerenciasBusqueda.data.length; i++) {
                let items = `<li><img src="images/icon-search-gris.svg" alt="icon-search"/><p>${sugerenciasBusqueda.data[i].name}</p></li>`;
                items_lista = items_lista + items;
            }
            lista_sugerencias.innerHTML = items_lista;
            lista_sugerencias.classList.remove('hidden');
            lista_sugerencias.classList.add('lista-busqueda');
            lupa_busqueda.classList.add('img-lupa', 'hidden');
            lupa_busqueda.classList.remove('hidden');
            input_busqueda.style.width = '80%';
            lupas_icon[0].style.display = 'none';
            lupas_icon[1].style.display = 'block';
        } else {
            restablecerBusqueda();
        }
    } else {
        restablecerBusqueda();
    }
}

/*_____________________CARGUE DE SUGERENCIAS DE TRENDING_____________________*/

//Sugerencias de trending en página inicial
lista_trending.addEventListener('click', (e) => {
    param_busqueda = e.target.textContent;
    restablecerResultados();
    cargarBusqueda(param_busqueda, offset);
    restablecerBusqueda();
})

async function cargarTrendingSugerencias() {
    let puntoFinalTrendingSuge = `https://api.giphy.com/v1/trending/searches?api_key=${APIkey}&limit=5&rating=g`;
    let trendingSugerencias = await logFetch(puntoFinalTrendingSuge);
    if (trendingSugerencias.data.length > 0) {
        let items_lista = "";
        for (let i = 0; i < 5; i++) {
            let items = `<li>${trendingSugerencias.data[i]}</li>`;
            items_lista = items_lista + items;
        }
        lista_trending.innerHTML = items_lista;
    }
}

/*_____________________BÚSQUEDA DE GIFS_____________________*/

//Selección de sugerencia (li) para la búsqueda de un gif
lista_sugerencias.addEventListener('click', (e) => {
    input_busqueda.value = e.target.textContent;
    ejecutarBusqueda(e.target.textContent);
})

//Click en la lupa del campo 
lupa_busqueda.addEventListener('click', () => {
    ejecutarBusqueda(input_busqueda.value);
});

//Presionar tecla enter
input_busqueda.addEventListener('keyup', (e) => {
    if (e.key === "Enter") {
        ejecutarBusqueda(input_busqueda.value);
    }
});

//Click en el botón ver más
//(Cambio de offset para request con el mismo parámetro de búsqueda)
btn_vermas.addEventListener('click', () => {
    offset++;
    offset = offset + 12;
    cargarBusqueda(param_busqueda, offset);
});

function ejecutarBusqueda(value) {
    restablecerResultados();
    param_busqueda = value;
    cargarBusqueda(param_busqueda, offset);
    restablecerBusqueda();
}

lupas_icon[1].addEventListener('click', restablecerBusqueda);

function restablecerResultados() {
    offset = 0;
    resultados.innerHTML = "";
}

function restablecerBusqueda() {
    input_busqueda.value = "";
    lista_sugerencias.innerHTML = "";
    lista_sugerencias.classList.add('hidden');
    lista_sugerencias.classList.remove('lista-busqueda');
    lupa_busqueda.classList.remove('img-lupa', 'hidden');
    lupa_busqueda.classList.add('hidden');
    input_busqueda.style.width = '90%';
    lupas_icon[0].style.display = 'block';
    lupas_icon[1].style.display = 'none';
}

async function cargarBusqueda(parametro, offset) {
    let puntoFinalBusqueda = `https://api.giphy.com/v1/gifs/search?api_key=${APIkey}&limit=12&q=${parametro}&offset=${offset}`;
    let resultadosBusqueda = await logFetch(puntoFinalBusqueda);
    if (resultadosBusqueda.data.length > 0) {
        for (let i = 0; i < resultadosBusqueda.data.length; i++) {
            let div = document.createElement('div');
            let img = document.createElement('img');
            div.innerHTML = `<div class="card-opciones">
                                    <div class="opciones-gif">
                                        <button id="btn-favorito" class="opcion-button">
                                            <img src="images/icon-fav-hover.svg" alt="icono-busqueda">
                                        </button>
                                        <button id="btn-descargar" class="opcion-button">
                                            <img src="images/icon-download.svg" alt="icono-busqueda">
                                        </button>
                                        <button id="btn-max" class="opcion-button">
                                            <img src="images/icon-max.svg" alt="icono-busqueda">
                                        </button>
                                    </div>
                                    <div class="opciones-descripcion">
                                        <p class="descripcion user">${resultadosBusqueda.data[i].username}</p>
                                        <p class="descripcion titulo">${resultadosBusqueda.data[i].title}</p>
                                    </div>
                                </div>`;
            div.querySelector('#btn-favorito').addEventListener('click', () => {
                agregarFavoritos(resultadosBusqueda.data[i].id);
            });
            div.querySelector('#btn-max').addEventListener('click', () => {
                maximizarGif(resultadosBusqueda.data[i].id);
            });
            div.querySelector('#btn-descargar').addEventListener('click', () => {
                descargarGif(resultadosBusqueda.data[i].images.original.url);
            });
            div.addEventListener('touchstart', () => {
                maximizarGif(resultadosBusqueda.data[i].id);
            })
            img.srcset = `${resultadosBusqueda.data[i].images.downsized_large.url}`;
            img.alt = `${resultadosBusqueda.data[i].id}`;
            div.appendChild(img);
            resultados.appendChild(div);
            resultados.classList.remove('hidden');
        }
        titulo.innerHTML = `${parametro}`;
        titulo.classList.remove('hidden');
        btn_vermas.classList.remove('hidden');
    } else {
        resultados.classList.remove('resultados-gifs', 'hidden');
        resultados.classList.add('d-sinresultados');
        titulo.innerHTML = 'Lorem Ipsum';
        let imagen = document.createElement('img');
        imagen.srcset = './images/icon-busqueda-sin-resultado.svg';
        imagen.classList.add('img-sinresultados');
        resultados.appendChild(imagen);
        let texto = document.createElement('h3');
        texto.innerHTML = "Intenta con otra búsqueda";
        texto.classList.add('text-sinresultados');
        resultados.appendChild(texto);
    }
}

