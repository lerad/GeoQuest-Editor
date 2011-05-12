class ImageGalleryController < ApplicationController

  before_filter :authenticate

  def show
      mission_query = 'doc("game.xml")/game/mission'
      adapter = ExistAdapter.new(params[:project_id])
      @project = Project.find(:first, :conditions => {:id => params[:project_id], :user_id => @current_user.id})
      @missions = adapter.do_request(mission_query);
  end

  def uploadFile
      name = params[:uploadedFile].original_filename
      directory = Rails.root.join("public/projects", params[:project_id], "drawable")

      UploadedFile.save(name, directory, params[:uploadedFile])
      redirect_to :action => 'show'

  end

end
