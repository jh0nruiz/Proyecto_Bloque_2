const containerMyGifos = document.getElementById("container-mygifos");

if (mygifos.length) {
  createGifos(containerMyGifos, mygifos, { type: "mygifo", original: true });
} else {
  containerMyGifos.innerHTML = `
    <img
        class="no-result-icon"
        src="./images/icon-mis-gifos-sin-contenido.svg"
        alt="busqueda-sin-resultado"
    />
    <p class="no-result-text">¡Anímate a crear tu primer GIFO!</p>
    `;
}
