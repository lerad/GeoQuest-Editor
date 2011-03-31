class MissionsController < ApplicationController

  before_filter :authenticate

  def show

    mission_query = 'doc("game.xml")//mission[@id="' + params[:id] + '"]'
    adapter = ExistAdapter.new(params[:project_id])
    @mission = adapter.do_request(mission_query).first()

    mission_query = 'doc("game.xml")/game/mission'
    @missions = adapter.do_request(mission_query);

    @project = Project.find(:first, :conditions => {:id => params[:project_id], :user_id => @current_user.id})

    mission_type = @mission.attributes['type']

    if(mission_type == 'MapOverview')
        hotspots_query = 'doc("game.xml")//mission[@id = "' + params[:id] +  '"]/hotspots/hotspot'
        @hotspots = adapter.do_request(hotspots_query)
    end

    if(mission_type == 'NPCTalk')
      dialogitems_query = 'doc("game.xml")//mission[@id="' + params[:id] +  '"]/dialogitem'
      @dialogitems = adapter.do_request(dialogitems_query)
    end

    if(mission_type == 'QuestionAndAnswer')
      questions_query = 'doc("game.xml")//mission[@id="' + params[:id] +  '"]/question'
      @questions = adapter.do_request(questions_query)
    end


    render 'question_and_answer' if (mission_type == 'QuestionAndAnswer')
    render 'npc_talk' if (mission_type == 'NPCTalk')
    render 'map_overview' if (mission_type == 'MapOverview')

  end

end
