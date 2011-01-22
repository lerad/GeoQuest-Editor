class UsersController < ApplicationController

  before_filter :authenticate, :only => [:edit, :update]

  def index
    
  end

  def new
    @user = User.new
  end

  def create
    @user = User.new (params[:user])
    if @user.save
      redirect_to users_path, :notice => 'User successfully added.'
    end
  end

  def edit
    @user = current_user
  end

  def update
    @user = current_user
    if @user.update_attributes(params[:user])
      redirect_to users_path, :notice => 'Updated user information successfully.'
    else
      render :action => 'edit'
    end
  end

end
