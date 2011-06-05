class RepositoryController < ApplicationController

def show
  # I assume they are unique
  # TODO: enforce this during registration
  @repo_user = User.find_by_name(params[:name])
  @deployed_projects = Project.where(:user_id => @repo_user.id, :is_deployed => true)
end

def gamelist
  @repo_user = User.find_by_name(params[:name])
  @deployed_projects = Project.where(:user_id => @repo_user.id, :is_deployed => true)
  render :content_type => "text/xml", :layout => false
end


end
