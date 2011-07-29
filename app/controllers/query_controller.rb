require 'exist_adapter'
require 'missions/all_mission_operations'


#require 'cgi'

class QueryController < ApplicationController
before_filter :authenticate

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

def get_folder_as_hash(current_path, project_id)


    folder = {
        "data" => {
          "title" => current_path.split("/").last,
          "icon" => "folder"
        },
        "metadata" => {
          "path" => current_path,
          "type" => "folder",
          "name" => current_path.split("/").last,
          "project_id" => project_id
        },
        "state" => "open",
        "children" => []
    }

    full_path = Rails.root.join("public", "projects", project_id.to_s, current_path).to_s
    Dir.chdir(full_path)

    sub_folders = []
    contents = []

    Dir.glob("*") {|x|
      file_path = current_path + "/" + File.basename(x).to_s;
      if File.directory?(x) then
        sub_folders += [get_folder_as_hash(file_path, project_id)]
        Dir.chdir(full_path) # Jump back after recursion
      else
         file = {
            "data" => {
                "title" => File.basename(x).to_s,
                "icon" => "/images/file.gif"
            },
            "metadata" => {
              "path" => file_path,
              "type" => "file",
              "name" => File.basename(x).to_s,
              "project_id" => project_id
              }
         }
         contents += [file]
      end
    }

  folder["children"] += sub_folders
  folder["children"] += contents

    if folder["children"].size == 0
      folder.delete("children")
      folder.delete("state")
    end

    return folder
end

def show_images

  # Show images of a project
  if params.has_key?(:project_id)
    path = params[:path].to_s
    if not path.match("^drawable")
      render :status => 500, :text => "Path has to start with drawable"
      return
    end

    if params[:path].scan("../").size > 0
      render :status => 500, :text => "Going up ('../')is forbidden"
      return
    end

    directory = get_folder_as_hash(params[:path], params[:project_id])

    json_data = ActiveSupport::JSON.encode(directory)
  # Show images of the current user, except no_project_id
  elsif params.has_key?(:no_project_id)
    projects = Project.find_all_by_user_id(@current_user.id)
    projects_data = []
    projects.each do |project|
      next if project.id == params[:no_project_id].to_i
      project_data = {
        "data" => {
          "title" => project.name,
          "icon" => "folder"
        },
        "metadata" => {
          "name" => project.name,
          "id" => project.id,
          "type" => "project"
        },
        "state" => "open",
        "children" => []
      }
      project_data["children"] += [get_folder_as_hash("drawable", project.id)]
      projects_data += [project_data]
    end
    json_data = ActiveSupport::JSON.encode(projects_data)
  else
    render :text => "Error. Either project_id or no_project_id has to be given", :status => 500
    return
  end
    render :content_type => "application/json", :text => json_data
  end

