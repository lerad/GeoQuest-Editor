class MissionsController < ApplicationController

  before_filter :authenticate

  def show

    @project = Project.find(:first, :conditions => {:id => params[:project_id], :user_id => @current_user.id})

    mission_query = 'doc("game.xml")//mission[@id="' + params[:id] + '"]'
    adapter = ExistAdapter.new(params[:project_id])
    @mission = adapter.do_request(mission_query).first()

    # Might happen, if current mission is deleted and the user presses reload

    if @mission.nil?
      redirect_to project_path(@project.id)
      return
    end

    mission_query = 'doc("game.xml")/game/mission'
    @missions = adapter.do_request(mission_query);


    mission_type = @mission.attributes['type']

    if(mission_type == 'MapOverview')
        hotspots_query = 'doc("game.xml")//mission[@id = "' + params[:id] +  '"]/hotspots/hotspot'
        @hotspots = adapter.do_request(hotspots_query)
        if @hotspots.size == 0
          @position = {
            :lat => 50.751663,
            :long => 7.096512
          }
        else
          @position = {:lat => 0.0, :long => 0.0}
          @hotspots.each do |hotspot|
            @position[:lat] += hotspot.attributes['latitude'].to_f
            @position[:long] += hotspot.attributes['longitude'].to_f
          end
          @position[:lat] /= @hotspots.size
          @position[:long] /= @hotspots.size
        end

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
    render 'start_and_exit_screen' if (mission_type == 'StartAndExitScreen')
    render 'webpage' if (mission_type == 'WebPage')
    render 'qr_tag_reading' if (mission_type == 'QRTagReading')
    render 'image_capture' if (mission_type == 'ImageCapture')
    render 'audio_record' if (mission_type == 'AudioRecord')
  end

end
