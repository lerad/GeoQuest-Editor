class Command
  def initialize(params)
    @params = params
    #TODO:   Check if the user owns the project
    
    @adapter = ExistAdapter.new(params["project"])
    @command = "";
    @type = "";
  end

  def execute()
    Rails.logger.info "Execute " + @type + " in project "  + @params["project"] + ":"
    Rails.logger.info "----------------------------------------"
    Rails.logger.info @command
    Rails.logger.info "----------------------------------------"

    @adapter.do_request(@command)
  end

end