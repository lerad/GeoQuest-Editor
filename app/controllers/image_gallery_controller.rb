class ImageGalleryController < ApplicationController

  before_filter :authenticate


  class Helper
    include Singleton
    include ImageGalleryHelper 
  end

  def show
      mission_query = 'doc("game.xml")/game/mission'
      adapter = ExistAdapter.new(params[:project_id])
      if params[:target_folder].nil?
        @target_folder = "drawable"
      else
        @target_folder = params[:target_folder]
      end
      @project = Project.find(:first, :conditions => {:id => params[:project_id], :user_id => @current_user.id})
      @missions = adapter.do_request(mission_query);
      @directories = Helper.instance.list_image_directories(@project.id)
  end

  def uploadFile
      name = params[:uploadedFile].original_filename
      directory = Rails.root.join("public/projects", params[:project_id], params[:target_folder]).to_s
      Rails.logger.warn(directory)
      
      # Directory should end with a "/"
      if directory[directory.length() -1 ] != "/" then
        directory += "/"
      end

      UploadedFile.save(name, directory, params[:uploadedFile])
      redirect_to :action => 'show', :target_folder => params[:target_folder]

  end

end
