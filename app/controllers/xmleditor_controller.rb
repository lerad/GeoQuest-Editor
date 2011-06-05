class XmleditorController < ApplicationController

  before_filter :authenticate

  def show
      mission_query = 'doc("game.xml")/game/mission'
      adapter = ExistAdapter.new(params[:project_id])
      @project = Project.find(:first, :conditions => {:id => params[:project_id], :user_id => @current_user.id})
      @missions = adapter.do_request(mission_query);
      @xmlfile = adapter.do_request('doc("game.xml")')[0];
  end

end
