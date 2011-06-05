class Command
  def initialize(params)
    @params = params
    #TODO:   Check if the user owns the project
    
    @adapter = ExistAdapter.new(params["project_id"])
    @command = "";
    @type = "";
  end

  def on_execute()

  end

  def execute()
    Rails.logger.info "Execute " + @type + " in project "  + @params["project_id"] + ":"
    Rails.logger.info "----------------------------------------"
    Rails.logger.info @command unless @command.nil?
    Rails.logger.info "----------------------------------------"

    @adapter.do_request(@command) unless @command.nil?

    self.on_execute();

  end

end