// predfined beer interface
import { Beer } from '../interfaces'
export default class BeerManager
{
    /*
    | main function to generate the beer list for the client
    */

    public async generateList(mainDisplay?: HTMLElement, beers?: Array<Beer>, pageList?: Array<Array<Beer>>, selectedPage?: number)
    {

        // wip main display content if repopulating
        mainDisplay.childNodes.forEach(childNode =>
        {
            childNode.remove()
        })

        let currentPage = selectedPage ? selectedPage : 0

        // array to hold pages
        let pages = pageList ? pageList : new Array<Array<Beer>>

        // collect all items into spliced "page" arrays if items exeed 10
        if (pages.length === 0 && beers)
        {
            if (beers.length > 10)
            {
                pages.push(...this.paginate(beers, 10, 10, 10))
                this.createNavigation(mainDisplay, pages)
            }
            else
            {
                // remove pagination as it is not needed for shorter collections
                if (document.querySelector(".pagination-wrapper"))
                {
                    document.querySelector(".pagination-title").remove()
                    document.querySelector(".pagination-wrapper").remove()
                }
                pages.push(beers)
            }
        }

        // populate display with inital page of search results
        pages[currentPage].forEach((beer: Beer) =>
        {
            let beerBox = document.createElement("div")
            beerBox.classList.add('beer-box')
            // generate an image based on the relevant API object key and value
            // for some visual flair!
            let beerImage = document.createElement('img')
            let beerDetails = document.createElement('div')
            beerImage.src = beer.image_url
            beerImage.classList.add('beer-image')
            beerBox.appendChild(beerImage)
            mainDisplay.appendChild(beerBox)
            let beerObject = [
                { name: beer.name },
                { abv: beer.abv },
                { desc: beer.description },
            ]
            // create the beer info items
            beerObject.forEach((object) =>
            {
                let p = document.createElement('p')
                let div = document.createElement('div')
                if (object.name)
                {
                    p.textContent = "Name:"
                    div.textContent = object.name
                    beerBox.appendChild(p)
                    beerBox.appendChild(div)
                } else if (object.abv)
                {
                    p.textContent = "ABV (Alchohol By Volume):"
                    div.textContent = object.abv.toString() + "%"
                    beerBox.appendChild(p)
                    beerBox.appendChild(div)
                } else
                {
                    p.textContent = "Description:"
                    div.textContent = object.desc
                    beerDetails.appendChild(p)
                    beerDetails.appendChild(div)
                }
                p.classList.add("data-header")
                div.classList.add("data-point")
            })
            let goesWellWith = document.createElement('p')
            beerDetails.appendChild(goesWellWith)
            goesWellWith.textContent = "Goes well with:"
            goesWellWith.classList.add('data-header')

            beer.food_pairing.forEach((pairing) =>
            {
                let div = document.createElement("div")

                div.classList.add('data-point')
                div.textContent = "- " + pairing
                beerDetails.appendChild(div)
            })
            beerBox.appendChild(beerDetails)
            beerDetails.classList.add('beer-details')
            // hide the details for users to be revealed if clicked
            beerDetails.classList.add('hidden')
            beerBox.addEventListener('click', (Event) => this.showDetails(Event, beerDetails))
        })
    }

    /*
    | general fetch function
    */

    public async fetchBeers(request: Request)
    {
        return fetch(request).then((response) =>
        {
            try
            {
                return response.json()
            } catch (err)
            {
                console.error(response.statusText, err)
                throw new Error(response.statusText)
            }
        })
    }

    /*
    | general helper function to wip the main display before display new 
    | search results
    */

    public async cleanMainDisplay(mainDisplay: HTMLElement, userSearchNotice: string)
    {
        document.querySelector('pagination-title')?.remove()
        document.querySelector('pagination-wrapper')?.remove()
        mainDisplay.innerHTML = ""
        let notice = document.createElement('p')
        notice.classList.add('no-result-notice')
        notice.textContent = userSearchNotice
        mainDisplay.appendChild(notice)
        return
    }

    /*
    | helper function to create set of 10 items for pagination
    */

    private * paginate(array: Array<Beer>, stride: number, size: number, offset = 0)
    {
        for (let i = offset; i < array.length; i += stride)
        {
            yield array.slice(i, i + size);
        }
    }

    /*
    | helper function to allow user to switch page of results
    */

    private async changePage(mainDisplay: HTMLElement, pageList: Array<Array<Beer>>, Event: MouseEvent)
    {
        let pageNumber = Number((Event.target as HTMLElement).textContent.toString()) - 1
        this.generateList(mainDisplay, null, pageList, pageNumber)
    }

    /*
    | create page navigation controls for user if it does not exist
    */

    private async createNavigation(mainDisplay: HTMLElement, pages: Array<Array<Beer>>)
    {
        if (!document.querySelector(".pagination-wrapper"))
        {
            let pageNavigationTitle = document.createElement('div')
            pageNavigationTitle.textContent = "Pages"
            pageNavigationTitle.classList.add("pagination-title")
            document.body.appendChild(pageNavigationTitle)
            let paginationDisplayWrapper = document.createElement("div")
            paginationDisplayWrapper.classList.add('pagination-wrapper')
            document.body.appendChild(paginationDisplayWrapper)
            for (let i = 0; i < pages.length; i++)
            {
                let pageNumber = document.createElement("p")
                paginationDisplayWrapper.appendChild(pageNumber)
                pageNumber.textContent = (i + 1).toString()
                pageNumber.addEventListener('click', (Event: MouseEvent) => this.changePage(mainDisplay, pages, Event))
            }
        }
    }

    /*
    | helper function to show details of beer
    */

    private async showDetails(Event: MouseEvent, beerDetails: HTMLElement)
    {
        if (beerDetails.classList.contains('hidden'))
        {
            beerDetails.classList.remove('hidden')
        }
        else
        {
            beerDetails.classList.add('hidden')
        }
    }
}