def show_audio

  # Show images of a project
  if params.has_key?(:project_id)
    path = params[:path].to_s
    if not path.match("^sound")
      render :status => 500, :text => "Path has to start with sound"
      return
    end

    if params[:path].scan("../").size > 0
      render :status => 500, :text => "Going up ('../')is forbidden"
      return
    end

    directory = get_folder_as_hash(params[:path], params[:project_id])

    json_data = ActiveSupport::JSON.encode(directory)
  # Show images of the current user, except no_project_id
  elsif params.has_key?(:no_project_id)
    projects = Project.find_all_by_user_id(@current_user.id)
    projects_data = []
    projects.each do |project|
      next if project.id == params[:no_project_id].to_i
      project_data = {
        "data" => {
          "title" => project.name,
          "icon" => "folder"
        },
        "metadata" => {
          "name" => project.name,
          "id" => project.id,
          "type" => "project"
        },
        "state" => "open",
        "children" => []
      }
      project_data["children"] += [get_folder_as_hash("sound", project.id)]
      projects_data += [project_data]
    end
    json_data = ActiveSupport::JSON.encode(projects_data)
  else
    render :text => "Error. Either project_id or no_project_id has to be given", :status => 500
    return
  end
    render :content_type => "application/json", :text => json_data
  end

  def get_mission_as_hash(mission)
    name = mission.attributes['type'] + "_" + mission.attributes['id']
    name = mission.attributes['name'] unless mission.attributes['name'].nil?
    type = mission.attributes['type']

    manager = AllMissionOperations.new
    image = manager.get_mission_type_properties(type)["icon"]
    mission_data = {
      "data" => {
        "title" => name,
        "icon" => image,
        "attr" => {
          "href" => project_mission_path(params[:project_id], mission.attributes['id'])
        }
      },
      "metadata" => {
        "mission_id" => mission.attributes['id'],
        "type" => type
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
          "icon" => "/images/icons/Game.gif",
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

  def get_next_rule_id

   @project = Project.find(:first, :conditions => {:id => params[:project_id]})
   new_id_value = @project.max_event_id

   # new_id_value = 0
   # Check if this is used already
   # E.g. written by hand
   adapter = ExistAdapter.new(params["project_id"]);

   loop = 0

   begin
     loop += 1
     if (loop > 100) then # Probably an error
       Rails.logger.error("To many IDs for Event tried")
       Rails.logger.error("Project: " + @project.id.to_s)
       Rails.logger.error("Id Value: " + new_id_value.to_s)
       render :status => 500, :text => "An error has occured"
       return 
     end

     new_id_value += 1
     new_id = "r" + new_id_value.to_s
     query_template = ERB.new 'doc("game.xml")//rule[@id="<%= new_id %>"]'

     query = query_template.result(binding)

      Rails.logger.debug(query)

     result = adapter.do_request(query);
     # if there is no event with this id, the result should be an array
     # of zero length
   end while result.length != 0

   template = ERB.new <<-EOF
   {
     "next_rule_id" : "<%= new_id %>"
   }
  EOF
   @project.max_event_id = new_id_value
   @project.save
   json_data = template.result(binding)

   render :content_type => "application/json", :text => json_data

    <<-EOF
    let $game := doc("geoquest/38/game.xml")
return ($game//onEnd[@id="e2"] union $game//onEnter[@id="e2"] union $game//onSuccess[@id="e2"])

EOF
  end


  def list_rules(element, event_type, event_holder)


    rules = []

    request = "./" + event_type + "/rule"

    XPath.each(element, request) do |rule|
      startMissionAction = XPath.first(rule, './action[@type="StartMission"]')
      next_mission_id = nil
      next_mission_id = startMissionAction.attribute("id").to_s unless startMissionAction.nil?
      rule_id = rule.attribute("id").to_s
      rule_data = {
        "id" => rule_id,
        "next_mission" => next_mission_id,
        "type" => event_type
      }
      rules = rules + [rule_data]
    end

    return rules
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

  def get_rules_as_hash(adapter, mission_id, type)
    request = 'doc("game.xml")//mission[@id="' + mission_id.to_s + '"]/' + type + '/rule'

    result = adapter.do_request(request)
    if result.size == 0
      return nil
    else
      result_array = []
      result.each do |rule|
        Rails.logger.info(rule.to_s)
        title = "No ID"
        id = nil
        if rule.attributes.has_key?('id')
          id = rule.attributes['id']
          title = id
        end
        result_array += [{
            "data" => {
              "title" => title,
              "icon" => "/images/file.gif"
            },
            "metadata" => {
              "rule_id" => id,
              "type" => type
            },
          }]
      end
      return result_array
    end
  end

  def show_mission_rules_as_tree
    adapter = ExistAdapter.new(params[:project_id])
    events = ["onStart", "onEnd", "onLeave", "onTap", "onEnter"]
    all_rules = []
    events.each do |event|
      rules = get_rules_as_hash(adapter, params[:mission_id], event)
      if rules != nil
        result_event = {
        "data" => {
          "title" => event,
          "icon" => "folder"
        },
        "metadata" => {
          "type" => event
        },
        "state" => "open",
        "children" => []
        }
        result_event[:children] = rules
        all_rules += [result_event]
      end
    end

    json_data = ActiveSupport::JSON.encode(all_rules)

    render  :text => json_data, :content_type => "application/json"
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

    visualisation_result = adapter.do_request('doc("editor.xml")/editor/visualisation')

    
    # List the missions
    if params.has_key?(:mission_id)
      mission_result = adapter.do_request('doc("game.xml")//mission[@id="' + params[:mission_id] + '"]')
    elsif params.has_key?(:hotspot_id)
      mission_result = nil
    else
      mission_result = adapter.do_request('doc("game.xml")//mission')
    end

    if mission_result != nil
      mission_result.each do |mission|

        on_end = list_rules(mission, "onEnd", :mission)
        on_start = list_rules(mission, "onStart", :mission)
        visualization = get_visualization(visualisation_result, mission.attribute("id").to_s, :mission)

        mission_data = {
          "id" => mission.attribute("id").to_s,
          "name" => mission.attribute("name").to_s,
          "on_start" => on_start,
          "on_end" => on_end,
          "visualization" => visualization
        }

        mission_list[mission.attribute("id")] = mission_data
      end
    end

    # List all hotspots
    

    if params.has_key?(:hotspot_id)
      hotspot_result = adapter.do_request('doc("game.xml")//hotspot[@id="' + params[:hotspot_id] + '"]')
    elsif params.has_key?(:mission_id)
      hotspot_result = nil
    else
      hotspot_result = adapter.do_request('doc("game.xml")//hotspot')
    end

    if hotspot_result != nil
      hotspot_result.each do |hotspot|

        on_enter = list_rules(hotspot, "onEnter", :hotspot)
        on_leave = list_rules(hotspot, "onLeave", :hotspot)
        on_tap = list_rules(hotspot, "onTap", :hotspot)

        visualization = get_visualization(visualisation_result, hotspot.attribute("id").to_s, :hotspot)

        name = hotspot.attribute("name").to_s
        if name.nil? or name == ""
          name = hotspot.attribute("id").to_s
        end

        hotspot_data = {
          "id" => hotspot.attribute("id").to_s,
          "name" => name,
          "on_leave" => on_leave,
          "on_enter" => on_enter,
          "on_tap" => on_tap,
          "visualization" => visualization
        }


        hotspot_list[hotspot.attribute("id")] = hotspot_data
      end
    end

    data = {
      :missions => mission_list,
      :hotspots => hotspot_list
    }

    json_data = ActiveSupport::JSON.encode(data)


    render  :text => json_data, :content_type => "application/json"
  end

  # Queries if an specific image is used
  def is_image_used
    image_path = params[:image]
    project_id = params[:project_id]

    manager = AllMissionOperations.new()
    result = manager.query_image_usage(project_id, image_path)
    Rails.logger.info(result.to_s);
    json_data = ActiveSupport::JSON.encode(result)
    render :text => json_data, :content_type => "application/json"
  end

  # Queries if an specific audio file is used
  # TODO: Implement
  def is_audio_used
    audio_path = params[:audio]
    project_id = params[:project_id]

    result = []
    json_data = ActiveSupport::JSON.encode(result)
    render :text => json_data, :content_type => "application/json"
  end

  def show_mission_types
    all_missions = AllMissionOperations.new()
    properties = all_missions.get_all_mission_properties()
    json_data = ActiveSupport::JSON.encode(properties)
    render :text => json_data, :content_type => "application/json"
  end

  def show_rule
    adapter = ExistAdapter.new(params[:project_id])
    result = adapter.do_request('doc("game.xml")//rule[@id="' + params[:rule_id] + '"]').first();

    startMissionAction = XPath.first(result, './action[@type="StartMission"]')
    next_mission_id = nil
    next_mission_id = startMissionAction.attribute("id").to_s unless startMissionAction.nil?

    rule = {
      :id => result.attributes['id'],
      :next_mission => next_mission_id,
      :actions => []
    }

    XPath.each(result, './action') do |actionElement|
      action = {}
      actionElement.attributes.each do |name, value|
        action[name] = value
      end
      rule[:actions] += [action]
    end

    json_data = ActiveSupport::JSON.encode(rule)
    render :text => json_data, :content_type => "application/json"

  end

end