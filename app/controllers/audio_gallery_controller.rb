# Copyright 2011, Folker Hoffmann
# Licensed under the MIT license
# See http://www.opensource.org/licenses/mit-license.php

class AudioGalleryController < ApplicationController

  before_filter :authenticate

  class Helper
    include Singleton
    include AudioGalleryHelper
  end

  def show
      mission_query = 'doc("game.xml")/game/mission'
      adapter = ExistAdapter.new(params[:project_id])
      @project = Project.find(:first, :conditions => {:id => params[:project_id], :user_id => @current_user.id})
      @missions = adapter.do_request(mission_query);
      @directories = Helper.instance.list_image_directories(@project.id)
  end

  def uploadFile
      name = params[:uploadedFile].original_filename
      directory = Rails.root.join("public/projects", params[:project_id], "sound").to_s
      directory += params[:folder].to_s

      # Directory should end with a "/"
      if directory[directory.length() -1 ] != "/" then
        directory += "/"
      end

      UploadedFile.save(name, directory, params[:uploadedFile])
      redirect_to :action => 'show'

  end
end
