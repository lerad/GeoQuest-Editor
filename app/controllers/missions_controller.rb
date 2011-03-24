class MissionsController < ApplicationController

  before_filter :authenticate

  def show

    mission_query = 'doc("game.xml")//mission[@id="' + params[:id] + '"]'
    adapter = ExistAdapter.new(params[:project_id])
    @mission = adapter.do_request(mission_query).first()

    mission_query = 'doc("game.xml")/game/mission'
    @missions = adapter.do_request(mission_query);


  end

end
