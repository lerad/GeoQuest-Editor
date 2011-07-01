class InterconnectionsController < ApplicationController

  before_filter :authenticate
  
  def show
    @project = Project.find(:first, :conditions => {:id => params[:project_id], :user_id => @current_user.id})
  end

end
