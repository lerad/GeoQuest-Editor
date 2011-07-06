require 'queries/query'
require 'queries/file_queries'
require 'exist_adapter'
#require 'cgi'

class QueryController < ApplicationController

  def execute
    query = nil

    case params[:query]
    when "DirectoryQuery"
      query = DirectoryQuery.new(params)
    else
      warning = "Unsupported Query: "
      warning += params[:query] unless params[:query].nil?
      logger.warn  warning
    end

    unless query.nil? then
      result = query.execute()
      render :text => result
    else
      render :nothing, :status => 500 #500 = Error
    end

  end

  # Based on the:
  #
  # jQuery File Tree Ruby Connector
  #
  # Version 1.01
  #
  # Erik Lax
  # http://datahack.se
  # 13 July 2008
  def show_dir
    #TODO: 37 => :project_id
    root = Rails.root.join("public", "projects", params[:project_id].to_s).to_s

    Rails.logger.warn("Root: " + root.to_s)

    # cgi = CGI.new
    # cgi.header("type" => "text/html")
    # dir = cgi.params["dir"].to_s
    dir = params[:dir]

    text = "<ul class=\"jqueryFileTree\" style=\"display: none;\">"

    Rails.logger.warn("Still ok")
    
    path = root + "/" + dir
    Rails.logger.warn("Path: " + path.to_s)

    # chdir() to user requested dir (root + "/" + dir)
    Dir.chdir(File.expand_path(path).untaint);
    # check that our base path still begins with root path
    if Dir.pwd[0,root.length] == root then
      Rails.logger.warn("Still in root")
      #loop through all directories
      Dir.glob("*") {
        |x|
        if not File.directory?(x.untaint) then next end
        text += "<li class=\"directory collapsed\"><a href=\"#\" rel=\"#{dir}#{x}/\">#{x}</a></li>";
      }

      #loop through all files
      Dir.glob("*") {
        |x|
        if not File.file?(x.untaint) then next end
        ext = File.extname(x)[1..-1]
        text += "<li class=\"file ext_#{ext}\"><a href=\"#\" rel=\"#{dir}#{x}\">#{x}</a></li>"
      }
    else
      Rails.logger.warn("Left root!")
      #only happens when someone tries to go outside your root directory...
      text += "You are way out of your league"
    end
    text += "</ul>"
    render :content_type => "text/html", :text => text
  end

  def get_mission_as_hash(mission)
    name = mission.attributes['type'] + "_" + mission.attributes['id']
    name = mission.attributes['name'] unless mission.attributes['name'].nil?

    mission_data = {
      "data" => {
        "title" => name,
        "icon" => "mission",
        "attr" => {
          "href" => project_mission_path(params[:project_id], mission.attributes['id'])
        }
      },
      "metadata" => {
        "mission_id" => mission.attributes['id'],
        "type" => mission.attributes['type']
      },
    }
    if(REXML::XPath.match(mission, './mission').length > 0) # Mission has submissions
      mission_data["children"] = []
      mission_data["state"] = "open"
      REXML::XPath.match(mission, './mission').each do |submission|
        mission_data["children"] += [ get_mission_as_hash(submission) ]
      end
    end
    return mission_data
  end

  def show_missions

    json_data = ""
    adapter = ExistAdapter.new(params["project_id"]);

    if params["mission_id"] == "-1" then

      # All top level missions:
      template = ERB.new 'doc("game.xml")/game/mission'
      query = template.result(binding)
      Rails.logger.info(query)

      results = adapter.do_request(query);


      game = {
        "data" => {
          "title" => "Game",
          "icon" => "game",
          "attr" => {
            "href" => project_path(params[:project_id])
          }
        },
        "metadata" => {"mission_id" => -1, "type" => "root"},
        "state" => "open",
        "children" => []
      }

      results.each do |mission|
        mission_data = get_mission_as_hash(mission)
        game['children'] += [mission_data];
      end


      json_data = ActiveSupport::JSON.encode(game)


    else
      template = ERB.new 'doc("game.xml")//mission[@id = "<%= params["mission_id"] %>"]'
      query = template.result(binding)
      results = adapter.do_request(query);

      mission_data = get_mission_as_hash(results[0])
      json_data = ActiveSupport::JSON.encode(mission_data)
    end

    
    render :content_type => "application/json", :text => json_data
  end

  # Returns a new mission id, which is not used already
  def get_next_mission_id

   @project = Project.find(:first, :conditions => {:id => params[:project_id]})
   new_id_value = @project.max_mission_id

   # new_id_value = 0
   # Check if this is used already
   # E.g. written by hand
   adapter = ExistAdapter.new(params["project_id"]);

   loop = 0
    
   begin
     loop += 1
     if (loop > 100) then # Probably an error
       Rails.logger.error("To many IDs for Mission tried")
       Rails.logger.error("Project: " + @project.id.to_s)
       Rails.logger.error("Id Value: " + new_id_value.to_s)
       render :status => 500, :text => "An error has occured"
     end

     new_id_value += 1
     new_id = "m" + new_id_value.to_s
     query = "doc(\"game.xml\")//mission[@id=\"" + new_id + "\"]"
     result = adapter.do_request(query);
     # if there is none mission with this id, the result should be an array
     # of zero length
   end while result.length != 0

   template = ERB.new <<-EOF
   {
     "next_mission_id" : "<%= new_id %>"
   }
  EOF
   @project.max_mission_id = new_id_value
   @project.save
   json_data = template.result(binding)

   render :content_type => "application/json", :text => json_data
  end


  # Returns a new hotspot id, which is not used already
  def get_next_hotspot_id

   @project = Project.find(:first, :conditions => {:id => params[:project_id]})
   new_id_value = @project.max_hotspot_id

   # new_id_value = 0
   # Check if this is used already
   # E.g. written by hand
   adapter = ExistAdapter.new(params["project_id"]);

   loop = 0

   begin
     loop += 1
     if (loop > 100) then # Probably an error
       Rails.logger.error("To many IDs for Hotspot tried")
       Rails.logger.error("Project: " + @project.id.to_s)
       Rails.logger.error("Id Value: " + new_id_value.to_s)
       render :status => 500, :text => "An error has occured"
     end

     new_id_value += 1
     new_id = "h" + new_id_value.to_s
     query = "doc(\"game.xml\")//hotspot[@id=\"" + new_id + "\"]"
     result = adapter.do_request(query);
     # if there is none mission with this id, the result should be an array
     # of zero length
   end while result.length != 0

   template = ERB.new <<-EOF
   {
     "next_hotspot_id" : "<%= new_id %>"
   }
  EOF
   @project.max_hotspot_id = new_id_value
   @project.save
   json_data = template.result(binding)

   render :content_type => "application/json", :text => json_data
  end

  def list_events(element, event_type, event_holder)


    events = []

    request = "./" + event_type

    XPath.each(element, request) do |event|
      comStartMission = XPath.first(event, "./comStartMission")
      next_mission_id = nil
      next_mission_id = comStartMission.attribute("id").to_s unless comStartMission.nil?
      event_id = event.attribute("id").to_s
      event_data = {
        "id" => event_id,
        "next_mission" => next_mission_id,
        "type" => event_type
      }
      events = events + [event_data]
    end

    return events
  end

  # Gets a reference to the whole visualisation element in editor.xml
  # and returns the x/y positions of the mission/hotspot with the given id
  def get_visualization(visualisation_result, id, object_type)

    object_type_string = nil

    case object_type
    when :mission
      object_type_string = "mission"
    when :hotspot
      object_type_string = "hotspot"
    else
      Rails.logger.error("get_visualization: Unknown object_type: " + object_type.to_s)
      return {}
    end

    request = './' + object_type_string + '[@id="' + id + '"]'
    result = XPath.first(visualisation_result, request)

    if result.nil? then
      Rails.logger.info("Create new visualization object for " + object_type_string + ": " + id)

      template = ERB.new <<-EOF
      let $newEntry :=
        <<%= object_type_string %> id="<%= id %>">
            <x>0</x>
            <y>50</y>
        </<%= object_type_string %>>
      return update insert $newEntry into doc("editor.xml")/editor/visualisation
      EOF

      request = template.result(binding)
      adapter = ExistAdapter.new(params["project_id"]);
      adapter.do_request(request)

      visualization = {
        "x" => 0,
        "y" => 50
      }
      return visualization
    else
      x = XPath.first(result, "./x").text.to_i
      y = XPath.first(result, "./y").text.to_i
      visualization = {
        "x" => x,
        "y" => y
      }
      return visualization
    end

  end

  # Is called via ajax
  # Creates a JSON object which contains
  # Information about the missions and hotspots,
  # the interconnection between the missions
  # and information about the visualisation.
  def show_mission_interconnections

    json_data = ""
    adapter = ExistAdapter.new(params["project_id"]);


    mission_list = {}
    hotspot_list = {}

    # List all missions
    mission_result = adapter.do_request('doc("game.xml")//mission')
    visualisation_result = adapter.do_request('doc("editor.xml")/editor/visualisation')

    mission_result.each do |mission|

      on_end = list_events(mission, "onEnd", :mission)
      on_success = list_events(mission, "onSuccess", :mission)
      on_fail = list_events(mission, "onFail", :mission)
      visualization = get_visualization(visualisation_result, mission.attribute("id").to_s, :mission)

      mission_data = {
        "id" => mission.attribute("id").to_s,
        "name" => mission.attribute("name").to_s,
        "on_success" => on_success,
        "on_fail" => on_fail,
        "on_end" => on_end,
        "visualization" => visualization
      }

      mission_list[mission.attribute("id")] = mission_data
    end

    # List all hotspots
    hotspot_result = adapter.do_request('doc("game.xml")//hotspot')

    hotspot_result.each do |hotspot|

      on_tap = list_events(hotspot, "onTap", :hotspot)
      on_enter = list_events(hotspot, "onEnter", :hotspot)
      visualization = get_visualization(visualisation_result, hotspot.attribute("id").to_s, :hotspot)

      hotspot_data = {
        "id" => hotspot.attribute("id").to_s,
        "name" => hotspot.attribute("name").to_s,
        "on_tap" => on_tap,
        "on_enter" => on_enter,
        "visualization" => visualization
      }


      hotspot_list[hotspot.attribute("id")] = hotspot_data
    end

    data = {
      :missions => mission_list,
      :hotspots => hotspot_list
    }

    json_data = ActiveSupport::JSON.encode(data)


    render  :text => json_data, :content_type => "application/json"
  end

end