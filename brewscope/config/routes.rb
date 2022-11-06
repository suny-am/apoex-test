# frozen_string_literal: true

Rails.application.routes.draw do
    root "beers#index"
    get '/beers', to: 'beers#index'
end
