import * as Modules from './modules'

const beerManager = new Modules.BeerManager()

// relevant API query root
const punkApiRoot = "https://api.punkapi.com/v2/beers?per_page=80&"
export default class BeerFetcher
{
    /*
    |  general listeners for search input
    */
    public async typeListen()
    {
        let searchQuery = document.querySelector('.search-field') as HTMLInputElement
        let searchButton = document.querySelector('.search-button')
        // add event listeners for search query submission 
        searchQuery.addEventListener('keyup', (Event: KeyboardEvent) => this.search(Event, searchQuery.value))
        searchButton.addEventListener('click', (Event: MouseEvent) => this.search(Event, searchQuery.value))
    }

    public async search(Event: KeyboardEvent | MouseEvent, searchQuery: string)
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

        // let user know that a search term is mandatory and exit silently
        let mainDisplay = document.querySelector('#main-display') as HTMLElement
        if (searchQuery === undefined || searchQuery === null || searchQuery === "")
        {
            beerManager.cleanMainDisplay(mainDisplay, "Enter a search term to search for beers!")
            return
        }

        // save API query to variable
        let request = new Request(punkApiRoot + `beer_name=${ searchQuery }`)
        let response = await beerManager.fetchBeers(request)
        let beers = await response

        // log response output to control length
        console.log("Beer list count: " + beers.length)

        // let user know if no results were found and exit silently
        if (beers.length === 0)
        {
            beerManager.cleanMainDisplay(mainDisplay, "No results found... try again!")
            return
        }

        // recurse through pages if beer list exceeds one page number limit
        // exit recurse if the search result does not contain 80 items,
        // as with the given "per_page" parameter of the punkApiRoot constant
        // setting this would entail there could be no more pages.
        // if the initial quota does not reach 80 the results are passed straight
        // to the client.

        if (beers.length === 80)
        {
            let searchFinished = false
            for (let i = 2; searchFinished != true; i++)
            {
                let recurseRequest = new Request(punkApiRoot + `page=${ i }&beer_name=${ searchQuery }`)
                let response = await beerManager.fetchBeers(recurseRequest)
                let moreBeers = await response
                beers.push(moreBeers)
                if (moreBeers.length < 80)
                {
                    searchFinished = true
                }
            }
            beerManager.generateList(mainDisplay, await beers)
        } else
        {
            beerManager.generateList(mainDisplay, await beers)
        }
    }
}