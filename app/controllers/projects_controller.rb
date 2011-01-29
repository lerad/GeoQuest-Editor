require 'exist_adapter'

class ProjectsController < ApplicationController
  before_filter :authenticate
  def index
    @projects = Project.find_all_by_user_id(@current_user.id)
  end

  def show
    @project = Project.find(:first, :conditions => {:id => params[:id], :user_id => @current_user.id})

    hotspots_query = 'doc("game.xml")/game/mission[@id = "1"]/hotspots/hotspot'
    adapter = ExistAdapter.new(@project.id)
    @hotspots = adapter.do_request(hotspots_query)


    if @project.nil?
      redirect_to projects_path, :notice => "A project with this id does not exist or it is not yours"
    end
  end

  def new
    @project = Project.new
    @project.user = @current_user
  end

  def create
    @project = Project.new (params[:project])
    @project.user = @current_user
    if @project.save
      adapter = ExistAdapter.new(@project.id)
      adapter.upload_file_as_filename("data/game.xml", "game.xml")
      redirect_to projects_path, :notice => 'Project successfully added.'
    end
  end

end
