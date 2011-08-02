# Copyright 2011, Folker Hoffmann
# Licensed under the MIT license
# See http://www.opensource.org/licenses/mit-license.php

class WelcomeController < ApplicationController
  def index
    redirect_to '/login'
  end
end
