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

def download
  @repo_user = User.find_by_name(params[:name])

  file_path = Rails.root.join("data", "repository", @repo_user.id.to_s, params[:file] + ".zip")



  Rails.logger.debug("Render: " + file_path.to_s)

  send_file(file_path)

  #render :layout => false, :file => file_path, :content_type => "application/octet-stream"

end

end