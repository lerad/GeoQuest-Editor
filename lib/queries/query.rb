class Query
  def initialize(params)
    @params = params
    #TODO:   Check if the user owns the project
    
  end

  def execute()
    Rails.logger.info "Execute " + @type + " in project "  + @params["project_id"]

  end

end