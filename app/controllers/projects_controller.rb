require 'exist_adapter'
require 'zip/zip'
require 'fileutils'

class ProjectsController < ApplicationController
  before_filter :authenticate
  def index
    @projects = Project.find_all_by_user_id(@current_user.id)
  end

  def show
    @project = Project.find(:first, :conditions => {:id => params[:id], :user_id => @current_user.id})

    adapter = ExistAdapter.new(@project.id)

    mission_query = 'doc("game.xml")/game/mission'
    @missions = adapter.do_request(mission_query);

    if @project.nil?
      redirect_to projects_path, :notice => "A project with this id does not exist or it is not yours"
    end
  end

  def create_zip_file
    adapter = ExistAdapter.new(@project.id)
    xmlfile = adapter.do_request('doc("game.xml")')[0];

    # Do deployment
    if xmlfile.nil?
      render :text => "xmlfile is nil", :status => 500
      Rails.logger.error("xmlfile is nil")
      return
    end

    path_tmp = Rails.root.join("data", "repository", @current_user.id.to_s, "tmp_" + @project.id.to_s + ".zip");
    path_final = Rails.root.join("data", "repository", @current_user.id.to_s,  @project.id.to_s + ".zip");
    path_public = Rails.root.join("public", "projects", @project.id.to_s)

    Zip::ZipFile.open(path_tmp, Zip::ZipFile::CREATE) {|zipfile|

        zipfile.get_output_stream("game.xml") { |f| f.write(xmlfile) }

        # Add drawable and sound (All contents of the "public" folder)

        stack= [""]

        while stack.size() > 0 do
          dir = stack.pop()
          dir = dir + "/" unless dir == ""

          Dir.chdir(path_public.to_s + "/" + dir)
          Dir.glob("*") {|x|
            name = dir + File.basename(x).to_s;
            if File.directory?(x) then
              zipfile.mkdir(name)
              stack.push(name)
            else
              zipfile.add(name, path_public.to_s + "/" + name)

            end
          }
        end

     }

    # Move tmp_ file to final file
    FileUtils.mv(path_tmp.to_s, path_final.to_s)
  end

  def create_repository_entry

    adapter = ExistAdapter.new(params[:project_id])
    hotspot_request = 'doc("game.xml")//hotspot'
    hotspots = adapter.do_request(hotspot_request)

    lat = 0.0
    long = 0.0

    # Compute average hotspot position 
    if hotspots.size > 0
      hotspots.each do | hotspot|
        lat += Float(hotspot.attribute("latitude").to_s)
        long += Float(hotspot.attribute("longitude").to_s)
      end
      lat /= hotspots.size
      long /= hotspots.size
    end

    template = ERB.new <<-EOF

          let $newGame := <game
              name="<%= @project.name %>"
              xmlformat="5"
              file="<%= @project.id %>"
              lastmodified="<%= Time.now.to_i %>"
              latitude="<%= lat %>" 
              longitude="<%= long %>">
         <hotspots>
          <% hotspots.each do |hotspot| %>
            <hotspot latitude="<%= hotspot.attribute("latitude").to_s %>"
                     longitude="<%= hotspot.attribute("longitude").to_s %>"
                     radius="<%= hotspot.attribute("radius").to_s %>">
            </hotspot>

          <% end %>
         </hotspots>
         </game>
      let $repository := doc("repository.xml")/repositories/repository[@name="<%= @current_user.name %>"]
      return update insert $newGame into $repository
  EOF


  command = template.result(binding)
  adapter = ExistAdapter.new("global")
  result = adapter.do_request(command)

  end

  def delete_repository_entry
    template = ERB.new <<-EOF
    let $game := doc("repository.xml")//game[@file="<%= params[:project_id] %>"]
    return update delete $game
EOF

    command = template.result(binding)
    adapter = ExistAdapter.new("global")
    adapter.do_request(command)

  end

  def deploy
    @project = Project.find(:first, :conditions => {:id => params[:project_id], :user_id => @current_user.id})

    create_zip_file
    delete_repository_entry if @project.is_deployed
    create_repository_entry


    @project.is_deployed = true
    @project.save

    render :text => "Everything ok"

  end

  def new
    @project = Project.new
    @project.user = @current_user
  end

  def create
    @project = Project.new (params[:project])
    @project.user = @current_user
    if @project.save

      # Create folders on server:
      projekt_path = Rails.root.join("public", "projects", @project.id.to_s).to_s
      Dir.mkdir(projekt_path)
      Dir.mkdir(projekt_path + "/drawable")
      Dir.mkdir(projekt_path + "/drawable/npcs")
      Dir.mkdir(projekt_path + "/drawable/hotspots")
      Dir.mkdir(projekt_path + "/html")
      Dir.mkdir(projekt_path + "/sound")

      # Upload game.xml to Exists
      adapter = ExistAdapter.new(@project.id)
      game_skeleton_path = Rails.root.join("data", "skeleton.xml");
      adapter.upload_file_as_filename(game_skeleton_path, "game.xml")

      # Upload visualization.xml to Exists
      editor_data_path = Rails.root.join("data", "editor.xml");
      adapter.upload_file_as_filename(editor_data_path, "editor.xml")

      redirect_to projects_path, :notice => 'Project successfully added.'
    end
  end

  # Deletes a project. Should be called via ajax
  def delete
    @project = Project.find(:first, :conditions => {:id => params[:project_id], :user_id => @current_user.id})

    # Delete collection from eXist database
    adapter = ExistAdapter.new(@project.id)
    adapter.delete_collection(@project.id)

    # Delete folder in directory
    project_path = Rails.root.join("public", "projects", @project.id.to_s).to_s

    FileUtils.rm_rf(project_path) if File.exists?(project_path)

    # Delete project from database
    @project.delete()

    render :status => 200, :text => "Project deleted"
  end

end
