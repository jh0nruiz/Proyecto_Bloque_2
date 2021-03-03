function gifoHover(imgContainer, gifo, options) {
  const img = imgContainer.firstElementChild;

  const { title, username, images } = gifo;

  if (window.matchMedia("(max-width:768px").matches) {
    // Mobile
    img.addEventListener("click", () => setModalData(gifo));
  } else {
    // Desktop
    imgContainer.addEventListener("mouseenter", () => {
      const divHover = document.createElement("div");
      divHover.classList.add("hover-img");

      divHover.innerHTML = 
      `
        <div class="icon-container">
            <div class="icon-fav"></div>
            <div class="icon-download"></div>
            <div class="icon-expand"></div>
        </div>
        <div class="text-container">
            <p class="user">${username}</p>
            <p class="title">${title}</p>
        </div>
        `;
      divHover.style.width = `${img.offsetWidth}px`;
      divHover.style.height = `${img.offsetHeight}px`;

      imgContainer.insertBefore(divHover, img);

      const favoriteIcon = divHover.children[0].children[0];
      const downloadIcon = divHover.children[0].children[1];
      const expandIcon = divHover.children[0].children[2];

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

      expandIcon.addEventListener("click", () => setModalData(gifo, options));
    });

    imgContainer.addEventListener("mouseleave", () => {
      const divHover = imgContainer.firstElementChild;
      imgContainer.removeChild(divHover);
    });
  }
}
