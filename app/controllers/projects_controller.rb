class ProjectsController < ApplicationController
  before_filter :authenticate
  def index
    @projects = Project.find_all_by_user_id(@current_user.id)
  end

  def new
    @project = Project.new
    @project.user = @current_user
  end

  def create
    @project = Project.new (params[:project])
    @project.user = @current_user
    if @project.save
      redirect_to projects_path, :notice => 'Project successfully added.'
    end
  end

end
