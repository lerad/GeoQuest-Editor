class WelcomeController < ApplicationController
  def index
    redirect_to '/login'
  end
end
