# frozen_string_literal: true

#require 'open-uri'
#require 'json'

class BeersController < ApplicationController
  def index
  end
end

  # Deprecated function; left in for curiosity

#   def getBeerPage page
#     @data = URI.parse("https://api.punkapi.com/v2/beers?per_page=10&page=#{page}").read
#     @data = JSON.parse(@data)
#     @beers = []
#     @data.each do |hash|
#         beerObject = {}
#         hash.each do |key, value|
#             if key.match(/^id|name|description|abv|image_url|food_pairing$/) do
#                 beerObject["#{key}"] = value
#             end
#         end
#     end
#     @currentPage = page
#       @beers << beerObject
#     end
#   end


