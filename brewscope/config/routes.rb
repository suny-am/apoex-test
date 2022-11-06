# frozen_string_literal: true

Rails.application.routes.draw do
    root "beers#index"
    get "/beers", to: "beers#index"
    # simple glob capture redirect
    get "/*all", to: redirect("/beers")

    # handle all POST requests since they are not needed
    post "*all", to: "guards#index"
end
