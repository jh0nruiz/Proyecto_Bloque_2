const modalContainer = document.getElementById("modal");
const buttonModalRight = document.getElementById("button-modal-right");
const buttonModalLeft = document.getElementById("button-modal-left");
const modalImageContainer = document.getElementById("modal-img-container");

let offsetModal = 0;
let gifoOptions = "";

function setModalData(gifo, options) {
  const { username, title, images } = gifo;
  gifoOptions = options;

  modalImageContainer.innerHTML = `
    <div id="close-modal" class="icon-close" role="button"></div>
    <img id="image-modal" src=${images?.original?.url}/>
    <div class="footer-img">
      <div class="text">
        <p >${username}</p>
        <p>${title}</p>
      </div>
      <div class="icons">
        <div class="icon-fav"></div>
        <div class="icon-download"></div>
      </div>
    </div>
  `;

  console.log(modalImageContainer);

  const closeIcon = modalImageContainer.children[0];
  const favoriteIcon = modalImageContainer.children[2].children[1].children[0];
  const downloadIcon = modalImageContainer.children[2].children[1].children[1];

  closeIcon.addEventListener("click", () => {
    modalContainer.style.display = "none";
    clearModal();
    createGifos(containerFavorites, favorites, { type: "favorite" });
  });

  if (getFavorite(gifo)) {
    favoriteIcon.classList.add("saved");
  }

  favoriteIcon.addEventListener("click", () => {
    if (getFavorite(gifo)) {
      favoriteIcon.classList.remove("saved");
    } else {
      favoriteIcon.classList.add("saved");
    }
    toggleFavoriteGifo(gifo);
  });

  downloadIcon.addEventListener("click", () => {
    downloadURI(images?.original?.url);
  });

  modalContainer.style.display = "flex";
}

async function addGifoToModal(offset, options) {
  let gifo;

  switch (options.type) {
    case "trending":
      gifo = await fetchTrendingGifos(1, offset);
      gifo = gifo.data[0];
      break;

    case "search":
      gifo = await fetchSeachGifs(options.search, offset, 1);
      gifo = gifo.data[0];
      break;

    case "favorite":
      break;
  }

  setModalData(gifo, options);
}

function clearModal() {
  modalImageContainer.innerHTML = "";
}

buttonModalLeft.addEventListener("click", () => {
  if (offsetModal) offsetModal--;
  clearModal();
  addGifoToModal(offsetModal, gifoOptions);
});

buttonModalRight.addEventListener("click", () => {
  offsetModal++;
  clearModal();
  addGifoToModal(offsetModal, gifoOptions);
});
