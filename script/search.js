const inputSearch = document.getElementById("input-search");
const iconSearch = document.getElementById("icon-search");
const iconSearch2 = document.getElementById("icon-search2");

const suggestedContainer = document.getElementById("suggested-container");
const imageHeader = document.getElementById("img-header");

const sectionTrendingTerms = document.getElementById("section-trending-terms");
const lineInputBottom = document.getElementById("line-input-bottom");
const sectionResults = document.getElementById("section-results");
const containerGifosResult = document.getElementById("container-gifos-result");

let viewMoreCount = 0;
let pagOffset = 0;

/*******************************
 * Add Trending Searched Terms
 *******************************/
async function addTrendingSearchTerms() {
  const paragraph = document.getElementById("trending-terms");

  try {
    const terms = await fetchTrendingSearchTerms();

    terms.data.forEach((term, index) => {
      if (index < 5) {
        const upperCaseTerm = term[0].toUpperCase() + term.slice(1);
        const linkTerm = document.createElement("span");
        linkTerm.innerText = upperCaseTerm;
        linkTerm.addEventListener("click", () => {
          addGifosResult(upperCaseTerm, 0);
          sectionResults.scrollIntoView({ behavior: "smooth" });
        });
        paragraph.appendChild(linkTerm);
        if (index !== 4) paragraph.append(", ");
      }
    });
  } catch (error) {
    console.error(error);
  }
}

addTrendingSearchTerms();

/*******************************
 * Add Gifs Results
 *******************************/
async function addGifosResult(term, offset) {
  try {
    const searchedGifos = await fetchSeachGifs(term, offset);
    const headingResult = document.getElementById("heading-gifos-result");

    showElement(sectionResults);
    headingResult.textContent = term;
    containerGifosResult.innerHTML = "";

    if (searchedGifos.data.length) {
      createGifos(containerGifosResult, searchedGifos.data, {
        type: "search",
        search: term,
      });

      const { offset, total_count } = searchedGifos.pagination;

      addPagination(
        containerGifosResult,
        12,
        offset,
        total_count,
        (pageClicked) => {
          addGifosResult(term, pageClicked * 12);
        }
      );
    } else {
      // Not gifs found
      containerGifosResult.innerHTML = `
        <img
          class="no-result-icon"
          src="./images/icon-busqueda-sin-resultado.svg"
          alt="busqueda-sin-resultado"
        />
        <p class="no-result-text">Intenta con otra Búsqueda</p>
      `;
    }
  } catch (error) {
    console.error(error);
  }
}
/**********************************
 * Add Suggested words to Searcher
 **********************************/
inputSearch.addEventListener("input", async (e) => {
  if (e.target.value.length > 1) {
    addClass(iconSearch, "search");
    addClass(iconSearch2, "search2");
    addClass(imageHeader, "hidden");
    addClass(sectionTrendingTerms, "hidden");

    const suggestedWords = await fetchSuggestedWords(e.target.value);
    if (suggestedWords.data.length) {
      displayBlock(suggestedContainer);
      displayBlock(lineInputBottom);

      suggestedContainer.innerHTML = "";
      suggestedWords.data.forEach((word) => {
        const term = document.createElement("li");
        term.innerText = word.name;
        term.tabIndex = 0;
        suggestedContainer.appendChild(term);

        term.addEventListener("click", () => {
          inputSearch.value = term.innerText;
          inputSearch.focus();
          containerGifosResult.innerHTML = "";
          addGifosResult(inputSearch.value);
        });
      });

      iconSearch.addEventListener("click", () => {
        inputSearch.value = "";
        clearSearch();
      });
      iconSearch2.addEventListener("click", () => {
        containerGifosResult.innerHTML = "";
        addGifosResult(inputSearch.value);
        sectionResults.scrollIntoView({ behavior: "smooth" });
      });
    }
  } else {
    clearSearch();
  }
});

function clearSearch() {
  suggestedContainer.innerHTML = "";
  inputSearch.removeEventListener("click", null);
  displayNone(suggestedContainer);
  displayNone(lineInputBottom);
  removeClass(sectionTrendingTerms, "hidden");
  removeClass(imageHeader, "hidden");
  removeClass(iconSearch, "search");
  removeClass(iconSearch2, "search2");
}

inputSearch.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "Enter":
      if (inputSearch.value) {
        containerGifosResult.innerHTML = "";
        addGifosResult(inputSearch.value);
        sectionResults.scrollIntoView({ behavior: "smooth" });
      }
      break;

    case "Escape":
      inputSearch.value = "";
      clearSearch();
      break;

    default:
      break;
  }
});
