# frozen_string_literal: true

require 'open-uri'
require 'json'

class BeersController < ApplicationController
    # Disable CSRF guards for the purposes of this project
    skip_before_action :verify_authenticity_token    
    def index
    end
    
    def search
        finished = false
        pages = []
        $searchQuery = request.body.read
        # start search
        while finished == false do 
            page = JSON.parse(BeersController.get($searchQuery))
            # filter relevant data for each beer item
            0.upto(page.size - 1) do |i|
                $item = page[i]
                beer = {}
                beer["name"], beer["abv"], beer["image_url"], beer["description"], beer["food_pairing"] = $item.values_at("name", "abv", "image_url", "description", "food_pairing")
                page[i] = beer
            end
            # page with items < 80 means no more pages so we exit
            if page.size < 80 then
                pages << page
                finished = true
            else
                pages << page
            end
        end
        render({plain: "#{JSON.generate(pages)}"})
    end

    def self.get searchQuery
        $punkApiRoot = "https://api.punkapi.com/v2/beers?per_page=80&beer_name="
        $page = URI.parse("#{$punkApiRoot}#{searchQuery}").read
        return $page
    end
end
