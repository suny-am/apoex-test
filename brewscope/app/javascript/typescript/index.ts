import * as Modules from './modules'

const beerManager = new Modules.BeerManager()

// relevant API query root
const punkApiRoot = "https://api.punkapi.com/v2/beers?per_page=80&"
// predfined beer interface
export default class BeerFetcher
{

    public async typeListen()
    {
        let searchQuery = document.querySelector('.search-field') as HTMLInputElement
        let searchButton = document.querySelector('.search-button')
        // add event listeners for search query submission 
        searchQuery.addEventListener('keyup', (Event: KeyboardEvent) => this.checkInput(Event, searchQuery.value))
        searchButton.addEventListener('click', (Event: MouseEvent) => this.checkInput(Event, searchQuery.value))
    }

    public async checkInput(Event: KeyboardEvent | MouseEvent, searchQuery: string)
    {
        // check for relevant key presses
        if (Event instanceof KeyboardEvent)
        {
            // return silently if key is not "Enter"
            if (Event.key !== 'Enter')
            {
                return
            }
        }

        let mainDisplay = document.querySelector('#main-display') as HTMLElement
        if (searchQuery === undefined || searchQuery === null || searchQuery === "")
        {
            mainDisplay.textContent = "Enter a search term to search for beers!"
            return
        }

        // save API query to variable
        let request = new Request(punkApiRoot + `beer_name=${ searchQuery }`)

        // use the integrated Fetch API to pass the request
        fetch(request).then((response) =>
        {
            try
            {
                response.body.getReader().read().then(async (value) =>
                {
                    // wipe main display of content before repopulating
                    mainDisplay.innerHTML = ""
                    let buffer = await value.value.buffer
                    let json = new TextDecoder().decode(buffer)
                    let beers = JSON.parse(json)
                    // if no results; exit silently with a notice for the user
                    if (beers.length === 0)
                    {
                        mainDisplay.textContent = "no search results..."
                        return
                    }
                    // count amount of returned objects
                    console.log("Retrieved beer count: " + beers.length)
                    {
                        beerManager.generateList(mainDisplay, beers,)
                    }
                })
            }
            // general catch for error handling.
            catch (err)
            {
                throw new Error(err)
            }
        })

    }
}