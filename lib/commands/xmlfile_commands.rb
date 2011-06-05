
require 'commands/command'

class UpdateXmlFileCommand < Command
  
  @xmlfile = ""

  def initialize(params)
    super(params)
    @type = "UpdateXmlFileCommand"

    @command = nil
    @xmlfile = params[:xmlfile]

  end

  def on_execute()
    #TODO: Delete history
    # Upload new game.xml:
    @adapter.upload_data_as_filename(@xmlfile, "game.xml")

  end

end