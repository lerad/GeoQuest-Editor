class UsersController < ApplicationController

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
    @user = User.find(params[:id])
  end

  def update
    @user = User.find(params[:id])
    if @user.update_attributes(params[:user])
      redirect_to users_path, :notice => 'Updated user information successfully.'
    else
      render :action => 'edit'
    end
  end

end
