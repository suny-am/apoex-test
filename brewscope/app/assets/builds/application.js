(() => {
  // app/javascript/typescript/modules/BeerManager.ts
  var BeerManager = class {
    async generateList(mainDisplay, beers, pageList, selectedPage) {
      mainDisplay.childNodes.forEach((childNode) => {
        childNode.remove();
      });
      let currentPage = selectedPage ? selectedPage : 0;
      let pages = pageList ? pageList : new Array();
      if (pages.length === 0 && beers) {
        if (beers.length > 10) {
          pages.push(...this.paginate(beers, 10, 10, 10));
          this.createNavigation(mainDisplay, pages);
        } else {
          if (document.querySelector(".pagination-wrapper")) {
            document.querySelector(".pagination-title").remove();
            document.querySelector(".pagination-wrapper").remove();
          }
          pages.push(beers);
        }
      }
      pages[currentPage].forEach((beer) => {
        let beerBox = document.createElement("div");
        beerBox.classList.add("beer-box");
        let beerImage = document.createElement("img");
        let beerDetails = document.createElement("div");
        beerImage.src = beer.image_url;
        beerImage.classList.add("beer-image");
        beerBox.appendChild(beerImage);
        mainDisplay.appendChild(beerBox);
        let beerObject = [
          { name: beer.name },
          { abv: beer.abv },
          { desc: beer.description }
        ];
        beerObject.forEach((object) => {
          let p = document.createElement("p");
          let div = document.createElement("div");
          if (object.name) {
            p.textContent = "Name:";
            div.textContent = object.name;
            beerBox.appendChild(p);
            beerBox.appendChild(div);
          } else if (object.abv) {
            p.textContent = "ABV (Alchohol By Volume):";
            div.textContent = object.abv.toString();
            beerBox.appendChild(p);
            beerBox.appendChild(div);
          } else {
            p.textContent = "Description:";
            div.textContent = object.desc;
            beerDetails.appendChild(p);
            beerDetails.appendChild(div);
          }
          p.classList.add("data-header");
          div.classList.add("data-point");
        });
        let goesWellWith = document.createElement("p");
        beerDetails.appendChild(goesWellWith);
        goesWellWith.textContent = "Goes well with:";
        goesWellWith.classList.add("data-header");
        beer.food_pairing.forEach((pairing) => {
          let div = document.createElement("div");
          div.classList.add("data-point");
          div.textContent = "- " + pairing;
          beerDetails.appendChild(div);
        });
        beerBox.appendChild(beerDetails);
        beerDetails.classList.add("beer-details");
        beerDetails.classList.add("hidden");
        beerBox.addEventListener("click", (Event) => this.showDetails(Event, beerDetails));
      });
    }
    *paginate(array, stride, size, offset = 0) {
      for (let i = offset; i < array.length; i += stride) {
        yield array.slice(i, i + size);
      }
    }
    async changePage(mainDisplay, pageList, Event) {
      let pageNumber = Event.target.textContent;
      this.generateList(mainDisplay, null, pageList, pageNumber);
    }
    async createNavigation(mainDisplay, pages) {
      if (!document.querySelector(".pagination-wrapper")) {
        let pageNavigationTitle = document.createElement("div");
        pageNavigationTitle.textContent = "Pages";
        pageNavigationTitle.classList.add("pagination-title");
        document.body.appendChild(pageNavigationTitle);
        let paginationDisplayWrapper = document.createElement("div");
        paginationDisplayWrapper.classList.add("pagination-wrapper");
        document.body.appendChild(paginationDisplayWrapper);
        for (let i = 0; i < pages.length; i++) {
          let pageNumber = document.createElement("p");
          paginationDisplayWrapper.appendChild(pageNumber);
          pageNumber.textContent = (i + 1).toString();
          pageNumber.addEventListener("click", (Event) => this.changePage(mainDisplay, pages, Event));
        }
      }
    }
    async showDetails(Event, beerDetails) {
      if (beerDetails.classList.contains("hidden")) {
        beerDetails.classList.remove("hidden");
      } else {
        beerDetails.classList.add("hidden");
      }
    }
  };

  // app/javascript/typescript/index.ts
  var beerManager = new BeerManager();
  var punkApiRoot = "https://api.punkapi.com/v2/beers?per_page=80&";
  var BeerFetcher = class {
    async typeListen() {
      let searchQuery = document.querySelector(".search-field");
      let searchButton = document.querySelector(".search-button");
      searchQuery.addEventListener("keyup", (Event) => this.checkInput(Event, searchQuery.value));
      searchButton.addEventListener("click", (Event) => this.checkInput(Event, searchQuery.value));
    }
    async checkInput(Event, searchQuery) {
      if (Event instanceof KeyboardEvent) {
        if (Event.key !== "Enter") {
          return;
        }
      }
      let mainDisplay = document.querySelector("#main-display");
      if (searchQuery === void 0 || searchQuery === null || searchQuery === "") {
        mainDisplay.textContent = "Enter a search term to search for beers!";
        return;
      }
      let request = new Request(punkApiRoot + `beer_name=${searchQuery}`);
      fetch(request).then((response) => {
        try {
          response.body.getReader().read().then(async (value) => {
            mainDisplay.innerHTML = "";
            let buffer = await value.value.buffer;
            let json = new TextDecoder().decode(buffer);
            let beers = JSON.parse(json);
            if (beers.length === 0) {
              mainDisplay.textContent = "no search results...";
              return;
            }
            console.log("Retrieved beer count: " + beers.length);
            {
              beerManager.generateList(mainDisplay, beers);
            }
          });
        } catch (err) {
          throw new Error(err);
        }
      });
    }
  };

  // app/javascript/application.js
  new BeerFetcher().typeListen();
})();
//# sourceMappingURL=assets/application.js.map
