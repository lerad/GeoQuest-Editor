# Copyright 2011, Folker Hoffmann
# Licensed under the MIT license
# See http://www.opensource.org/licenses/mit-license.php

require 'exist_adapter'
require 'fileutils'

class UsersController < ApplicationController

  before_filter :authenticate, :only => [:edit, :update]

  def index
    
  end


  def new
    @user = User.new
  end

  def create_user_repository

    # Create repository in XML Database
        template = ERB.new <<-EOF
      let $newRepository := <repository name="<%= @user.name %>">
         </repository>
      let $repositories := doc("repository.xml")/repositories
      return update insert $newRepository into $repositories
  EOF

    command = template.result(binding)
    adapter = ExistAdapter.new("global")
    adapter.do_request(command)

    # Create repository folder:
    repo_dir = Rails.root.join("data", "repository", @user.id.to_s).to_s
    FileUtils.mkdir_p(repo_dir)
    
  end

  def create
    @user = User.new (params[:user])
    if @user.save
      create_user_repository

      redirect_to login_path, :notice => 'User successfully added.'
    end
  end

  def edit
    @user = current_user
  end

  # TODO: If there is something to modify for the user
  def update
    @user = current_user
    if @user.update_attributes(params[:user])
      redirect_to users_path, :notice => 'Updated user information successfully.'
    else
      render :action => 'edit'
    end
  end

end
