class GuardsController < ApplicationController
    skip_before_action :verify_authenticity_token
  def index
    render plain: '404 Not Found', status: :not_found
  end
end
