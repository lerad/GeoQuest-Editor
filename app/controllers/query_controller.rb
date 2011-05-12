require 'queries/query'
require 'queries/file_queries'
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
  

end
