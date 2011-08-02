# Copyright 2011, Folker Hoffmann
# Licensed under the MIT license
# See http://www.opensource.org/licenses/mit-license.php

class Command
  def initialize(params)
    @params = params

    @project = Project.find(:first, :conditions => {:id => params[:project_id] })

    
    @adapter = ExistAdapter.new(params["project_id"])
    @command = "";
    @type = "";
  end

  def on_execute()

  end

  def execute()
      @project.last_modified = Time.now
      @project.save

      Rails.logger.info "Execute " + @type + " in project "  + @params["project_id"] + ":"
      Rails.logger.info "----------------------------------------"
      Rails.logger.info @command unless @command.nil?

      @adapter.do_request(@command) unless @command.nil?
      self.on_execute();

      Rails.logger.info "----------------------------------------"

  end

end